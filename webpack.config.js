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
  'process.env.NODE_ENV': DEV ? JSON.stringify('development') : JSON.stringify('production'),
  HOSTNAME: JSON.stringify(config.hostname),
  ANALYTICS_TRACKING_ID: JSON.stringify(config.analytics_tracking_id),
  NOHMR: String(HMR === false),
  CSSMODULES: String(DEV && argv.css !== undefined),
  ASYNC_ROUTES: String(argv.async !== undefined),
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
        // Load our custom version of react-icon-base
        'react-icon-base$': path.resolve(__dirname, 'client/components/Icon.jsx'),
      },
    },
    module: {
      rules: [
        {
          include: [
            path.resolve('node_modules', 'lodash-es'),
            path.resolve('node_modules', 'react-router/es'),
            path.resolve('node_modules', 'react-router-dom/es'),
          ],
          sideEffects: false,
        },
        {
          test: /\.(js|mjs|jsx)$/,
          include: [path.resolve(__dirname, 'client'), path.resolve(__dirname, 'node_modules/react-icons')],
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
    // Enable source maps
    if (SOURCEMAP) {
      config.devtool = 'inline-source-map';
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

    console.log(config.entry.main);

    config.plugins.push(
      // Display relative path of the module when HMR is enabled
      new webpack.NamedModulesPlugin(),
      // Load pre-built dependencies
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('./public/js/vendor-manifest.json'),
      })
    );

    // Enable cache-loader for faster builds
    config.module.rules[1].use.unshift('cache-loader');

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
      });
    }
  } else {
    // Load core-js polyfills first
    config.entry.main.unshift(path.resolve(__dirname, 'client/services/polyfill.js'));
    config.plugins.push(
      // Base hashes on the relative path of modules
      new webpack.HashedModuleIdsPlugin(),
      // Extract the webpack bootstrap logic into a separate file
      // We then inline those file contents in our HTML
      new webpack.optimize.CommonsChunkPlugin({ name: 'webpack' })
    );
  }

  return config;
};

module.exports = buildConfiguration();
