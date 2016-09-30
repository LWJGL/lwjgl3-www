const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

const PRODUCTION = process.env.NODE_ENV === 'production';
const DEV = !PRODUCTION;

const config = {
  target: 'web',
  entry: {
    bundle: [
      path.resolve(__dirname, 'client/styles/layout.scss')
    ]
  },
  output: {
    path: path.resolve(__dirname, 'public/css'),
    filename: '[name].css',
    chunkFilename: '[name].[id].js',
    publicPath: '/css/'
  },
  devtool: DEV ? 'inline-source-map' : undefined,
  module: {
    rules: [
      {
        test: /\.scss?$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: "style-loader",
          loader: [
            {
              loader: "css-loader",
              query: {
                sourceMap: DEV,
                safe: true,
                discardComments: {
                 removeAll: true
                }
              }
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'sass-loader',
              query: {
                sourceMap: DEV,
                outputStyle: 'compact',
                precision: 6
              }
            }
          ]
        })
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': DEV ? JSON.stringify('development') : JSON.stringify('production')
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: PRODUCTION,
      debug: false,
      options: {
        context: __dirname,
        postcss: [
          autoprefixer({
            remove: false,
            browsers: [
              '> 4%'
            ]
          })
        ]
      }
    }),
    new ExtractTextPlugin({
      filename: DEV ? 'styles.css' : '[chunkhash].css'
    })
  ]
};

module.exports = config;
