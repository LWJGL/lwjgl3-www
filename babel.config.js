'use strict';
const PRODUCTION = process.env.NODE_ENV === 'production';
const MODERN = process.env.MODERN === 'true'; // https://jakearchibald.com/2017/es-modules-in-browsers/
const DEV = !PRODUCTION;
const HMR = DEV && process.argv.includes('--nohmr');

const config = {
  presets: [
    [
      '@babel/preset-typescript',
      {
        allowDeclareFields: true, // TODO: Remove in Babel@8+ (it will be the default)
        onlyRemoveTypeImports: true,
      },
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
        development: DEV,
        useBuiltIns: true,
        useSpread: DEV,
      },
    ],
  ],
  plugins: [
    // React
    HMR && 'react-refresh/babel',
    PRODUCTION && [
      'transform-react-remove-prop-types',
      {
        mode: 'remove',
        removeImport: true,
      },
    ],

    // @stitches/react
    DEV && 'transform-stitches-display-name',

    // Stage-3
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-proposal-numeric-separator',

    PRODUCTION && 'babel-plugin-transform-async-to-promises',
  ].filter(Boolean),
};

if (PRODUCTION) {
  config.presets.push([
    '@babel/env',
    {
      spec: false,
      loose: true,
      modules: false,
      debug: false,
      useBuiltIns: 'usage',
      corejs: 3,
      bugfixes: true,
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
