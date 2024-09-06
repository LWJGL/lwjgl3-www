// @ts-check
'use strict';
const path = require('node:path');
const rspack = require('@rspack/core');
const ReactRefreshPlugin = require('@rspack/plugin-react-refresh');

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

const browserslistConfig = PRODUCTION
  ? {
      targets: ['chrome >= 79', 'edge >= 88', 'firefox >= 85', 'safari >= 13'],
      entry: 'entry',
      coreJs: '3.38',
      shippedProposals: true,
      // loose: true, // Breaks #private class fields
      // forceAllTransforms: true,
    }
  : {
      targets: ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version'],
    };

function buildConfiguration() {
  /** @type {import('@rspack/cli').Configuration} */
  const config = {
    context: __dirname,
    experiments: {
      futureDefaults: true,
    },
    mode: PRODUCTION ? 'production' : 'development',
    target: PRODUCTION ? 'browserslist' : 'web',
    devtool: false,
    entry: {
      main: {
        import: ['./client/main.tsx'],
      },
    },
    output: {
      path: path.resolve(__dirname, 'public/js'),
      filename: PRODUCTION ? '[name].[contenthash].js' : '[name].js',
      publicPath: '/js/',
      chunkLoadTimeout: 30 * 1000, // 30sec instead of 2min
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
          test: /\.(j|t)s$/,
          loader: 'builtin:swc-loader',
          // exclude: [/[\\/]node_modules[\\/]/],
          include: [path.resolve(__dirname, '.')],
          options: {
            jsc: {
              externalHelpers: true,
              parser: { syntax: 'typescript' },
            },
            env: browserslistConfig,
          },
        },
        {
          test: /\.(j|t)sx$/,
          // exclude: [/[\\/]node_modules[\\/]/],
          include: [path.resolve(__dirname, '.')],
          use: [
            {
              loader: 'builtin:swc-loader',
              options: {
                jsc: {
                  externalHelpers: true,
                  parser: { syntax: 'typescript', tsx: true },
                  transform: { react: { runtime: 'automatic', development: !PRODUCTION, refresh: !PRODUCTION } },
                },
                env: browserslistConfig,
              },
            },
            { loader: 'babel-loader' },
          ],
        },
      ],
    },
    plugins: [new rspack.DefinePlugin(env)],
  };

  if (DEV) {
    if (!config.plugins) {
      config.plugins = [];
    }
    config.plugins.push(new ReactRefreshPlugin());

    if (!config.output) {
      config.output = {};
    }
    config.output.crossOriginLoading = 'anonymous';

    // Enable source maps
    config.devtool = SOURCEMAP ? 'inline-source-map' : 'cheap-module-source-map';

    if (WDS) {
      config.devServer = {
        host: '0.0.0.0',
        port: 8089,
        static: false,
        compress: false,
        allowedHosts: 'all',
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
    }
  } else {
    // Compatibility with older browsers (no #private class fields, no public class fields)
    //@ts-ignore
    config.module.rules[0].include.push(
      path.dirname(require.resolve('minimatch')),
      path.dirname(require.resolve('reselect')),
    );

    if (ENABLE_PROFILING) {
      if (!config.resolve) {
        config.resolve = {};
      }
      if (!config.resolve.alias) {
        config.resolve.alias = {};
      }

      config.resolve.alias['react-dom'] = 'react-dom/profiling';
      config.resolve.alias['scheduler/tracing'] = 'scheduler/tracing-profiling';
    }
  }

  return config;
}

module.exports = buildConfiguration();
