const { argv } = require('yargs');
const { NODE_ENV } = process.env;
const PRODUCTION = NODE_ENV === 'production';
const DEV = !PRODUCTION;
const SOURCEMAP = argv.sourcemap !== undefined;

const config = {
  plugins: [
    DEV ? ['emotion', { sourceMap: SOURCEMAP, autoLabel: true }] : ['emotion', { hoist: true }],
    // 'react-hot-loader/babel',
    '@babel/plugin-transform-flow-strip-types',

    // React
    DEV && '@babel/plugin-transform-react-jsx-self',
    DEV && '@babel/plugin-transform-react-jsx-source',
    DEV && '@babel/plugin-transform-react-display-name',
    PRODUCTION && [
      'transform-react-remove-prop-types',
      {
        mode: 'remove',
        removeImport: true,
      },
    ],
    PRODUCTION && '@babel/plugin-transform-react-constant-elements',
    PRODUCTION && '@babel/plugin-transform-react-inline-elements',
    ['@babel/plugin-transform-react-jsx', { useBuiltIns: true }],

    // Stage-1
    // '@babel/plugin-proposal-export-default-from',
    // '@babel/plugin-proposal-logical-assignment-operators',
    '@babel/plugin-proposal-optional-chaining',
    // '@babel/plugin-proposal-pipeline-operator',
    // '@babel/plugin-proposal-nullish-coalescing-operator',
    // '@babel/plugin-proposal-do-expressions',

    // Stage-2
    // '@babel/plugin-proposal-decorators',
    // '@babel/plugin-proposal-function-sent',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-numeric-separator',
    // '@babel/plugin-proposal-throw-expressions',

    // Stage-3
    '@babel/plugin-syntax-dynamic-import',
    // "@babel/plugin-syntax-import-meta",
    PRODUCTION && '@babel/plugin-proposal-async-generator-functions',
    ['@babel/plugin-proposal-class-properties', { spec: false }],
    ['@babel/plugin-proposal-object-rest-spread', { useBuiltIns: true }],
    '@babel/plugin-proposal-optional-catch-binding',
    // "@babel/plugin-proposal-unicode-property-regex",

    // ES2017
    PRODUCTION && '@babel/plugin-transform-async-to-generator',

    // ES2016
    // "@babel/plugin-transform-exponentiation-operator",

    /*
    // ES2015
    ["@babel/plugin-transform-template-literals", { "spec": false, "loose": true }],
    "@babel/plugin-transform-literals",
    "@babel/plugin-transform-function-name",
    ["@babel/plugin-transform-arrow-functions", { "spec": false }],
    "@babel/plugin-transform-block-scoped-functions",
    ["@babel/plugin-transform-classes", { "loose": true }],
    "@babel/plugin-transform-object-super",
    "@babel/plugin-transform-shorthand-properties",
    "@babel/plugin-transform-duplicate-keys",
    ["@babel/plugin-transform-computed-properties", { "loose": true }],
    ["@babel/plugin-transform-for-of", { "loose": true }],
    "@babel/plugin-transform-sticky-regex",
    "@babel/plugin-transform-unicode-regex"
    ["@babel/plugin-transform-spread", { "loose": true }],
    ["@babel/plugin-transform-parameters", { "loose": true }],
    ["@babel/plugin-transform-destructuring", { "loose": true }],
    "@babel/plugin-transform-block-scoping",
    "@babel/plugin-transform-typeof-symbol",
    "@babel/plugin-transform-instanceof",
    */
    PRODUCTION && ['@babel/plugin-transform-regenerator', { async: false, asyncGenerators: false, generators: true }],

    // https://github.com/MatAtBread/fast-async
    // async/await using Promises instead of (Re)generator
    // PRODUCTION && [
    //   'module:fast-async',
    //   {
    //     spec: true,
    //   },
    // ],
  ].filter(Boolean),
};

if (NODE_ENV === 'production') {
  config.presets = [
    [
      '@babel/env',
      {
        spec: false,
        loose: true,
        modules: false,
        forceAllTransforms: true,
        debug: false,
        useBuiltIns: 'entry',
        shippedProposals: true,
        exclude: [
          'es6.typed.array-buffer',
          'es6.typed.data-view',
          'es6.typed.int8-array',
          'es6.typed.uint8-array',
          'es6.typed.uint8-clamped-array',
          'es6.typed.int16-array',
          'es6.typed.uint16-array',
          'es6.typed.int32-array',
          'es6.typed.uint32-array',
          'es6.typed.float32-array',
          'es6.typed.float64-array',
          // "es6.map",
          // "es6.set",
          // "es6.weak-map",
          // "es6.weak-set",
          'es6.reflect.apply',
          'es6.reflect.construct',
          'es6.reflect.define-property',
          'es6.reflect.delete-property',
          'es6.reflect.get',
          'es6.reflect.get-own-property-descriptor',
          'es6.reflect.get-prototype-of',
          'es6.reflect.has',
          'es6.reflect.is-extensible',
          'es6.reflect.own-keys',
          'es6.reflect.prevent-extensions',
          'es6.reflect.set',
          'es6.reflect.set-prototype-of',
          // "es6.promise",
          // "es6.symbol",
          'es6.object.freeze',
          'es6.object.seal',
          // "es6.object.prevent-extensions",
          'es6.object.is-frozen',
          'es6.object.is-sealed',
          // "es6.object.is-extensible",
          'es6.object.get-own-property-descriptor',
          // "es6.object.get-prototype-of",
          // "es6.object.keys",
          // "es6.object.get-own-property-names",
          // "es6.object.assign",
          // "es6.object.is",
          // "es6.object.set-prototype-of",
          // "es6.function.name",
          // "es6.string.raw",
          // "es6.string.from-code-point",
          // "es6.string.code-point-at",
          // "es6.string.repeat",
          // "es6.string.starts-with",
          // "es6.string.ends-with",
          // "es6.string.includes",
          // "es6.regexp.flags",
          // "es6.regexp.match",
          // "es6.regexp.replace",
          // "es6.regexp.split",
          // "es6.regexp.search",
          // "es6.array.from",
          // "es6.array.of",
          // "es6.array.copy-within",
          // "es6.array.find",
          // "es6.array.find-index",
          // "es6.array.fill",
          // "es6.array.iterator",
          // "es6.number.is-finite",
          // "es6.number.is-integer",
          // "es6.number.is-safe-integer",
          // "es6.number.is-nan",
          // "es6.number.epsilon",
          // "es6.number.min-safe-integer",
          // "es6.number.max-safe-integer",
          // "es6.number.parse-float",
          // "es6.number.parse-int",
          'es6.math.acosh',
          'es6.math.asinh',
          'es6.math.atanh',
          'es6.math.cbrt',
          'es6.math.clz32',
          'es6.math.cosh',
          'es6.math.expm1',
          'es6.math.fround',
          'es6.math.hypot',
          'es6.math.imul',
          'es6.math.log1p',
          'es6.math.log10',
          'es6.math.log2',
          'es6.math.sign',
          'es6.math.sinh',
          'es6.math.tanh',
          'es6.math.trunc',
          // "es7.array.includes",
          // "es7.object.values",
          // "es7.object.entries",
          // "es7.object.get-own-property-descriptors",
          // "es7.string.pad-start",
          // "es7.string.pad-end",
          // "es7.promise.finally"
        ],
      },
    ],
  ];
}

module.exports = config;
