'use strict';

const argv = require('yargs').argv;

if ( argv.production ) {
  // Force production environment
  process.env.NODE_ENV = 'production';
}

require('babel-core/register')({
  highlightCode: false,
  extensions: ['.js'],
  babelrc: false,
  compact: true,
  comments: false,
  plugins: [
    // React
    'transform-react-jsx',
    'transform-flow-strip-types',
    'syntax-flow',
    'syntax-jsx',
    'transform-react-display-name',

    // Stage
    'transform-decorators-legacy',
    'transform-class-properties',
    'transform-object-rest-spread',

    // ES2015+
    'transform-async-to-generator',
    'transform-es2015-parameters',
    ['transform-es2015-destructuring', {'loose': true}],
    'transform-es2015-modules-commonjs',
  ]
});

require('./server');
