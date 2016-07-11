module.exports = {
  path: 'download',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Download').default)
    })
  }
};
