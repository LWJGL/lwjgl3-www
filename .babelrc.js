const PRODUCTION = process.env.NODE_ENV === 'production';
const MODERN = process.env.MODERN === 'true'; // https://jakearchibald.com/2017/es-modules-in-browsers/
const DEV = !PRODUCTION;
// const { argv } = require('yargs');
// const HMR = argv.nohmr === undefined;

const config = {
  presets: ['@emotion/babel-preset-css-prop', '@babel/preset-typescript'],
  plugins: [
    // DEV && HMR && 'react-refresh/babel',
    // React
    DEV && '@babel/plugin-transform-react-jsx-self',
    DEV && '@babel/plugin-transform-react-jsx-source',
    DEV && '@babel/plugin-transform-react-display-name',
    PRODUCTION && ['transform-react-remove-prop-types', { mode: 'remove', removeImport: true }],
    PRODUCTION && 'transform-react-pure-class-to-function',
    // PRODUCTION && '@babel/plugin-transform-react-constant-elements', // Breaks SVG, Larger file size but faster reconciliation and less GC pressure
    PRODUCTION && 'babel-plugin-optimize-react',
    // PRODUCTION && '@babel/plugin-transform-react-inline-elements', // Breaks @emotion
    // ['@babel/plugin-transform-react-jsx', { useBuiltIns: true }], // Used internally by @emotion preset

    // Stage-1
    // '@babel/plugin-proposal-optional-chaining',

    // Stage-2
    // '@babel/plugin-proposal-export-namespace-from',
    // '@babel/plugin-proposal-numeric-separator',

    // Stage-3
    '@babel/plugin-syntax-dynamic-import',
    ['@babel/plugin-proposal-class-properties', { spec: false }],

    // https://github.com/MatAtBread/fast-async
    // async/await using Promises instead of (Re)generator
    PRODUCTION && !MODERN && ['module:fast-async', { spec: true }],
  ].filter(Boolean),
};

if (PRODUCTION) {
  config.presets.unshift([
    '@babel/env',
    {
      spec: false,
      loose: true,
      modules: false,
      debug: false,
      useBuiltIns: 'usage',
      corejs: 3,
      exclude: ['transform-async-to-generator', 'transform-regenerator'],
    },
  ]);

  if (MODERN) {
    // ~9KB smaller gzip size (not currently used)
    config.presets[0][1].targets = {
      esmodules: true,
    };
  }
}

module.exports = config;
