module.exports = {
  plugins: [
    require('autoprefixer')({
      remove: false,
      browsers: [
        '> 4%'
      ]
    })
  ]
};
