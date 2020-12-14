'use strict';
const PRODUCTION = process.env.NODE_ENV === 'production';
// https://web.dev/publish-modern-javascript/
// https://jakearchibald.com/2017/es-modules-in-browsers/
const MODERN = process.env.MODERN === 'true';
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

    // @stitches/react
    DEV && 'transform-stitches-display-name',

    // Stage-3
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-proposal-numeric-separator',

    // PRODUCTION && 'babel-plugin-transform-async-to-promises',
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
      // useBuiltIns: 'entry', // To use uncomment core-js import in main.ts, this will result in increased size
      useBuiltIns: 'usage',
      corejs: 3,
      bugfixes: true,
      shippedProposals: true,
      // exclude: ['transform-async-to-generator', 'transform-regenerator'],
    },
  ]);
}

module.exports = config;
