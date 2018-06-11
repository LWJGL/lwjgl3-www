'use strict';
const webpack = require('webpack');
const path = require('path');

const config = {
  mode: 'development',
  target: 'web',
  // devtool: 'inline-source-map',
  node: {
    console: false,
    global: true,
    process: true,
    __filename: false,
    __dirname: false,
    Buffer: false,
    setImmediate: false,
  },
  optimization: {
    minimize: false,
  },
  performance: {
    hints: false,
  },
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.json'],
    mainFields: ['module', 'jsnext:main', 'main'],
    symlinks: false,
  },
  entry: {
    vendor: [
      // Core
      'react',
      'react-dom',
      'prop-types',
      'fg-loadjs',
      'fg-loadcss',
      'lodash-es',
      'fbjs/lib/areEqual',
      'fbjs/lib/shallowEqual',
      'immer',

      // React
      '@reach/router',

      // State management
      'redux',
      'redux-logger',
      'redux-thunk',

      // UI
      'scroll-into-view-if-needed',
      'focus-trap',
      'nprogress',
      'react-toastify',

      // Route-specific
      'jszip',
      'three',

      // Dev
      'ansi-html',
      'html-entities',
    ],
  },
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: '[name].js',
    library: '[name]',
  },
  plugins: [
    new webpack.DllPlugin({
      context: __dirname,
      path: path.resolve(__dirname, 'public/js', 'vendor-manifest.json'),
      name: '[name]',
    }),
  ],
};

module.exports = config;
