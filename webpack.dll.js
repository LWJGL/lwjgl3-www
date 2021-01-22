'use strict';
const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  target: 'web',
  cache: false,
  devtool: 'cheap-module-source-map',
  entry: {
    vendor: {
      import: [
        // common
        '@react-aria/button',
        '@react-aria/dialog',
        '@react-aria/focus',
        '@react-aria/interactions',
        '@react-aria/link',
        '@react-aria/overlays',
        '@react-aria/utils',
        '@react-spring/web',
        '@stitches/react',
        'history',
        'react-router-dom',
        'react-use-gesture',
        'scroll-into-view-if-needed',
        'lodash-es',
        'recoil',

        // framework
        'react',
        'react-dom',
        'react-is',
        'react-refresh/runtime',
        'ansi-html',
        'ansi-regex',
        'html-entities',
      ],
    },
  },
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: '[name].js',
    publicPath: '/js/',
    crossOriginLoading: 'anonymous',
    environment: {
      arrowFunction: true,
      bigIntLiteral: true,
      const: true,
      destructuring: true,
      dynamicImport: true,
      forOf: true,
      module: true,
    },
    library: '[name]',
  },
  resolve: {
    extensions: ['.tsx', '.jsx', '.ts', '.js', '.json'],
    alias: {
      // Use prebundled jszip that has smaller stream polyfill
      jszip: path.resolve(__dirname, `./node_modules/jszip/dist/jszip.js`),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new webpack.DllPlugin({
      // context: __dirname,
      // format: true,
      // entryOnly: true,
      entryOnly: false,
      name: '[name]',
      path: path.resolve(__dirname, 'public/js', 'vendor.manifest.json'),
    }),
  ],
};
