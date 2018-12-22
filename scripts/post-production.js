'use strict';
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const chalk = require('chalk');
const crypto = require('crypto');
const gzipSize = require('gzip-size');

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
  const manifest = require('../public/js/webpack.manifest.json');

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

  manifest.assets.forEach(record => {
    const name = record.chunkNames.length > 0 ? record.chunkNames[0] : record.name.split('.')[0];
    const src = fs.readFileSync(path.resolve(__dirname, '../public/js', record.name), { encoding: 'utf-8' });

    let asset = {
      id: record.chunks[0],
      name,
      file: record.name,
      cdn: record.name,
      route: name.match(/^route[-]/) !== null, // && name.indexOf('~') === -1,
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

  // Hash and append core.css
  await (async () => {
    let contents = await readFile(path.resolve(__dirname, '../public/css/core.css'), { encoding: 'utf-8' });
    const MD5 = crypto.createHash('MD5');
    MD5.update(contents);
    const hash = MD5.digest('hex');

    const asset = {
      id: 'css',
      name: 'core',
      file: 'core.css',
      cdn: `core.${hash}.css`,
      route: false,
      size: Buffer.byteLength(contents, 'utf8'),
      gzipSize: gzipSize.sync(contents),
    };

    await writeFile(path.resolve(__dirname, `../public/css/${asset.cdn}`), contents);
    productionManifest.assets.css = asset.cdn;
    assetMap.set('css', asset);
  })();

  // Store production manifest
  await writeFile(path.resolve(__dirname, '../public/js/manifest.json'), JSON.stringify(productionManifest, null, 2));

  // Done!
  return { manifest: productionManifest, assetMap };
}

function ellipsis(str, maxlength = 25) {
  if (str.length > maxlength) {
    return str.substr(0, maxlength) + '...';
  }
  return str;
}

main()
  .then(({ manifest, assetMap }) => {
    // Print file report
    const CliTable = require('cli-table');
    const prettyBytes = require('./prettyBytes');
    const formatSize = require('./formatSize');

    let sum = 0;
    let sumGzip = 0;

    // Prepare table
    const tbl = new CliTable({
      head: ['File', 'Optimized', 'Gzipped'],
      colAligns: ['left', 'left', 'right', 'right'],
      style: { head: ['cyan'] },
    });

    // Add rows
    Array.from(assetMap.values()).forEach(asset => {
      sum += asset.size;
      sumGzip += asset.gzipSize;

      const row = [];
      const isEntry = manifest.entry === asset.id || asset.id === 'css';

      if (isEntry) {
        row.push(chalk`{cyan > ${asset.name}}`);
      } else if (asset.route) {
        row.push(asset.name);
      } else {
        row.push(`* ${ellipsis(asset.name)}`);
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
