'use strict';
const webpack = require('webpack');
const path = require('path');
const { argv } = require('yargs');
const config = require('./config.json');

const PRODUCTION = process.env.NODE_ENV === 'production';
const DEV = !PRODUCTION;
const HMR = argv.nohmr === undefined;
const SOURCEMAP = argv.sourcemap !== undefined;

const env = {
  ANALYTICS_TRACKING_ID: JSON.stringify(config.analytics_tracking_id),
  FLAG_PRODUCTION: String(PRODUCTION),
  FLAG_CSSMODULES: String(DEV && argv.css !== undefined),
  FLAG_REDUXLOGGER: String(DEV && argv.reduxLogger !== undefined),
};

const buildConfiguration = () => {
  const config = {
    mode: PRODUCTION ? 'production' : 'development',
    target: 'web',
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
      // Extract the webpack bootstrap logic into a separate file
      // We then inline those file contents in our HTML
      runtimeChunk: PRODUCTION,
      splitChunks: {
        chunks: 'async',
        minSize: 1024 * 512, // 1 KiB
        minChunks: 2,
        maxAsyncRequests: 5,
        maxInitialRequests: 1,
        name: true,
      },
    },
    performance: {
      hints: false,
    },
    entry: {
      main: [path.resolve(__dirname, 'client/main.js')],
    },
    output: {
      path: path.resolve(__dirname, 'public/js'),
      filename: '[name].js',
      chunkFilename: '[name].js',
      publicPath: '/js/',
    },
    resolve: {
      extensions: ['.mjs', '.js', '.jsx', '.json'],
      mainFields: ['module', 'jsnext:main', 'main'],
      symlinks: false,
      alias: {
        '~': path.resolve(__dirname, './client'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|mjs|jsx)$/,
          include: [path.resolve(__dirname, 'client')],
          use: [
            'cache-loader',
            'thread-loader',
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin(env),
      new webpack.LoaderOptionsPlugin({
        minimize: PRODUCTION,
        debug: false,
      }),
    ],
  };

  if (DEV) {
    // Enable source maps
    if (SOURCEMAP) {
      config.devtool = 'inline-source-map';
    } else {
      config.devtool = 'cheap-module-source-map';
    }

    // Enable react-perf-devtool support
    if (argv.reactPerf === true) {
      config.entry.main.unshift(path.resolve(__dirname, 'client/services/react-perf-devtool.js'));
    }

    // Enable Hot Module Replacement
    if (HMR) {
      config.entry.main.unshift(require.resolve('webpack-hot-middleware/client'));
      config.plugins.push(new webpack.HotModuleReplacementPlugin());
    }

    config.plugins.push(
      // Load pre-built dependencies
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('./public/js/vendor-manifest.json'),
      })
    );

    // Enable CSS HMR instead of loading CSS pre-built from disk
    if (argv.css) {
      config.module.rules.push({
        test: /\.scss?$/,
        use: [
          'style-loader/useable',
          {
            loader: 'css-loader',
            options: {
              root: '/',
              url: false,
              import: false,
              modules: false,
              importLoaders: 2,
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
      });
    }
  } else {
    // Load core-js polyfills first
    config.entry.main.unshift(path.resolve(__dirname, 'client/services/polyfill.js'));
    config.plugins.push(
      // Base hashes on the relative path of modules
      new webpack.HashedModuleIdsPlugin()
    );
  }

  return config;
};

module.exports = buildConfiguration();
