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
const UglifyJS = require('uglify-js');
const gzipSize = require('gzip-size');
const chalk = require('chalk');

console.log(chalk`{yellow Compiling list of files & routes:}`);

// Read webpack's manifest & chunks into memory
const manifest = require('../public/js/webpack.manifest.json');
// We'll us this to detect route chunks
const routeRegExp = new RegExp('^route[-]([a-z][a-z-_/]+)\\.js$');
// We'll store files for our report here
const fileReport = [];
// We'll use this to store final production manifest
const productionManifest = {
  // Boot the app from here
  entry: '',

  // App needs this to know where to load the other chunks from
  // We'll serialize it later and inject inline as JavaScript (webpackManifest={})
  chunks: {},

  // Build a map of route paths->JS files in order to preload chunks as needed
  routes: {},
};

// Store entrypoint names in an array
const entrypoints = Object.keys(manifest.entrypoints);

manifest.assets.forEach(asset => {
  // Skip JSON files
  if (asset.name.endsWith('json')) {
    return;
  }

  out(asset.name, 'reading');
  const originalPath = path.resolve(__dirname, '../public/js', asset.name);

  const report = {
    originalName: asset.name,
    name: asset.name,
    hash: '',
    isEntry: false,
    isRoute: false,
    originalSize: fs.statSync(originalPath).size,
    size: 0,
    gzipSize: 0,
  };

  // Read contents
  let contents = fs.readFileSync(originalPath, { encoding: 'utf-8' });

  // Process with uglify-js
  out(asset.name, 'minimizing');
  const uglifyResult = UglifyJS.minify(contents, {
    warnings: false,
    compress: {
      sequences: true,
      properties: true,
      dead_code: true,
      drop_debugger: true,
      // unsafe: true,
      unsafe_comps: true,
      unsafe_comps: true,
      unsafe_Func: true,
      unsafe_math: false,
      unsafe_proto: true,
      unsafe_regexp: true,
      conditionals: true,
      comparisons: true,
      evaluate: true,
      booleans: true,
      typeofs: true,
      loops: true,
      unused: true,
      toplevel: false,
      top_retain: [],
      hoist_funs: true,
      hoist_vars: false,
      if_return: true,
      inline: true,
      join_vars: true,
      cascade: true,
      collapse_vars: true,
      reduce_vars: true,
      warnings: false,
      negate_iife: false,
      pure_getters: true,
      pure_funcs: null,
      drop_console: true,
      expression: false,
      keep_fargs: false,
      keep_fnames: false,
      passes: 2,
      keep_infinity: true,
      side_effects: true,
    },
    // mangle: {
    //   reserved: [],
    //   toplevel: false,
    //   keep_fnames: false,
    //   eval: false,
    //   properties: {
    //     reserved: [],
    //     regex: null,
    //     keep_quoted: false,
    //     debug: false,
    //     builtins: false,
    //   },
    // },
    output: {
      ascii_only: false,
      beautify: false,
      bracketize: false,
      comments: false,
      indent_level: 2,
      indent_start: 0,
      keep_quoted_props: false,
      max_line_len: false,
      preamble: null,
      preserve_line: false,
      quote_keys: false,
      quote_style: 0,
      semicolons: true,
      shebang: false,
      wrap_iife: true,
    },
    sourceMap: false,
  });
  if (uglifyResult.error) {
    console.error(uglifyResult.error);
    process.exit(1);
  }
  contents = uglifyResult.code;

  // Compute hash
  out(asset.name, 'computing hash');
  const hash = crypto.createHash('MD5');
  hash.update(contents);
  report.hash = hash.digest('hex');

  // Compute gzip size
  out(asset.name, 'measuring');
  report.size = Buffer.byteLength(contents, 'utf8');
  report.gzipSize = gzipSize.sync(contents);

  out(asset.name, 'storing');
  if (entrypoints.indexOf(asset.chunkNames[0]) >= 0) {
    // Mark as entrypoint
    report.isEntry = true;
    report.name = `main.${report.hash}.js`;

    // Store in productionManifest.entry
    productionManifest.entry = report.name;
  } else {
    // Detect route
    const route = asset.name.match(routeRegExp);
    if (route !== null) {
      // Mark as route
      report.isRoute = true;

      // Use matched route name as filename prefix
      report.name = `${route[1]}.${report.hash}.js`;

      // Store in productionManifest.routes
      productionManifest.routes[route[1]] = report.name;
    } else {
      // Use the chunkName for filename prefix
      report.name = `${asset.chunkNames[0]}.${report.hash}.js`;
    }

    // Store in productionManifest.chunks
    productionManifest.chunks[`${asset.chunks[0]}`] = report.name;
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
