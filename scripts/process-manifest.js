'use strict';

const optimizeJs = require('optimize-js');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const Table = require('cli-table');
const gzipSize = require('gzip-size');

const webpackManifest = require('../public/js/webpack.manifest.json');
const prettyBytes = require('./prettyBytes');
const formatSize = require('./formatSize');

const headStyle = { head: ['cyan'] };

/*
 * ------------------------------------------------------------------------------------------------------------------------
 *  Generate production manifest.json from webpack's manifest
 *  ------------------------------------------------------------------------------------------------------------------------
 */

let manifest = {};

function buildManifest() {
  console.log(chalk.yellow('\n Detecting entry point & chunks:'));

  const tbl = new Table({ head: ['Type', 'Bundle'], style: headStyle });

  // We'll use this to boot the app
  // "main" here is the name of the entry in webpack.config.js (config.entry.main)
  manifest.entry = webpackManifest.assetsByChunkName.main;

  // App needs this to know where to load the other chunks from
  // We'll serialize it later and inject inline as JavaScript (webpackManifest={})
  manifest.chunks = require(`../public/js/chunks.json`);

  // Build a map of route paths->JS files in order to preload chunks as needed
  manifest.routes = {};

  // Detect routes from chunk paths
  // ------------------------------
  webpackManifest.chunks.forEach(chunk => {
    if (chunk.entry === true) {
      // This is the entry chunk, ignore
      return;
    }

    if (!chunk.names[0].startsWith('route')) {
      // Not a route, ignore
      return;
    }

    const route = chunk.names[0].match(/^route[-]([a-z][a-z-_/]+)$/);
    if (route !== null) {
      manifest.routes[route[1]] = chunk.files[0];
    }
  });

  tbl.push(['JS', JSON.stringify(manifest, null, 2)]);

  // Update file
  // -----------
  fs.writeFileSync(path.resolve(__dirname, '../public/js/manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(tbl.toString());
}

/*
 * ------------------------------------------------------------------------------------------------------------------------
 * optimize-js
 *
 * Optimize a JavaScript file for faster initial execution and parsing, by wrapping all immediately-invoked functions or
 * likely-to-be-invoked functions in parentheses.
 *
 * https://github.com/nolanlawson/optimize-js
 * ------------------------------------------------------------------------------------------------------------------------
 */
function optimizeJS() {
  console.log(chalk.yellow('\n Optimizing files:\n'));

  webpackManifest.assets.forEach(asset => {
    if (!asset.name.endsWith('.js')) {
      return;
    }
    const filename = path.resolve(__dirname, `../public/js/${asset.name}`);
    fs.writeFileSync(filename, optimizeJs(fs.readFileSync(filename, { encoding: 'utf-8' })));
  });

  console.log('  OK');
}

/*
 * ------------------------------------------------------------------------------------------------------------------------
 * Report generated file size
 * ------------------------------------------------------------------------------------------------------------------------
 */

function filesReportBuild(files) {
  const tbl = new Table({
    head: ['Title', 'File', 'Size', 'Gzipped'],
    colAligns: ['left', 'left', 'right', 'right'],
    style: headStyle,
  });

  let sum = 0;
  let sumGzip = 0;

  files
    .map(file => {
      const stat = fs.statSync(file.path);
      if (!stat.isFile()) {
        throw new Error(`${file.path} is not a file`);
      }

      file.size = stat.size;
      file.gzip = gzipSize.sync(fs.readFileSync(file.path));
      return file;
    })
    .forEach(file => {
      const isRoot = file.name === 'entry';
      const isCss = file.type === 'css';
      sum += file.size;
      sumGzip += file.gzip;
      tbl.push([
        isRoot ? chalk.magenta(file.name) : file.name,
        path.basename(file.path),
        formatSize(file.size, false, isRoot, isCss),
        formatSize(file.gzip, true, isRoot, isCss),
      ]);
    });

  if (files.length > 1) {
    tbl.push(['', chalk.cyan('TOTAL'), prettyBytes(sum), prettyBytes(sumGzip)]);
  }

  console.log(tbl.toString());
}

function filesReport(entry, routes) {
  filesReportBuild([
    {
      name: 'entry',
      path: path.resolve(__dirname, '../public/js', entry),
      size: 0,
      gzip: 0,
      type: 'js',
    },
    ...Object.keys(routes).map(route => ({
      name: route,
      path: path.resolve(__dirname, '../public/js', routes[route]),
      size: 0,
      gzip: 0,
      type: 'js',
    })),
  ]);
}

buildManifest();
optimizeJS();

if (manifest.entry) {
  console.log(chalk.yellow('\n JavaScript file size report:'));
  filesReport(manifest.entry, manifest.routes);
}
