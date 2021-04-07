'use strict';
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const terserOptions = require('./scripts/terser-config.json');

const PRODUCTION = process.env.NODE_ENV === 'production';
const DEV = !PRODUCTION;
const WDS = process.env.WDS !== undefined;
const SOURCEMAP = process.env.SOURCEMAP !== undefined;
const ENABLE_PROFILING = process.env.PROFILING !== undefined;

const env = {
  ANALYTICS_TRACKING_ID: JSON.stringify('UA-83518-1'),
  FLAG_PRODUCTION: String(PRODUCTION),
  HOSTNAME_PRODUCTION: JSON.stringify('www.lwjgl.org'),
};

const buildConfiguration = () => {
  const config = {
    mode: PRODUCTION ? 'production' : 'development',
    target: PRODUCTION ? 'browserslist' : 'web',
    // cache: false,
    // cache: true, // in-memory cache
    cache: {
      type: 'filesystem',
    },
    infrastructureLogging: {
      level: 'warn',
    },
    optimization: {
      // minimize: false,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          extractComments: false,
          terserOptions,
        }),
      ],
      emitOnErrors: false,
      moduleIds: PRODUCTION ? 'deterministic' : 'named',
      removeEmptyChunks: PRODUCTION,
      removeAvailableModules: PRODUCTION,
      mergeDuplicateChunks: PRODUCTION,
      providedExports: PRODUCTION,
      sideEffects: PRODUCTION,
      innerGraph: PRODUCTION,
    },
    performance: { hints: false },
    devtool: false,
    entry: {
      main: {
        import: ['./client/main.tsx'],
      },
    },
    output: {
      path: path.resolve(__dirname, 'public/js'),
      filename: PRODUCTION ? '[name].[contenthash].js' : '[name].js',
      chunkFilename: PRODUCTION ? '[name].[contenthash].js' : '[name].js',
      publicPath: '/js/',
      chunkLoadTimeout: 30 * 1000, // 30sec instead of 2min
      crossOriginLoading: false, // false | 'anonymous' | 'use-credentials'
      // environment: {
      //   arrowFunction: DEV,
      //   bigIntLiteral: DEV,
      //   const: DEV,
      //   destructuring: DEV,
      //   dynamicImport: DEV,
      //   forOf: DEV,
      //   module: DEV,
      // },
    },
    resolve: {
      extensions: ['.tsx', '.jsx', '.ts', '.wasm', '.js', '.mjs', '.json'],
      alias: {
        '~': path.resolve(__dirname, './client'),
        // Use prebundled jszip that has smaller stream polyfill
        jszip: path.resolve(__dirname, `./node_modules/jszip/dist/jszip.min.js`),
        // // alternatively, use stream-browserify polyfill (~17KB larger)
        // stream: 'stream-browserify'
      },
    },
    module: {
      rules: [
        {
          test: /\.(mjs|js|ts|tsx)$/,
          include: [
            path.resolve(__dirname, 'client'),
            //path.resolve(__dirname, 'node_modules/@stitches')
          ],
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
              },
            },
          ],
        },
        {
          test: /\.css?$/,
          use: [
            {
              loader: 'style-loader',
              options: {
                injectType: 'lazyStyleTag',
              },
            },
            {
              loader: 'css-loader',
              options: {
                url: false,
                import: false,
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

    config.experiments = {
      lazyCompilation: true,
    };

    // // Load pre-built dependencies
    // config.plugins.push(
    //   new webpack.DllReferencePlugin({
    //     // context: __dirname,
    //     name: 'vendor',
    //     manifest: require('./public/js/vendor.manifest.json'),
    //   })
    // );

    // Enable source maps
    config.devtool = SOURCEMAP ? 'inline-source-map' : 'cheap-module-source-map';

    if (WDS) {
      config.devServer = {
        host: '0.0.0.0',
        port: 8081,
        hot: true,
        static: false,
        compress: false,
        firewall: false,
        client: {
          overlay: false,
        },
        dev: {
          index: false,
        },
      };

      // React Refresh
      const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
      config.plugins.push(
        new ReactRefreshWebpackPlugin({
          overlay: false,
          // overlay: {
          //   sockIntegration: 'whm',
          // },
        })
      );
    }
  } else {
    // // Debug output
    // config.optimization.moduleIds = 'named';
    // config.optimization.chunkIds = 'named';

    // Use pre-built modules to avoid breaking legacy browsers
    // config.resolve.alias.three = path.resolve(__dirname, `./node_modules/three/build/three.min.js`);
    // config.resolve.alias.jszip = path.resolve(__dirname, `./node_modules/jszip/dist/jszip.min.js`);

    // Transpile modules that are shipped as ESNext
    // config.module.rules[0].include.push(path.resolve(__dirname, 'node_modules/recoil'));

    if (ENABLE_PROFILING) {
      config.resolve.alias['react-dom'] = 'react-dom/profiling';
      config.resolve.alias['scheduler/tracing'] = 'scheduler/tracing-profiling';
    }
  }

  return config;
};

module.exports = buildConfiguration();
