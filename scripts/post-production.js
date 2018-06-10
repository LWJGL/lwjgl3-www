'use strict';
const os = require('os');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const { fork } = require('child_process');
const Sema = require('async-sema');

/*
  * POST PRODUCTION:
  *

  TODO:
    The same way we remember deployed files we should remember hashes of source files.
    This will allow us to skip processing of chunks that haven't changed at all and
    make release process even faster.
*/

async function main() {
  console.log(chalk`{yellow Compiling list of files & routes:}`);

  // We'll store files for our report here
  const fileReport = [];

  // Read webpack's manifest & chunks into memory
  const manifest = require('../public/js/webpack.manifest.json');

  // Build a map that contains each chunk
  // For each chunk we save its filename, id, and size
  const assetMap = new Map();
  manifest.assets.forEach(asset => {
    assetMap.set(asset.chunks[0], {
      id: asset.chunks[0],
      name: asset.chunkNames[0],
      file: asset.name,
      size: asset.size,
    });
  });

  const entryChunkId = manifest.entrypoints.main.chunks[0];

  console.dir(assetMap);
  console.log(entryChunkId);
  process.exit(0);

  // We'll use this to store final production manifest
  const productionManifest = {
    // Boot the app from here
    entry: '',

    // HTML Inject webpack manifest to avoid network roundtrip
    webpack: '',

    // Keep a list of files that we need to upload on the CDN
    files: [],

    // Build a map of route paths->JS files in order to preload chunks as needed
    routes: {},
  };

  // For each item store chunk id, original filename, hashed filename
  // We use this to replace map in manifest.js
  const chunkFileMap = [];

  // Hold Promises of jobs currently running
  const childMap = {};

  function processChunk(child, data) {
    return new Promise((resolve, reject) => {
      childMap[child.pid] = {
        resolve, // Call when msg.type === 'done'
        reject, // Call when msg.type === 'error'
      };

      // Begin job execution
      child.send(data);
    });
  }

  // Handle forked process messages
  function receiveChildMessage(msg) {
    switch (msg.type) {
      case 'done':
        childMap[msg.pid].resolve(msg.report);
        break;
      case 'error':
        childMap[msg.pid].reject(msg.error);
        break;
      case 'manifest-file':
        productionManifest.files.push(msg.name);
        break;
      case 'manifest-entry':
        productionManifest.entry = msg.name;
        break;
      case 'manifest-webpack':
        productionManifest.webpack = msg.name;
        break;
      case 'manifest-route':
        productionManifest.routes[msg.route] = msg.name;
        break;
      case 'manifest-chunk':
        chunkFileMap.push(msg.file);
        break;
    }

    childMap[msg.pid] = null;
  }

  // Create process pool -- We will process {CPU_CORES} chunks at a time
  const pool = new Sema(Math.max(os.cpus().length, 2), {
    initFn: () => {
      const child = fork('scripts/post-production-process.js');
      child.on('message', receiveChildMessage);
      return child;
    },
  });

  let runtimeChunk;

  await Promise.all(
    manifest.chunks.map(async chunk => {
      if (chunk.names[0] === 'runtime~main') {
        // Skip & process last
        runtimeChunk = chunk;
        return;
      }
      // Get next available from pool
      const child = await pool.acquire();
      // Run process
      const report = await processChunk(child, chunk);
      // Return to pool
      pool.release(child);
      // Add result to files report
      fileReport.push(report);
    })
  );

  // Process runtime~main last
  await (async () => {
    const child = await pool.acquire();
    runtimeChunk.chunkFileMap = chunkFileMap;
    const report = await processChunk(child, runtimeChunk);
    pool.release(child);
    fileReport.push(report);
  })();

  // Drain forks
  (await pool.drain()).map(child => child.disconnect());

  // Store production manifest
  fs.writeFileSync(path.resolve(__dirname, '../public/js/manifest.json'), JSON.stringify(productionManifest, null, 2));

  // Done!
  return fileReport;
}

main()
  .catch(e => {
    console.log(e);
    process.exit(1);
  })
  .then(fileReport => {
    // Print file report
    const CliTable = require('cli-table');
    const prettyBytes = require('./prettyBytes');
    const formatSize = require('./formatSize');

    let sumOriginal = 0;
    let sum = 0;
    let sumGzip = 0;

    // Prepare table
    const tbl = new CliTable({
      head: ['File', 'Hash', 'Original', 'Optimized', 'Gzipped'],
      colAligns: ['left', 'left', 'right', 'right', 'right'],
      style: { head: ['cyan'] },
    });

    // Add rows
    fileReport.forEach(asset => {
      sumOriginal += asset.originalSize;
      sum += asset.size;
      sumGzip += asset.gzipSize;

      const row = [];

      if (asset.isEntry) {
        row.push(chalk`{cyan > ${asset.originalName}}`);
      } else if (asset.isRoute) {
        row.push(asset.originalName);
      } else {
        row.push(`* ${asset.originalName}`);
      }

      row.push(
        asset.hash,
        prettyBytes(asset.originalSize),
        formatSize(asset.size, false, asset.isEntry, false),
        formatSize(asset.gzipSize, true, asset.isEntry, false)
      );

      tbl.push(row);
    });

    // Push totals
    tbl.push(['', chalk`{cyan TOTAL}`, prettyBytes(sumOriginal), prettyBytes(sum), prettyBytes(sumGzip)]);

    // Print report
    console.log(tbl.toString());
  });
