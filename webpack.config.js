'use strict';
const fs = require('fs');
const crypto = require('crypto');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const { argv } = require('yargs');
const os = require('os');
// const globals = require('./server/globals.json');

const PRODUCTION = process.env.NODE_ENV === 'production';
const DEV = !PRODUCTION;
const HMR = argv.nohmr === undefined;
const SOURCEMAP = argv.sourcemap !== undefined;
const ENABLE_PROFILING = argv.profiling !== undefined;

const env = {
  // ANALYTICS_TRACKING_ID: JSON.stringify(globals.google_analytics_id),
  FLAG_PRODUCTION: String(PRODUCTION),
  FLAG_CSSMODULES: String(DEV && argv.css !== undefined),
  HOSTNAME_PRODUCTION: JSON.stringify('www.lwjgl.org'),
};

// Hash filesystem cache dependencies to generate a unique version string
const versionHash = crypto.createHash('sha256');
versionHash.update(fs.readFileSync(path.resolve(__dirname, 'node_modules/.yarn-integrity')));
versionHash.update(fs.readFileSync(path.resolve(__dirname, 'webpack.config.js')));

const buildConfiguration = () => {
  const config = {
    mode: PRODUCTION ? 'production' : 'development',
    stats: PRODUCTION
      ? {
          all: false,
          entrypoints: true,
          assets: true,
        }
      : 'errors-only',
    target: 'web',
    amd: false,
    bail: true,
    cache: {
      type: 'filesystem',
      version: versionHash.digest('base64'),
    },
    optimization: {
      // minimize: false,
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: Math.max(os.cpus().length, 2),
          // extractComments: true,
          terserOptions: {
            compress: {
              defaults: false,
              arrows: true,
              arguments: false,
              booleans: true,
              collapse_vars: true,
              comparisons: true,
              computed_props: true,
              conditionals: true,
              dead_code: true,
              // drop_console: false,
              drop_console: true,
              drop_debugger: true,
              evaluate: true,
              expression: false,
              // global_defs: {},
              hoist_funs: true,
              hoist_props: true,
              hoist_vars: false,
              if_return: true,
              /*
                false -- same as 0
                0 -- disabled inlining
                1 -- inline simple functions
                2 -- inline functions with arguments
                3 -- inline functions with arguments and variables
                true -- same as 3
              */
              inline: 1,
              join_vars: true,
              keep_classnames: false,
              keep_fargs: false,
              keep_fnames: false,
              keep_infinity: true,
              loops: true,
              module: false,
              negate_iife: true,
              passes: 2,
              properties: true,
              pure_funcs: null,
              pure_getters: true,
              reduce_funcs: true,
              reduce_vars: true,
              sequences: true,
              side_effects: true,
              switches: true,
              toplevel: false,
              top_retain: null,
              typeofs: true,
              unsafe: false,
              unsafe_arrows: false,
              unsafe_comps: true,
              unsafe_Function: true,
              unsafe_math: false,
              unsafe_methods: false,
              unsafe_proto: true,
              unsafe_regexp: true,
              unsafe_undefined: false,
              unused: true,
              warnings: false,
            },
            output: {
              comments: /^KEEP_COMMENT/, // Remove all comments
            },
            mangle: true,
            sourceMap: false,
            ecma: 5,
            // ie8: false,
            // safari10: true,
            // toplevel: true,
          },
        }),
      ],
      // Include runtime chunk in entry
      runtimeChunk: false,
      noEmitOnErrors: true,
      moduleIds: 'deterministic',
      chunkIds: PRODUCTION ? 'deterministic' : 'named',
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
      filename: PRODUCTION ? '[name].[fullhash].js' : '[name].js',
      chunkFilename: PRODUCTION ? '[name].[contenthash].js' : '[name].js',
      publicPath: '/js/',
      pathinfo: false,
    },
    resolve: {
      extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
      mainFields: ['module', 'jsnext:main', 'main'],
      symlinks: false,
      alias: {
        '~': path.resolve(__dirname, './client'),
        jszip: path.resolve(__dirname, './node_modules/jszip/dist/jszip.js'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(mjs|js|jsx|ts|tsx)$/,
          include: [path.resolve(__dirname, 'client')],
          use: ['babel-loader'],
        },
        {
          test: /\.css?$/,
          use: [
            { loader: 'style-loader', options: { injectType: 'lazyStyleTag' } },
            {
              loader: 'css-loader',
              options: {
                url: false,
                import: false,
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'babel-loader',
            },
            {
              loader: 'react-svg-loader',
              options: {
                jsx: true,
                svgo: {
                  plugins: [
                    // https://github.com/svg/svgo
                    { removeXMLNS: true },
                    { removeViewBox: false },
                    {
                      addAttributesToSVGElement: {
                        attributes: [
                          'focusable="false"',
                          'aria-hidden="true"',
                          // 'fill="currentColor"',
                          'preserveAspectRatio="xMidYMid meet"',
                        ],
                      },
                    },
                  ],
                  // floatPrecision: 2,
                },
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
    }

    // Enable CSS HMR instead of loading CSS pre-built from disk
    if (argv.css) {
      config.module.rules.push({
        test: /\.scss?$/,
        use: [
          'style-loader',
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
            options: {
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
    // config.optimization.moduleIds = 'named';
    // config.optimization.chunkIds = 'named';
    if (ENABLE_PROFILING) {
      config.resolve.alias['react-dom'] = 'react-dom/profiling';
      config.resolve.alias['scheduler/tracing'] = 'scheduler/tracing-profiling';
    }
  }

  return config;
};

module.exports = buildConfiguration();
