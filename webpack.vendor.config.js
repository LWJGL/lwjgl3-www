'use strict';
const webpack = require('webpack');
const path = require('path');

const config = {
  mode: 'development',
  target: 'web',
  performance: {
    hints: false,
  },
  node: {
    console: false,
    global: true,
    process: true,
    __filename: false,
    __dirname: false,
    Buffer: false,
    setImmediate: false,
  },
  devtool: 'inline-source-map',
  entry: {
    vendor: [
      // Polyfills
      'whatwg-fetch',

      // Core
      'react',
      'react-dom',
      'prop-types',
      'fg-loadjs',
      'fg-loadcss',
      'lodash-es',
      'fbjs',

      // React
      'react-helmet',
      'react-router',
      'react-router-dom',
      'react-loadable',

      // State management
      'redux',
      'redux-thunk',
      'reselect',

      // UI
      'emotion',
      'react-emotion',
      'classcat',
      'focus-trap',
      'nprogress',

      // Route-specific
      'file-saver',
      'jszip',
      'three',

      // Dev
      'ansi-html',
      'html-entities',
      'react-stand-in',
    ],
  },
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: '[name].js',
    library: '[name]',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new webpack.DllPlugin({
      context: __dirname,
      path: path.resolve(__dirname, 'public/js', 'vendor-manifest.json'),
      name: '[name]',
    }),
    new webpack.NamedModulesPlugin(),
  ],
};

module.exports = config;
