'use strict';
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const { argv } = require('yargs');

const PRODUCTION = process.env.NODE_ENV === 'production';
const DEV = !PRODUCTION;
const HMR = DEV && argv.nohmr === undefined;
const SOURCEMAP = argv.sourcemap !== undefined;
const ENABLE_PROFILING = argv.profiling !== undefined;

const env = {
  // ANALYTICS_TRACKING_ID: JSON.stringify(globals.google_analytics_id),
  FLAG_PRODUCTION: String(PRODUCTION),
  FLAG_CSSMODULES: String(DEV && argv.css !== undefined),
  FLAG_HMR: String(HMR),
  HOSTNAME_PRODUCTION: JSON.stringify('www.lwjgl.org'),
};

const buildConfiguration = () => {
  const config = {
    mode: PRODUCTION ? 'production' : 'development',
    target: 'web',
    cache: {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename, path.resolve(__dirname, 'node_modules/.yarn-integrity')],
      },
    },
    optimization: {
      // minimize: false,
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: SOURCEMAP,
          terserOptions: {
            output: {
              comments: false,
            },
            mangle: true,
            // warnings: true,
            ecma: 5,
            module: false,
            // safari10: true,
            // toplevel: true,
            compress: {
              drop_console: true,
              // drop_console: false,
              // drop_debugger: false,
              hoist_funs: true,
              inline: 1,
              keep_fargs: false,
              keep_infinity: true,
              passes: 2,
              pure_getters: true,
              // pure_getters: 'strict',
              unsafe_comps: true,
            },
          },
        }),
      ],
      removeEmptyChunks: PRODUCTION,
      mergeDuplicateChunks: PRODUCTION,
      providedExports: PRODUCTION,
      splitChunks: DEV
        ? false
        : {
            // name: true,
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10,
                // name: 'vendor.[contenthash].js', // TODO: bug when outputting content hash, try in future webpack version
              },
              default: { minChunks: 2, priority: -20, reuseExistingChunk: true },
            },
          },
    },
    performance: { hints: false },
    entry: { main: ['./client/main.ts'] },
    output: {
      path: path.resolve(__dirname, 'public/js'),
      filename: PRODUCTION ? '[name].[fullhash].js' : '[name].js',
      chunkFilename: PRODUCTION ? '[name].[contenthash].js' : '[name].js',
      publicPath: '/js/',
      chunkLoadTimeout: 30 * 1000, // 30sec instead of 2min
      crossOriginLoading: false, // false | 'anonymous' | 'use-credentials'
      ecmaVersion: 5,
    },
    resolve: {
      extensions: ['.tsx', '.jsx', '.ts', '.js', '.json'],
      alias: {
        '~': path.resolve(__dirname, './client'),
        // Use prebundled jszip that has smaller stream polyfill
        jszip: path.resolve(__dirname, `./node_modules/jszip/dist/jszip.js`),
        // // alternatively, use stream-browserify polyfill (~17KB larger)
        // stream: 'stream-browserify'
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|ts|tsx)$/,
          include: [path.resolve(__dirname, 'client')],
          use: [{ loader: 'babel-loader', options: { cacheDirectory: true } }],
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
            { loader: 'babel-loader', options: { cacheDirectory: true } },
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
    plugins: [new webpack.DefinePlugin(env)],
  };

  if (DEV) {
    config.output.crossOriginLoading = 'anonymous';

    // Enable source maps
    config.devtool = SOURCEMAP ? 'inline-source-map' : 'cheap-module-source-map';

    if (HMR) {
      // Enable Hot Module Replacement
      config.entry.main.unshift(require.resolve('webpack-hot-middleware/client'));
      config.plugins.push(new webpack.HotModuleReplacementPlugin());

      // React Refresh
      const ReactRefreshPlugin = require('@webhotelier/webpack-fast-refresh');
      config.plugins.push(new ReactRefreshPlugin());
    }

    // Enable CSS HMR instead of loading CSS pre-built from disk
    if (argv.css) {
      config.module.rules.push({
        test: /\.scss?$/,
        use: [
          { loader: 'style-loader', options: { injectType: 'styleTag' } },
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
              webpackImporter: false,
              sassOptions: {
                indentedSyntax: false,
                sourceComments: false,
                outputStyle: 'expanded',
                precision: 6,
              },
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
