const webpack = require('webpack');
const path = require('path');

const PRODUCTION = process.env.NODE_ENV === 'production';
const DEV = !PRODUCTION;

const config = {
  target: 'web',
  entry: {
    main: [
      'babel-polyfill',
      'whatwg-fetch',
      DEV ? path.resolve(__dirname, 'client/main.dev.js') : path.resolve(__dirname, 'client/main.js')
    ]
  },
  // devtool: DEV ? 'eval' : undefined,
  // devtool: '#inline-source-map',
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: DEV ? '[name].js' : '[name].[chunkhash].js',
    chunkFilename: DEV ? '[name].[id].js' : '[name].[chunkhash].js',
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
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': DEV ? JSON.stringify('development') : JSON.stringify('production')
    })
  ]
};

if ( DEV ) {

  // WebPack Hot Middleware client & HMR plugins
  config.entry.main.unshift(
    'webpack-hot-middleware/client',
    'react-hot-loader/patch'
  );

  config.plugins.push(
    new webpack.NormalModuleReplacementPlugin(
      /^\.\.\/store\/configureStore$/,
      '../store/configureStore.dev'
    ),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  );

  // Uncomment me to test async routes
  // WARNING: Breaks routes hot reloading!
  // config.plugins.push(new webpack.NormalModuleReplacementPlugin(/^\.\.\/routes\/Routes$/, '../routes/RoutesAsync'));

} else {

  const WebpackMd5Hash = require('webpack-md5-hash');
  const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');

  config.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
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
