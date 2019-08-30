const plugins = [
  // require('postcss-preset-env')({ stage: 0 }),
  require('autoprefixer'),
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    require('cssnano')({
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
