'use strict';
const os = require('os');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const { fork } = require('child_process');
const Sema = require('async-sema');

/*
  TODO: The same way we remember deployed files we should remember hashes of source files.
        This will allow us to skip processing of chunks that haven't changed at all and
        make release process even faster.
*/

async function main() {
  console.log(chalk`{yellow Compiling list of files & routes:}`);

  // We'll store files for our report here
  const fileReport = [];

  // Read webpack's manifest & chunks into memory
  const manifest = require('../public/js/webpack.manifest.json');

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

  // Process chunks
  const chunks = [];
  let runtimeChunk;

  manifest.chunks.forEach(chunk => {
    if (chunk.names[0] === 'main-runtime') {
      runtimeChunk = chunk;
    } else {
      chunks.push(chunk);
    }
  });

  // Paralle processing of chunks
  const jobMap = {};

  function processChunk(job, chunk) {
    return new Promise((resolve, reject) => {
      jobMap[job.pid] = {
        resolve,
        reject,
      };

      job.send(chunk);
    });
  }

  function jobMessage(msg) {
    switch (msg.type) {
      case 'done':
        jobMap[msg.pid].resolve(msg.report);
        break;
      case 'error':
        jobMap[msg.pid].reject(msg.error);
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

    jobMap[msg.pid] = null;
  }

  // Create process pool -- {CPU_CORES} chunks at a time
  const pool = new Sema(Math.max(os.cpus().length, 2), {
    initFn: () => {
      const frk = fork('scripts/post-production-process.js');
      frk.on('message', jobMessage);
      return frk;
    },
  });

  await Promise.all(
    chunks.map(async chunk => {
      // Get next available from pool
      const job = await pool.v();
      // Run process
      const report = await processChunk(job, chunk);
      // Return to pool
      pool.p(job);
      // Add result to files report
      fileReport.push(report);
    })
  );

  // Drain forks
  (await pool.drain()).map(job => job.disconnect());

  // Process main-runtime last

  // Store production manifest
  // fs.writeFileSync(path.resolve(__dirname, '../public/js/manifest.json'), JSON.stringify(productionManifest, null, 2));

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
