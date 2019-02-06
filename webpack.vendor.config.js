'use strict';
const webpack = require('webpack');
const path = require('path');

const config = {
  mode: 'development',
  target: 'web',
  cache: false,
  // devtool: 'inline-source-map',
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.json'],
    mainFields: ['module', 'jsnext:main', 'main'],
    symlinks: false,
  },
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: '[name].js',
    library: '[name]',
    crossOriginLoading: 'anonymous',
    pathinfo: false,
  },
  entry: {
    vendor: [
      // Core
      'react',
      'react-dom',
      // 'react-cache',
      'scheduler',
      'prop-types',
      'lodash-es',
      'fbjs',
      'react-fast-compare',
      'immer',

      // UI
      '@reach/router',
      'focus-trap',

      // Route-specific
      // 'jszip',
      'three',

      // Dev
      'ansi-html',
      'html-entities',
    ],
  },
  plugins: [
    new webpack.DllPlugin({
      context: __dirname,
      path: path.resolve(__dirname, 'public/js', 'vendor-manifest.json'),
      name: '[name]',
    }),
  ],
  optimization: {
    minimize: false,
  },
  performance: {
    hints: false,
  },
};

module.exports = config;
