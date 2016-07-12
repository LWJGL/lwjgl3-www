'use strict';

const argv = require('yargs').argv;

if ( argv.production ) {
  // Force production environment
  process.env.NODE_ENV = 'production';
}

// TODO: Remove Babel plugins
// Most syntax+transform plugins require new V8 version ( Node v7+ )
// ES6 modules are under consideration and may require code changes
// JSX support is required for server rendering
require('babel-core/register')({
  highlightCode: false,
  extensions: ['.js'],
  ignore: function(filename) {
    return filename.indexOf('node_modules') > -1  && filename.indexOf('node_modules/react-router') === -1;
  },
  plugins: [
    'syntax-object-rest-spread',  // V8
    'transform-async-to-generator',  // V8
    'transform-flow-strip-types',  // V8
    'transform-strict-mode',  // Force strict mode
    'transform-object-rest-spread',  // V8
    'transform-class-properties',  // V8
    ['system-import-transformer', { modules: 'common' }], // Polyfill System.import for Node.js
    'transform-es2015-modules-commonjs',  // ES6 modules
    'transform-react-jsx',  // For server-side rendering
    'syntax-jsx',  // For server-side rendering
  ]
});

require('./server');
