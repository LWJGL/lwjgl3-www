import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import purgecss from '@fullhuman/postcss-purgecss';

const plugins = [
  // require('postcss-preset-env')({ stage: 0 }),
  autoprefixer,
];

if (process.env.NODE_ENV === 'production') {
  // https://tailwindcss.com/docs/controlling-file-size
  plugins.push(
    purgecss({
      content: ['./client/**/*.tsx'],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
    })
  );

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

export default { plugins };
