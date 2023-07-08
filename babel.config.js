'use strict';
const PRODUCTION = process.env.NODE_ENV === 'production';
// https://web.dev/publish-modern-javascript/
// https://jakearchibald.com/2017/es-modules-in-browsers/
// const MODERN = process.env.MODERN === 'true';
const DEV = !PRODUCTION;

const config = {
  browserslistEnv: PRODUCTION ? 'production' : 'development',
  parserOpts: {
    strictMode: true,
  },
  assumptions: {
    // arrayLikeIsIterable: true,
    constantReexports: true,
    constantSuper: true,
    enumerableModuleMeta: true,
    ignoreFunctionLength: true,
    ignoreToPrimitiveHint: true,
    iterableIsArray: true,
    mutableTemplateObject: true,
    noClassCalls: true,
    noDocumentAll: true,
    noNewArrows: true,
    objectRestNoSymbols: true,
    privateFieldsAsProperties: true,
    pureGetters: true,
    setClassMethods: true,
    setComputedProperties: true,
    setPublicClassFields: true,
    setSpreadProperties: true,
    skipForOfIteratorClosing: true,
    superIsCallableConstructor: true,
  },
  presets: [
    [
      '@babel/preset-typescript',
      {
        allowDeclareFields: true, // TODO: Remove in Babel@8+ (it will be the default)
        onlyRemoveTypeImports: true,
      },
    ],
    ['@babel/preset-react', { runtime: 'automatic', development: DEV }],
  ],
  plugins: [],
};

if (DEV) {
  config.plugins.unshift('react-refresh/babel');
} else if (PRODUCTION) {
  config.presets.push([
    '@babel/env',
    {
      bugfixes: true, // TODO: Remove in Babel@8+ (it will be the default)
    },
  ]);

  config.plugins.push([
    'polyfill-corejs3',
    {
      method: 'usage-global',
      version: '3.30.2',
      proposals: true,
    },
  ]);
}

module.exports = config;
