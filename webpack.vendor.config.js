const path = require('path');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const DllPlugin = require('webpack/lib/DllPlugin');

const config = {
  target: 'web',
  performance: {
    hints: false,
  },
  entry: {
    vendor: [
      // Polyfills
      'babel-polyfill',
      'whatwg-fetch',

      // Core
      'react',
      'react-dom',
      'prop-types',
      'fg-loadjs',
      'fg-loadcss',
      'react-helmet',
      'react-router-dom',

      // State management
      'redux',
      'redux-thunk',
      'redux-saga',
      'react-redux',
      'reselect',

      // Development
      // 'redux-logger',

      // UI
      'aphrodite',
      'classnames',
      'focus-trap',
      'nprogress',

      // Route-specific
      'file-saver',
      'jszip',
    ],
  },
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: '[name].js',
    library: '[name]',
  },
  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new DllPlugin({
      context: __dirname,
      path: path.resolve(__dirname, 'public/js', 'vendor-manifest.json'),
      name: '[name]',
    }),
  ],
};

module.exports = config;
