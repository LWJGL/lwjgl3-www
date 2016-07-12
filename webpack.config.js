const webpack = require('webpack');
const path = require('path');

const babelLoader = {
  test: /\.jsx?$/,
  exclude: [
    path.resolve(__dirname, 'node_modules')
  ],
  include: __dirname,
  loader: 'babel',
  query: {
    cacheDirectory: true,
    plugins: [
      // Stage-0
      // https://github.com/babel/babel/tree/master/packages/babel-preset-stage-0
      'transform-do-expressions',
      'transform-function-bind',

      // Stage-1
      // https://github.com/babel/babel/tree/master/packages/babel-preset-stage-1
      'transform-class-constructor-call',
      'transform-class-properties',
      'transform-decorators',
      'transform-export-extensions',

      // Stage-2
      // https://github.com/babel/babel/tree/master/packages/babel-preset-stage-2
      'syntax-trailing-function-commas',
      'transform-object-rest-spread',

      // Stage-3
      // https://github.com/babel/babel/tree/master/packages/babel-preset-stage-3
      'transform-async-to-generator',
      'transform-exponentiation-operator',

      // ES2015
      // https://github.com/babel/babel/tree/master/packages/babel-preset-es2015
      ['transform-es2015-template-literals', {'loose': true}],
      'transform-es2015-literals',
      'transform-es2015-function-name',
      'transform-es2015-arrow-functions',
      'transform-es2015-block-scoped-functions',
      ['transform-es2015-classes', {'loose': true}],
      'transform-es2015-object-super',
      'transform-es2015-shorthand-properties',
      'transform-es2015-duplicate-keys',
      ['transform-es2015-computed-properties', {'loose': true}],
      ['transform-es2015-for-of', {'loose': true}],
      'transform-es2015-sticky-regex',
      'transform-es2015-unicode-regex',
      'check-es2015-constants',
      ['transform-es2015-spread', {'loose': true}],
      'transform-es2015-parameters',
      ['transform-es2015-destructuring', {'loose': true}],
      'transform-es2015-block-scoping',
      'transform-es2015-typeof-symbol',
      // ['transform-es2015-modules-commonjs', {'loose': true}], // Let Webpack parse ES6 modules
      ['transform-regenerator', {async: false, asyncGenerators: false}],

      // React
      // https://github.com/babel/babel/tree/master/packages/babel-preset-react
      'transform-react-jsx',
      'transform-flow-strip-types',
      'syntax-flow',
      'syntax-jsx',
      'transform-react-display-name'
    ]
  }
};

const config = {
  entry: {
    main: [
      'babel-polyfill',
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
    loaders: [
      babelLoader
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),

    // Fetch Polyfill
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
  ]
};

if ( process.env.NODE_ENV !== 'production' ) {

  config.devtool = 'eval';
  //config.devtool = 'cheap-module-eval-source-map';

  // Load WebPack Hot Middleware client
  config.entry.main.unshift('webpack-hot-middleware/client');

  // Avoid having to parse a manifest in dev mode
  config.output.filename = 'bundle.js';

  // React Babel react-transform plugin for Hot-Module Replacement
  babelLoader.query.plugins.push(
    ['react-transform', {
      transforms: [
        {
          transform: 'react-transform-hmr',
          imports: ['react'],
          locals: ['module']
        },
        {
          transform: 'react-transform-catch-errors',
          imports: ['react', 'redbox-react']
        }
      ]
    }]
  );

  // Add Hot-Module Replacement WebPack plugins
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(new webpack.NoErrorsPlugin());

} else {

  babelLoader.query.plugins.push(
    'transform-react-constant-elements',
    'transform-react-inline-elements',
    'transform-react-remove-prop-types'
  );

  // Put loaders in minification mode
  config.plugins.push(new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false
  }));

  // minify
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
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
