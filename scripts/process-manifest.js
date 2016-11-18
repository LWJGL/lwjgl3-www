"use strict";

const optimizeJs = require('optimize-js');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const Table = require('cli-table');
const gzipSize = require('gzip-size');

const manifest = require('../manifest.json');
const config = require('../config.json');

const headStyle = {head: ['cyan']};

const prettyBytes = num => `${(num / kB).toFixed(2)} kB`;
const kB = 1000;
const warnFileSizes = [10, 150, 250];
const warnFileSizesGzipped = [5, 75, 150];
const warnFileSizesRoot = [200, 400, 600];
const warnFileSizesRootGzipped = [100, 150, 250];
const warnFileSizesCSS = [25, 75, 100];
const warnFileSizesCSSGzipped = [10, 30, 60];

const formatSize = (size, isGzip, isRoot, isCss) => {
  let limits;
  if ( isGzip ) {
    if ( isCss ) {
      limits = warnFileSizesCSSGzipped;
    } else {
      limits = isRoot ? warnFileSizesRootGzipped : warnFileSizesGzipped;
    }
  } else {
    if ( isCss ) {
      limits = warnFileSizesCSS;
    } else {
      limits = isRoot ? warnFileSizesRoot : warnFileSizes;
    }
  }
  if ( size >= limits[2] * kB ) {
    return chalk.red(prettyBytes(size));
  } else if ( size >= limits[1] * kB ) {
    return chalk.yellow(prettyBytes(size));
  } else if ( size <= limits[0] * kB ) {
    return chalk.green(prettyBytes(size));
  }

  return prettyBytes(size);
};

/*
 * ------------------------------------------------------------------------------------------------------------------------
 *  config.json
 *
 *  Update config.json with entry points for JS & CSS
 *  Update config.json with chunk paths for preloading
 *  ------------------------------------------------------------------------------------------------------------------------
 */
const configUpdated = Object.assign({}, config);

function updateConfig() {
  // Update config.js by populating entry points for JS & CSS
  console.log(chalk.yellow('\n Updating JS & CSS entry points:'));
  const tbl = new Table({head: ['Type', 'File'], style: headStyle});
  tbl.push(['JS', manifest.children[0].assetsByChunkName.main]);
  tbl.push(['CSS', manifest.children[1].assetsByChunkName.bundle[1]]);
  console.log(tbl.toString());

  configUpdated.manifest = {
    js: manifest.children[0].assetsByChunkName.main,
    css: manifest.children[1].assetsByChunkName.bundle[1]
  };

  // Detect routes from chunk paths
  // ------------------------------
  console.log(chalk.yellow('\n Detecting routes from chunk paths:'));
  const tblRoutes = new Table({head: ['Route', 'Chunk'], style: headStyle});

  configUpdated.routes = {};
  manifest.children[0].chunks.forEach(chunk => {
    if ( chunk.entry === true ) {
      return;
    }

    const route = chunk.modules[0].name.match(/routes[/]([a-z][a-z-_/]+)[/]index.js$/);

    if ( route !== null ) {
      if ( route[1] === 'home' ) {
        tblRoutes.push(['/', chunk.files[0]]);
        configUpdated.routes['/'] = chunk.files[0];
      } else {
        tblRoutes.push([route[1], chunk.files[0]]);
        configUpdated.routes[`/${route[1]}`] = chunk.files[0];
      }
    }
  });
  console.log(tblRoutes.toString());

  // Update file
  // -----------
  fs.writeFileSync('./config.json', JSON.stringify(configUpdated, null, 2));
}

updateConfig();

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

function optimize() {
  console.log(chalk.yellow('\n Optimizing files:\n'));
  // const tbl = new Table({head: ['Filename'], style: headStyle});

  manifest.children[0].assets.filter(asset => asset.chunks.length > 0).forEach(asset => {
    const filename = `./public/js/${asset.name}`;
    // tbl.push([filename]);
    fs.writeFileSync(
      filename,
      optimizeJs(fs.readFileSync(filename, {encoding: 'utf-8'}))
    );
  });

  // console.log(tbl.toString());
  console.log('  OK');
}

optimize();

/*
 * ------------------------------------------------------------------------------------------------------------------------
 *
 * Report generated file size
 *
 * ------------------------------------------------------------------------------------------------------------------------
 */

function reportFiles(type) {
  const isCss = type === 'css';
  const tbl = new Table({
    head: [
      'Title',
      'File',
      'Size',
      'Gzipped'
    ],
    colAligns: ['left', 'left', 'right', 'right'],
    style: headStyle
  });

  const files = [];

  if ( isCss ) {
    console.log(chalk.yellow('\n CSS file size report:'));
    files.push({
      name: 'Root',
      path: path.resolve(__dirname, '../public/css', configUpdated.manifest.css),
      size: 0,
      gzip: 0
    });
  } else {
    console.log(chalk.yellow('\n JavaScript file size report:'));
    files.push(
      {
        name: 'Root',
        path: path.resolve(__dirname, '../public/js', configUpdated.manifest.js),
        size: 0,
        gzip: 0
      },
      ...(Object.keys(configUpdated.routes).map(route => ({
        name: route,
        path: path.resolve(__dirname, '../public/js', configUpdated.routes[route]),
        size: 0,
        gzip: 0
      })))
    );
  }

  let sum = 0;
  let sumGzip = 0;

  files.map(file => {
    const stat = fs.statSync(file.path);
    if ( !stat.isFile() ) {
      // Throw ?
      return;
    }

    file.size = stat.size;
    file.gzip = gzipSize.sync(fs.readFileSync(file.path));
    return file;
  }).forEach(file => {
    const isRoot = file.name === 'Root';
    const isCss = type === 'css';
    sum += file.size;
    sumGzip += file.gzip;
    tbl.push([
      isRoot ? chalk.magenta(file.name) : file.name,
      path.basename(file.path),
      formatSize(file.size, false, isRoot, isCss),
      formatSize(file.gzip, true, isRoot, isCss)
    ]);
  });

  if ( files.length > 1 ) {
    tbl.push(['', chalk.cyan('TOTAL'), prettyBytes(sum), prettyBytes(sumGzip)])
  }

  console.log(tbl.toString());
}

reportFiles('css');
reportFiles('js');
