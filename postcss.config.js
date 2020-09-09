'use strict';
const purgecss = require('@fullhuman/postcss-purgecss');
const presetenv = require('postcss-preset-env');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const PROD = process.env.NODE_ENV === 'production';
const plugins = [];

if (PROD) {
  // Purge unused CSS rules
  // https://tailwindcss.com/docs/controlling-file-size
  plugins.push(
    purgecss({
      content: ['./client/**/*.tsx'],
      whitelist: ['iconsheet'],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
    })
  );
}

// Create fallbacks for modern CSS
plugins.push(presetenv({ stage: 1 }));

// Add prefixes where required
plugins.push(autoprefixer);

if (PROD) {
  // Minimize CSS
  plugins.push(
    cssnano({
      preset: [
        'default',
        {
          discardComments: {
            removeAll: true,
          },
        },
      ],
    })
  );
}

module.exports = {
  plugins,
};
