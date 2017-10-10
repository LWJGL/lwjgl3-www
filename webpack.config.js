'use strict';

const path = require('path');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');

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
      extensions: ['.js', '.jsx'],
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
          test: /\.(js|jsx)$/,
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
      new DefinePlugin(env),
      new LoaderOptionsPlugin({
        minimize: PRODUCTION,
        debug: false,
      }),
    ],
  };

  if (DEV) {
    const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
    const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');
    const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');

    config.module.rules[0].use.unshift('cache-loader');

    if (SOURCEMAP) {
      config.devtool = 'inline-source-map';
    }

    // WebPack Hot Middleware client & HMR plugins
    if (HMR) {
      config.entry.main.unshift(
        require.resolve('react-hot-loader/patch'),
        require.resolve('webpack-hot-middleware/client')
      );
      config.plugins.push(new HotModuleReplacementPlugin());
    }
    config.plugins.push(
      new NamedModulesPlugin(),
      new DllReferencePlugin({
        context: __dirname,
        manifest: require('./public/js/vendor-manifest.json'),
      })
    );

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
    const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
    const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');
    const ShakePlugin = require('webpack-common-shake').Plugin;
    const HashedModuleIdsPlugin = require('webpack/lib/HashedModuleIdsPlugin');
    const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
    const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

    config.entry.main.unshift(path.resolve(__dirname, 'client/services/polyfill.js'));
    config.plugins.push(
      new LodashModuleReplacementPlugin(),
      new ModuleConcatenationPlugin(),
      new ShakePlugin({
        warnings: {
          global: true,
          module: false,
        },
      }),
      new HashedModuleIdsPlugin(),
      new ChunkManifestPlugin({
        filename: 'chunks.json',
        manifestVariable: 'webpackManifest',
        inlineManifest: false,
      })
    );

    config.stats = {
      assets: true,
      cached: false,
      children: false,
      chunks: false,
      chunkModules: false,
      chunkOrigins: false,
      errors: false,
      errorDetails: false,
      hash: false,
      modules: false,
      publicPath: true,
      reasons: false,
      source: false,
      timings: false,
      version: false,
      warnings: false,
    };
  }

  return config;
};

module.exports = buildConfiguration();
