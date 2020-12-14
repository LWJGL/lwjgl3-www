import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import gzipSize from 'gzip-size';
import CliTable from 'cli-table';
import prettyBytes from './prettyBytes.mjs';
import formatSize from './formatSize.mjs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/*
  POST PRODUCTION:

  * Build a list of assets by reading webpack manifest
  * Detect entry point
  * Mark route assets
    * For each route asset, store its chunk dependencies
    * We must be able to add preload headers for all deps when navigating to a route
    * e.g. entry point + route + route deps...
  * Process each asset in parallel
  * Generate application manifest
    * Store assets that need to be uploaded to the CDN
    * Store entrypoint
    * Store chunk dependencies for each route
  * Display report
*/

async function main() {
  // Read webpack's manifest & chunks into memory
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/js/webpack.manifest.json')));

  // We'll use this to store final production manifest
  const productionManifest = {
    // Boot the app from here
    entry: manifest.entrypoints.main.chunks[0],

    // Build a map of route paths->assets in order to preload chunks as needed
    routes: {},

    // Keep a list of files that we need to upload on the CDN
    assets: {},
  };

  // Build a map that contains each chunk
  const assetMap = new Map();

  manifest.assets
    // flatten assets
    .reduce(
      // accumulator is a named function because it is used recursively (see "assets by status")
      function accumulator(partial, record) {
        switch (record.type) {
          case 'asset':
            return [...partial, record];
          case 'assets by chunk':
            return partial.concat(record.children);
          case 'assets by status':
            // this can be a collection of previously "cached" or newly "emitted" chunks
            return partial.concat(record.children.reduce(accumulator, []));
          default:
            // console.log(record);
            throw new Error(`Unknown record type: ${record.type}`);
        }
      },
      []
    )
    // populate chunk map
    .forEach(record => {
      const name = record.chunkNames.length > 0 ? record.chunkNames[0] : record.name.split('.')[0];
      const src = fs.readFileSync(path.resolve(__dirname, '../public/js', record.name), { encoding: 'utf-8' });

      let asset = {
        id: record.chunks[0],
        name,
        file: record.name,
        cdn: record.name,
        route: name.match(/^route[-]/) !== null && name.indexOf('$') === -1,
        size: record.size,
        gzipSize: gzipSize.sync(src),
      };

      // Add to asset map
      assetMap.set(asset.id, asset);
      productionManifest.assets[asset.id] = asset.cdn;
    });

  // Append route chunk dependencies
  Object.keys(manifest.namedChunkGroups).forEach(chunkName => {
    const groupData = manifest.namedChunkGroups[chunkName];
    const asset = assetMap.get(groupData.chunks.slice(-1)[0]); // chunk id is always the last
    if (asset !== undefined && asset.route === true) {
      productionManifest.routes[asset.name.substr('route-'.length)] = groupData.chunks.reverse();
    }
  });

  // Append manifest.json to deployment assets
  productionManifest.assets.manifest = 'manifest.json';

  // Store production manifest
  await fs.promises.writeFile(
    path.resolve(__dirname, '../public/js/manifest.json'),
    JSON.stringify(productionManifest, null, 2)
  );

  // Done!
  return { manifest: productionManifest, assetMap };
}

const ellipsis = (str, maxlength = 30) => (str.length > maxlength ? `${str.substr(0, maxlength)}…` : str);

main()
  .then(({ manifest, assetMap }) => {
    // Print file report
    let sum = 0;
    let sumGzip = 0;

    // Prepare table
    const tbl = new CliTable({
      head: ['File', 'Optimized', 'Gzipped'],
      colAligns: ['left', 'right', 'right'],
      style: { head: ['cyan'] },
    });

    // Add rows
    Array.from(assetMap.values()).forEach(asset => {
      sum += asset.size;
      sumGzip += asset.gzipSize;

      const row = [];
      const isEntry = manifest.entry === asset.id;

      if (isEntry) {
        row.push(chalk`{cyan ${asset.name}}`);
      } else if (asset.route) {
        row.push(chalk`{yellow ${asset.name}}`);
      } else {
        row.push(`${ellipsis(asset.name)}`);
      }

      row.push(formatSize(asset.size, false, isEntry, false), formatSize(asset.gzipSize, true, isEntry, false));
      tbl.push(row);
    });

    // Push totals
    tbl.push([chalk`{cyan TOTAL}`, prettyBytes(sum), prettyBytes(sumGzip)]);

    // Print report
    console.log(tbl.toString());
  })
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
