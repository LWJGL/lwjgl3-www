import path from 'path';
import { promises as fs } from 'fs';
import sass from 'node-sass';
import postcss from 'postcss';
import config from '../postcss.config.js';
import { promisify } from 'util';

import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRODUCTION = process.env.NODE_ENV === 'production';

const renderSass = promisify(sass.render);

/*
  1. Render Sass to CSS
  2. Apply Autoprefixer with PostCSS
  3. Minimize CSS
  4. Write result to disk

  Entry point: /client/styles/layout.scss
  Output: /public/css/core.css

  CLI flags:
    --sourcemap generates source map for production
*/

const main = async () => {
  const filename = PRODUCTION ? 'core' : 'core-dev';
  const sourcePath = path.resolve(__dirname, '../client/styles/layout.scss');
  const targetPath = path.resolve(__dirname, `../public/css/${filename}.css`);
  const sourceMapPath = path.resolve(__dirname, `../public/css/${filename}.css.map`);
  const SOURCEMAP = process.argv.includes('--sourcemap') || !PRODUCTION;

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

  const result = await postcss(config.plugins).process(render.css, {
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
    await fs.writeFile(sourceMapPath, result.map.toString());
  }
};

main();
