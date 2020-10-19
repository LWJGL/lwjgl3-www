'use strict';
const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  // target: 'es2020',
  target: 'browserslist',
  cache: false,
  devtool: 'cheap-module-source-map',
  entry: {
    vendor: {
      import: [
        // immediate dependencies
        '@react-spring/web',
        '@stitches/react',
        'focus-trap',
        'history',
        'immer',
        'jszip',
        'lodash-es',
        'react',
        'react-dom',
        'react-fast-compare',
        'react-reduce-motion',
        'react-router',
        'react-router-dom',
        'react-use-gesture',
        'scheduler',
        'scroll-into-view-if-needed',
        'tabbable',
        'whatwg-fetch',
        // other
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
