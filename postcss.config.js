import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

const plugins = [
  // require('postcss-preset-env')({ stage: 0 }),
  autoprefixer,
];

if (process.env.NODE_ENV === 'production') {
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
