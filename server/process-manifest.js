/* eslint-disable no-console */

const fs = require('fs');
const manifestJs = require('../manifest-js.json');
const manifestCss = require('../manifest-css.json');

/**
 *  config.json
 *
 *  Update config.json with entry points for JS & CSS
 *  Update config.json with chunk paths for preloading
 */
const config = require('../config.json');
const chunkManifest = require('../public/js/manifest.json');
const configUpdated = Object.assign({}, config);

// Update config.js by populating entry points for JS & CSS
console.log('Updating JS & CSS entry points');

configUpdated.manifest = {
  js: manifestJs.assetsByChunkName.main,
  css: manifestCss['layout.css'],
  chunks: chunkManifest,
};

configUpdated.routes = {};

manifestJs.chunks.forEach(chunk => {
  if ( chunk.entry === true ) {
    return;
  }

  const route = chunk.modules[0].name.match(/routes[/]([a-z][a-z-_/]+)[/]index.js$/);

  if ( route !== null ) {
    if ( route[1] === 'home' ) {
      console.log(`Found route /   ${chunk.files[0]}`);
      configUpdated.routes['/'] = chunk.files[0];
    } else {
      console.log(`Found route /${route[1]}   ${chunk.files[0]}`);
      configUpdated.routes[`/${route[1]}`] = chunk.files[0];
    }
  }
});

// Update file
fs.writeFileSync('./config.json', JSON.stringify(configUpdated, null, 2));

/**
 * optimize-js
 *
 * Optimize a JavaScript file for faster initial execution and parsing, by wrapping all immediately-invoked functions or likely-to-be-invoked functions in parentheses.
 * https://github.com/nolanlawson/optimize-js
 */

const optimizeJs = require('optimize-js');

manifestJs.assets.filter(asset => asset.chunks.length > 0).forEach(asset => {
  const filename = `./public/js/${asset.name}`;

  console.log(`Optimizing ${filename}`);
  fs.writeFileSync(
    filename,
    // `"use strict";${optimizeJs(fs.readFileSync(filename, {encoding:'utf-8'})).replace(/["]use strict["][;]/g, '')}`
    optimizeJs(fs.readFileSync(filename, {encoding:'utf-8'}))
  );
});
