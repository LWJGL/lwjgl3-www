import path from 'node:path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'node:fs';
import { copyFile, writeFile } from 'node:fs/promises';
import chalk from 'chalk';
import { gzipSizeSync } from 'gzip-size';
import CliTable from 'cli-table';

// Utils
import prettyBytes from './lib/prettyBytes.mjs';
import formatSize from './lib/formatSize.mjs';
import ellipsis from './lib/ellipsis.mjs';

import manifest from '../public/js/webpack.manifest.json' assert { type: 'json' };

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
    const src = readFileSync(path.resolve(__dirname, '../public/js', record.name), { encoding: 'utf-8' });

    let asset = {
      id: record.chunks[0],
      name,
      file: record.name,
      cdn: record.name,
      route: name.match(/^route[-]/) !== null && name.indexOf('$') === -1,
      size: record.size,
      gzipSize: gzipSizeSync(src),
    };

    // Add to asset map
    assetMap.set(asset.id, asset);
    productionManifest.assets[asset.id] = asset.cdn;
  });

// Append route chunk dependencies
for (let chunkName of Object.keys(manifest.namedChunkGroups)) {
  const groupData = manifest.namedChunkGroups[chunkName];
  const asset = assetMap.get(groupData.chunks.slice(-1)[0]); // chunk id is always the last
  if (asset !== undefined && asset.route === true) {
    productionManifest.routes[asset.name.substr('route-'.length)] = groupData.chunks.reverse();
  }
}

// Store production manifest
await writeFile(path.resolve(__dirname, '../public/manifest.json'), JSON.stringify(productionManifest, null, 2));

/*
// Generate Service Worker
let sw = await readFile(path.resolve(__dirname, '../client/sw.js'), { encoding: 'utf-8' });
let css = await readFile(path.resolve(__dirname, '../public/global.min.css'), { encoding: 'utf-8' });
sw = sw.replace(/manifest = {}/, `manifest = ${JSON.stringify(productionManifest)}`);

const swMD5 = crypto.createHash('MD5');
swMD5.update(sw);
swMD5.update(css);
// TODO: also hash based on HTML template?
sw = sw.replace(/VERSION/, swMD5.digest('hex'));

// optimize
const terserConfig = JSON.parse(await readFile(path.resolve(__dirname, '../scripts/terser-config.json')));
sw = (await minify(sw, terserConfig)).code;
await writeFile(path.resolve(__dirname, '../public/sw.js'), sw, { encoding: 'utf-8' });
*/
await copyFile(path.resolve(__dirname, '../client/sw-destroy.js'), path.resolve(__dirname, '../public/sw.js'));

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
for (let asset of assetMap.values()) {
  sum += asset.size;
  sumGzip += asset.gzipSize;

  const row = [];
  const isEntry = productionManifest.entry === asset.id;

  if (isEntry) {
    row.push(chalk.cyan(asset.name));
  } else if (asset.route) {
    row.push(chalk.yellow(asset.name));
  } else {
    row.push(ellipsis(asset.name));
  }

  row.push(formatSize(asset.size, false, isEntry, false), formatSize(asset.gzipSize, true, isEntry, false));
  tbl.push(row);
}

// Push totals
tbl.push([chalk.cyan('TOTAL'), prettyBytes(sum), prettyBytes(sumGzip)]);

// Print report
console.log(tbl.toString());
