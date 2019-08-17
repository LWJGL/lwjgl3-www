const path = require('path');
const fs = require('fs').promises;
const sass = require('node-sass');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const { argv } = require('yargs');
const renderSass = require('util').promisify(sass.render);

/*
  1. Render Sass to CSS
  2. Apply Autoprefixer with PostCSS
  3. Minimize CSS
  4. Write result to disk

  Entry point: /client/styles/layout.scss
  Output: /public/css/core.css

  CLI flags:
    --sourcemap generates source map
*/

const process = async () => {
  const sourcePath = path.resolve(__dirname, '../client/styles/layout.scss');
  const targetPath = path.resolve(__dirname, '../public/css/core.css');
  const sourceMapPath = path.resolve(__dirname, '../public/css/core.css.map');
  const SOURCEMAP = argv.sourcemap === true;

  console.log('Rendering Sass to CSS');

  const render = await renderSass({
    file: sourcePath,
    outputStyle: 'expanded',
    precision: 6,
    sourceComments: false,
    sourceMap: SOURCEMAP,
    sourceMapEmbed: SOURCEMAP,
    sourceMapRoot: '/',
  });

  console.log('Applying Autoprefixer & Minifying CSS');

  const result = await postcss([
    autoprefixer,
    cssnano({
      preset: [
        'default',
        {
          discardComments: {
            removeAll: true,
          },
        },
      ],
    }),
  ]).process(render.css, {
    from: sourcePath,
    to: targetPath,
    map: SOURCEMAP
      ? {
          inline: false,
        }
      : false,
  });

  await fs.writeFile(targetPath, result.css);
  if (result.map) {
    await fs.writeFile(sourceMapPath, result.map);
  }
};

process();
