'use strict';

const argv = require('yargs').argv;

if ( argv.production ) {
  // Force production environment
  process.env.NODE_ENV = 'production';
}

// Polyfill Webpack's require.ensure && require.include
// This is required for React-Router dynamic routes to resolve properly
// TODO: Might not need this anymore when Node and webpack both support a common loader API ( e.g. System.import )
let proto = Object.getPrototypeOf(require);
!proto.hasOwnProperty("ensure") && Object.defineProperties(proto, {
  "ensure": {
    value: function ensure(modules, callback) {
      callback(this);
    },
    writable: false
  },
  "include": {
    value: function include() {},
    writable: false
  }
});

// TODO: Remove Babel plugins
// Most syntax+transform plugins require new V8 version ( Node v7+ )
// ES6 modules are under consideration and may require code changes
// JSX support is required for server rendering
require('babel-core/register')({
  highlightCode: false,
  extensions: ['.js'],
  plugins: [
    'syntax-object-rest-spread',
    'transform-async-to-generator',
    'transform-flow-strip-types',
    'transform-strict-mode',
    'transform-object-rest-spread',
    'transform-class-properties',
    'transform-es2015-modules-commonjs',
    'transform-react-jsx',
    'syntax-jsx'
  ]
});

require('./server');
