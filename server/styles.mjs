import path from 'path';
import fs from 'fs/promises';
import postcss from 'postcss';
import scss from 'postcss-scss';
import cssimport from 'postcss-import';
import presetenv from 'postcss-preset-env';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRODUCTION = process.env.NODE_ENV === 'production';
const sourcePath = path.resolve(__dirname, '../client/theme/global.scss');
const source = await fs.readFile(sourcePath, 'utf-8');

const plugins = [cssimport, presetenv({ stage: 1 }), autoprefixer];

if (PRODUCTION) {
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

const result = await postcss(plugins).process(source, {
  parser: scss,
  from: sourcePath,
  // to: targetPath,
  // map: PRODUCTION ? false : { inline: true },
  map: false,
});

export const css = result.css;
