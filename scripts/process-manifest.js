'use strict';

function out(name, status) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(`${name}: ${status}`);
}

/*
 * ------------------------------------------------------------------------------------------------------------------------
 * Post production steps
 * ------------------------------------------------------------------------------------------------------------------------
 *
 * 1. Read webpack manifest and compile list of files & routes
 * 2. Process each file with uglify-js
 * 3. Compute hashes of final files
 * 4. Store each production file on disk
 * 5. Generate production manifest
 * 6. Generate & print file size report
 */

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const uglify = require('uglify-es');
const gzipSize = require('gzip-size');
const chalk = require('chalk');

console.log(chalk`{yellow Compiling list of files & routes:}`);

// Read webpack's manifest & chunks into memory
const manifest = require('../public/js/webpack.manifest.json');
// We'll us this to detect route chunks
const routeRegExp = new RegExp('^route[-][a-z][a-z-_/]+$');
// We'll store files for our report here
const fileReport = [];
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

// Store entrypoint names in an array
const entrypoints = Object.keys(manifest.entrypoints);

// For each item store chunk id, original filename, hashed filename
// We use this to replace map in manifest.js
const chunkFileMap = [];

// Guarantee that we will process main last and main-runtime 2nd from last
const chunkPriority = {
  'main-runtime': 1,
  main: 2,
};

const chunkSort = (a, b) => {
  const aOrder = chunkPriority[a.names[0]] || 0;
  const bOrder = chunkPriority[b.names[0]] || 0;

  if (aOrder < bOrder) {
    return -1;
  }
  if (aOrder > bOrder) {
    return 1;
  }
  return 0;
};

// Process chunks
manifest.chunks.sort(chunkSort).forEach(chunk => {
  const chunkName = chunk.names[0];
  const chunkFilename = chunk.files[0];

  out(chunkName, 'reading');
  const originalPath = path.resolve(__dirname, '../public/js', chunkFilename);

  const report = {
    originalName: chunkFilename,
    name: chunkFilename,
    hash: '',
    isEntry: false,
    isRoute: false,
    originalSize: fs.statSync(originalPath).size,
    size: 0,
    gzipSize: 0,
  };

  // Read contents
  let contents = fs.readFileSync(originalPath, { encoding: 'utf-8' });

  if (chunkName === 'main-runtime') {
    // Replace chunk filenames
    chunkFileMap.forEach(item => {
      contents = contents.replace(item.name, item.hashed);
    });
  }

  // Process with uglify-es
  out(chunkName, 'minimizing');
  const uglifyResult = uglify.minify(contents, {
    compress: {
      drop_console: true,
      inline: true,
      keep_fargs: false,
      keep_infinity: true,
      passes: 2,
      pure_getters: true,
      unsafe_comps: true,
      unsafe_Function: true,
      unsafe_proto: true,
      unsafe_regexp: true,
    },
    mangle: true,
    sourceMap: false,
    ecma: 5,
    ie8: false,
    safari10: true,
    toplevel: true,
    warnings: 'verbose',
  });
  if (uglifyResult.error) {
    console.error(uglifyResult.error);
    process.exit(1);
  }
  contents = uglifyResult.code;

  // Compute hash
  out(chunkName, 'computing hash');
  const hash = crypto.createHash('MD5');
  hash.update(contents);
  report.hash = hash.digest('hex');

  // Compute gzip size
  out(chunkName, 'measuring');
  report.size = Buffer.byteLength(contents, 'utf8');
  report.gzipSize = gzipSize.sync(contents);
  report.name = `${chunkName}.${report.hash}.js`;

  // Store reference so we can deploy later
  productionManifest.files.push(report.name);

  out(chunkName, 'storing');
  if (chunkName === 'main') {
    report.isEntry = true;
    productionManifest.entry = report.name;
  } else if (chunkName === 'main-runtime') {
    productionManifest.webpack = report.name;
  } else {
    // Detect route
    const route = chunkName.match(routeRegExp);
    if (route !== null) {
      report.isRoute = true;
      productionManifest.routes[chunkName.substr('route-'.length)] = report.name;
    }
  }

  // Push to chunkFileMap
  if (chunkName !== 'main-runtime') {
    chunkFileMap.push({
      id: chunk.id,
      name: chunkName,
      hashed: `${chunkName}.${report.hash}`,
    });
  }

  // Store to disk
  fs.writeFileSync(path.resolve(__dirname, '../public/js', report.name), contents);

  // Add to files report
  fileReport.push(report);
});

// Store production manifest
fs.writeFileSync(path.resolve(__dirname, '../public/js/manifest.json'), JSON.stringify(productionManifest, null, 2));

// Done!
process.stdout.clearLine();
process.stdout.cursorTo(0);
console.log('Done!');

/*
 * ------------------------------------------------------------------------------------------------------------------------
 * Print file report
 * ------------------------------------------------------------------------------------------------------------------------
 */
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

// All done!
process.exit(0);
