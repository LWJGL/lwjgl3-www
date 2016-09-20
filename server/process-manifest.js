const fs = require('fs');
const manifestJs = require('../manifest-js.json');
const manifestCss = require('../manifest-css.json');

/**
 *  config.json
 *
 *  Update config.json with entry points for JS & CSS
 */
const config = require('../config.json');
const configUpdated = Object.assign({}, config);

// Update config.js by populating entry points for JS & CSS
configUpdated.manifest = {
  js: manifestJs.assetsByChunkName.main,
  css: manifestCss['layout.css'],
};

// Update file
if ( !config.manifest || config.manifest.js !== configUpdated.manifest.js || config.manifest.css !== configUpdated.manifest.css ) {
  fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
}

/**
 * optimize-js
 *
 * Optimize a JavaScript file for faster initial execution and parsing, by wrapping all immediately-invoked functions or likely-to-be-invoked functions in parentheses.
 * https://github.com/nolanlawson/optimize-js
 */

const optimizeJs = require('optimize-js');

manifestJs.assets.map(asset => asset.name).forEach(asset => {
  const filename = `./public/js/${asset}`;

  console.log(`Optimizing ${filename}`);
  fs.writeFileSync(filename, optimizeJs(fs.readFileSync(filename, {encoding:'utf-8'})));
});
