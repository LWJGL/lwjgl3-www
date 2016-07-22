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
  ignore: filename => filename.indexOf('node_modules') > -1,
  plugins: [
     ['system-import-transformer', { modules: 'common' }], // Polyfill System.import for Node.js
    'syntax-object-rest-spread',  // V8
    'transform-async-to-generator',  // V8
    'transform-flow-strip-types',  // V8
    'transform-strict-mode',  // Force strict mode
    'transform-object-rest-spread',  // V8
    'transform-class-properties',  // V8
    'transform-es2015-modules-commonjs',  // ES6 modules
    // ['transform-es2015-spread', {'loose': true}],  // V8
    ['transform-es2015-destructuring', {'loose': true}],  // V8
    'transform-es2015-parameters',  // V8
    'transform-react-jsx',  // For server-side rendering
    'syntax-jsx',  // For server-side rendering
    ['module-rewrite', { 'replaceFunc': "./server/rewriteModule.js" }]  // Uses UMD NPM modules instead of */es6
  ]
});

require('./server');
