'use strict';
const path = require('node:path');
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

function buildConfiguration() {
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
      chunkIds: PRODUCTION ? 'deterministic' : 'named',
      minimize: PRODUCTION,
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
      hashFunction: 'xxhash64',
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
      },
    },
    module: {
      rules: [
        {
          test: /\.(mjs|js|ts|tsx)$/,
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
    experiments: {
      // futureDefaults: true,
      cacheUnaffected: true,
      backCompat: false,
    },
  };

  if (DEV) {
    config.output.crossOriginLoading = 'anonymous';
    // config.output.chunkLoading = 'import';
    // config.output.chunkFormat = 'module';
    // config.externalsType = 'module';

    config.experiments.lazyCompilation = {
      entries: false,
      imports: true,
    };
    config.experiments.outputModule = true;

    // Disable chunks
    config.optimization.splitChunks = false;

    // Enable source maps
    config.devtool = SOURCEMAP ? 'inline-source-map' : 'cheap-module-source-map';

    if (WDS) {
      config.devServer = {
        host: '0.0.0.0',
        port: 8089,
        hot: true,
        static: false,
        compress: false,
        allowedHosts: 'all',
        client: {
          overlay: false,
        },
        devMiddleware: {
          index: false,
        },
      };

      if (process.env.WSL_DISTRO_NAME !== undefined) {
        config.devServer.open = {
          target: ['http://www.lwjgl.localhost/'],
          app: {
            name: 'explorer.exe',
          },
        };
      }

      // React Refresh
      const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
      config.plugins.push(new ReactRefreshWebpackPlugin({ overlay: false }));
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

  if (DEV || SOURCEMAP) {
    config.module.rules.unshift({
      enforce: 'pre',
      exclude: /@babel(?:\/|\\{1,2})runtime/,
      test: /\.(js|mjs|jsx|ts|tsx|css)$/,
      use: 'source-map-loader',
    });
  }

  return config;
}

module.exports = buildConfiguration();
