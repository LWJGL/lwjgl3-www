'use strict';

const path = require('path');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const env = {
  'process.env.NODE_ENV': JSON.stringify('production'),
};

module.exports = {
  mode: 'production',
  target: 'web',
  optimization: {
    minimize: false,
  },
  performance: {
    hints: false,
  },
  entry: {
    main: [path.resolve(__dirname, 'client/styles/layout.scss')],
  },
  output: {
    path: path.resolve(__dirname, 'public/css'),
    filename: 'core.css',
    publicPath: '/css/',
  },
  module: {
    rules: [
      {
        test: /\.scss?$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                root: '/',
                url: false,
                import: false,
                modules: false,
                // CSSNano Options
                minimize: {
                  // safe: true,
                  colormin: false,
                  calc: false,
                  zindex: false,
                  discardComments: {
                    removeAll: true,
                  },
                },
                sourceMap: false,
                camelCase: false,
                importLoaders: 2,
                localIdentName: '[local]_[hash:base64:7]',
              },
            },
            'postcss-loader',
            {
              loader: 'sass-loader',
              query: {
                sourceMap: false,
                sourceComments: false,
                outputStyle: 'expanded',
                precision: 6,
              },
            },
          ],
        }),
      },
    ],
  },
  plugins: [
    new DefinePlugin(env),
    new LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new ExtractTextPlugin('core.css'),
  ],
};
