const fs = require('fs');
const path = require('path');
const sass = require('node-sass');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const { argv } = require('yargs');
const util = require('util');
const writeFileAsync = util.promisify(fs.writeFile);

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

  const render = await util.promisify(sass.render)({
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
          // colormin: false,
          calc: false,
          zindex: false,
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

  await writeFileAsync(targetPath, result.css);
  if (result.map) {
    await writeFileAsync(sourceMapPath, result.map);
  }
};

process();
