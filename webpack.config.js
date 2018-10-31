'use strict';
const webpack = require('webpack');
const path = require('path');
const { argv } = require('yargs');
const globals = require('./server/globals.json');

const PRODUCTION = process.env.NODE_ENV === 'production';
const DEV = !PRODUCTION;
const HMR = argv.nohmr === undefined;
const SOURCEMAP = argv.sourcemap !== undefined;
const DLL = argv.nodll === undefined;
const ENABLE_PROFILING = argv.profiling !== undefined;

const env = {
  ANALYTICS_TRACKING_ID: JSON.stringify(globals.google_analytics_id),
  FLAG_PRODUCTION: String(PRODUCTION),
  FLAG_CSSMODULES: String(DEV && argv.css !== undefined),
  FLAG_REDUXLOGGER: String(DEV && argv.reduxLogger !== undefined),
  HOSTNAME_PRODUCTION: JSON.stringify('www.lwjgl.org'),
};

// function disableRHL(config) {
//   // Replace ./client/RHL.js with ./client/container/App.jsx
//   config.resolve.alias[path.resolve(__dirname, 'client/RHL.js')] = path.resolve(__dirname, 'client/containers/App.jsx');
// }

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
      // We minimize manually in a separate step
      minimize: false,
      // Include runtime chunk in entry
      runtimeChunk: false,
      noEmitOnErrors: true,
      removeAvailableModules: PRODUCTION,
      removeEmptyChunks: PRODUCTION,
      mergeDuplicateChunks: PRODUCTION,
      splitChunks: DEV
        ? false
        : {
            chunks: 'async',
            minSize: 1024 * 30,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
              vendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10,
              },
              default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true,
              },
            },
          },
    },
    performance: {
      hints: false,
    },
    entry: {
      main: [path.resolve(__dirname, 'client/main.ts')],
    },
    output: {
      path: path.resolve(__dirname, 'public/js'),
      filename: '[name].js',
      chunkFilename: '[name].js',
      publicPath: '/js/',
      pathinfo: false,
    },
    resolve: {
      extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
      mainFields: ['module', 'jsnext:main', 'main'],
      symlinks: false,
      alias: {
        '~': path.resolve(__dirname, './client'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(mjs|js|jsx|ts|tsx)$/,
          include: [path.resolve(__dirname, 'client')],
          use: [
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
    // const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
    // config.plugins.push(new ErrorOverlayPlugin());

    config.output.crossOriginLoading = 'anonymous';

    // Enable source maps
    if (SOURCEMAP) {
      config.devtool = 'inline-source-map';
    } else {
      config.devtool = 'cheap-module-source-map';
    }

    if (HMR) {
      // Enable Hot Module Replacement
      config.entry.main.unshift(require.resolve('webpack-hot-middleware/client'));
      config.plugins.push(new webpack.HotModuleReplacementPlugin());
    } else {
      disableRHL(config);
    }

    if (DLL) {
      config.plugins.push(
        // Load pre-built dependencies
        new webpack.DllReferencePlugin({
          context: __dirname,
          manifest: require('./public/js/vendor-manifest.json'),
        })
      );
    }

    // Enable CSS HMR instead of loading CSS pre-built from disk
    if (argv.css) {
      config.module.rules.push({
        test: /\.scss?$/,
        use: [
          'style-loader/useable',
          {
            loader: 'css-loader',
            options: {
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
    config.module.rules[0].use.unshift('jsx-compress-loader');
    config.entry.main.unshift(
      // Load core-js polyfill first
      // We import a file that imports the polyfill in order to take advantage of @babel/env optimizations
      path.resolve(__dirname, 'client/services/polyfill.js')
    );
    // config.optimization.namedModules = true;
    config.plugins.push(
      // Base hashes on the relative path of modules
      new webpack.HashedModuleIdsPlugin()
    );
    disableRHL(config);

    if (ENABLE_PROFILING) {
      config.resolve.alias['react-dom'] = 'react-dom/profiling';
      config.resolve.alias['scheduler/tracing'] = 'scheduler/tracing-profiling';
    }
  }

  config.module.rules[0].use.unshift('cache-loader', 'thread-loader');

  return config;
};

module.exports = buildConfiguration();
