const path = require('path');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');

// Development
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');
const NoEmitOnErrorsPlugin = require('webpack/lib/NoEmitOnErrorsPlugin');

// Production
const IgnorePlugin = require('webpack/lib/IgnorePlugin');
const HashedModuleIdsPlugin = require('webpack/lib/HashedModuleIdsPlugin');
const WebpackChunkHash = require('webpack-chunk-hash');
const ChunkManifestPlugin  = require('chunk-manifest-webpack-plugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

const PRODUCTION = process.env.NODE_ENV === 'production';
const DEV = !PRODUCTION;

const buildConfiguration = () => {
  const config = {
    target: 'web',
    performance: {
      hints: false
    },
    entry: {
      main: [
        path.resolve(__dirname, 'client/main.js')
      ]
    },
    output: {
      path: path.resolve(__dirname, 'public/js'),
      filename: DEV ? '[name].js' : '[name].[chunkhash].js',
      chunkFilename: DEV ? '[name].js' : '[name].[chunkhash].js',
      publicPath: '/js/'
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: [
            path.resolve(__dirname, 'node_modules')
          ],
          include: __dirname,
          use: [{
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }]
        },
        {
          test: /\.scss?$/,
          use: [
            "style-loader/useable",
            {
              loader: "css-loader",
              options: {
                // This breaks HMR (CSS Modules change name because their hash changes)
                modules: false,
                localIdentName: '[local]_[hash:base64:7]',
                // This breaks background-image and other relative paths
                // Monitor this: https://github.com/webpack/style-loader/pull/124
                // sourceMap: DEV,
                sourceMap: false,
                import: false,
                url: false,
                // CSSNano Options
                minimize: {
                  // safe: true,
                  colormin: false,
                  calc: false,
                  zindex: false,
                  discardComments: {
                    removeAll: true
                  }
                },
              },
            },
            "postcss-loader",
            {
              loader: 'sass-loader',
              query: {
                sourceMap: false,
                sourceComments: false,
                outputStyle: 'expanded',
                precision: 6
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new DefinePlugin({
        'process.env.NODE_ENV': DEV ? JSON.stringify('development') : JSON.stringify('production'),
      }),
      new LoaderOptionsPlugin({
        minimize: PRODUCTION,
        debug: false
      }),
    ],
    // recordsPath: path.resolve(__dirname, `./scripts/recordsPath.js.json`),
    // recordsInputPath: path.resolve(__dirname, `./scripts/recordsInputPath.js.json`),
    // recordsOutputPath: path.resolve(__dirname, `./scripts/recordsOutputPath.js.json`),
    stats: {
      assets: true,
      cached: false,
      children: false,
      chunks: true,
      chunkModules: true,
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
    }
  };

  if ( DEV ) {

    // WebPack Hot Middleware client & HMR plugins
    config.entry.main.unshift(
      'webpack-hot-middleware/client',
      'react-hot-loader/patch'
    );

    config.plugins.push(
      new HotModuleReplacementPlugin(),
      new NoEmitOnErrorsPlugin(),
      new NamedModulesPlugin(),
      new DllReferencePlugin({
        context: '.',
        manifest: require('./public/js/vendor-manifest.json')
      })
    );

    // Uncomment me to test async routes
    // WARNING: Breaks routes hot loading!
    // config.plugins.push(
    //   new NormalModuleReplacementPlugin(
    //     /RoutesDevelopment/,
    //     (result) => {
    //       result.request = result.request.replace(/RoutesDevelopment/, 'RoutesProduction');
    //     }
    //   )
    // );

  } else {

    config.plugins.push(
      new IgnorePlugin(/(redux-logger|react-hot-loader)/),
      new NormalModuleReplacementPlugin(
        /RoutesDevelopment/,
        (result) => {
          result.request = result.request.replace(/RoutesDevelopment/, 'RoutesProduction');
        }
      ),
      new HashedModuleIdsPlugin(),
      new WebpackChunkHash(),
      new ChunkManifestPlugin({
        filename: `chunks.json`,
        manifestVariable: 'webpackManifest'
      }),
      new UglifyJsPlugin({
        sourceMap: false,
        mangle: {
          screw_ie8: true,
          except: []
        },
        comments: false,
        compress: {
          screw_ie8: true,
          sequences: true,
          properties: true,
          dead_code: true,
          drop_debugger: true,
          unsafe: true,
          conditionals: true,
          comparisons: true,
          evaluate: true,
          booleans: true,
          loops: true,
          unused: true,
          hoist_funs: true,
          hoist_vars: false,
          if_return: true,
          join_vars: true,
          cascade: true,
          warnings: false,
          negate_iife: true,
          pure_getters: true,
          pure_funcs: null,
          drop_console: true,
          keep_fargs: false,
          keep_fnames: false
        }
      })
    );
  }

  return config;
};

module.exports = buildConfiguration();
