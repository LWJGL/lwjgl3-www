const webpack = require('webpack');
const path = require('path');

const config = {
  target: 'web',
  entry: {
    main: [
      'babel-polyfill',
      'whatwg-fetch',
      path.resolve(__dirname, 'client/app/main.js')
    ]
  },
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: '[name].js',
    chunkFilename: '[name].[id].js',
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
        loader: 'babel?cacheDirectory'
      }
    ]
  },
  plugins: []
};

if ( process.env.NODE_ENV !== 'production' ) {

  config.devtool = 'eval';
  // config.devtool = 'cheap-module-eval-source-map';
  // config.devtool = 'eval-source-map';

  // WebPack Hot Middleware client & HMR plugins
  config.entry.main.unshift(
    'webpack-hot-middleware/client',
    'react-hot-loader/patch'
  );

  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  );

  // Uncomment me to test async routes
  // WARNING: Breaks routes hot reloading!
  // config.plugins.push(new webpack.NormalModuleReplacementPlugin(/^\.\.\/routes\/Routes$/, '../routes/RoutesAsync'));

} else {

  config.output.filename = '[name].[chunkhash].js';
  config.output.chunkFilename = '[name].[chunkhash].js';

  const WebpackMd5Hash = require('webpack-md5-hash');
  const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');

  config.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.NormalModuleReplacementPlugin(
      /^\.\.\/routes\/Routes$/,
      '../routes/RoutesAsync'
    ),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: "main",
      minChunks: Infinity,
    }),
    new WebpackMd5Hash(),
    new ChunkManifestPlugin({
      filename: 'manifest.json',
      manifestVariable: "manifest",
    }),
    new webpack.optimize.UglifyJsPlugin({
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

module.exports = config;
