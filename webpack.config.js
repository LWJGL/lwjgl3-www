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
    filename: '[chunkhash].js',
    chunkFilename: '[chunkhash].js',
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
      'process.env.NODE_ENV': process.env.NODE_ENV ? JSON.stringify(process.env.NODE_ENV) : JSON.stringify('development')
    })
  ]
};

if ( process.env.NODE_ENV !== 'production' ) {

  config.devtool = 'eval';
  // config.devtool = 'cheap-module-eval-source-map';
  // config.devtool = 'eval-source-map';

  // WebPack Hot Middleware client & HMR plugins
  config.entry.main.unshift('react-hot-loader/patch');
  config.entry.main.unshift('webpack-hot-middleware/client');
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(new webpack.NoErrorsPlugin());

  // Avoid having to parse a manifest in dev mode
  config.output.filename = 'bundle.js';

  // Uncomment me to test async routes
  // WARNING: Breaks routes hot reloading!
  // config.plugins.push(new webpack.NormalModuleReplacementPlugin(/^\.\.\/routes\/Routes$/, '../routes/RoutesAsync'));

} else {

  config.plugins.push(new webpack.NormalModuleReplacementPlugin(/^\.\.\/routes\/Routes$/, '../routes/RoutesAsync'));

  // Put loaders in minification mode
  config.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    })
  );

  // minify
  config.plugins.push(
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
