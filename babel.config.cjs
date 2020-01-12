'use strict';
const { argv } = require('yargs');

const PRODUCTION = process.env.NODE_ENV === 'production';
const MODERN = process.env.MODERN === 'true'; // https://jakearchibald.com/2017/es-modules-in-browsers/
const DEV = !PRODUCTION;
const HMR = DEV && argv.nohmr === undefined;

const config = {
  presets: ['@babel/preset-typescript'],
  plugins: [
    DEV && HMR && 'react-refresh/babel',
    // React
    DEV && '@babel/plugin-transform-react-jsx-self',
    DEV && '@babel/plugin-transform-react-jsx-source',
    DEV && '@babel/plugin-transform-react-display-name',
    PRODUCTION && ['transform-react-remove-prop-types', { mode: 'remove', removeImport: true }],
    PRODUCTION && 'babel-plugin-optimize-react',
    ['@babel/plugin-transform-react-jsx', { useBuiltIns: PRODUCTION, useSpread: !PRODUCTION }],
    [
      '@emotion',
      {
        sourceMap: !PRODUCTION,
        // autoLabel: !PRODUCTION,
        // labelFormat: '[local]',
        cssPropOptimization: false,
      },
    ],

    // Stage-3
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-proposal-numeric-separator',

    PRODUCTION && 'babel-plugin-transform-async-to-promises',
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
