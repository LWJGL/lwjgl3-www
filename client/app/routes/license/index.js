module.exports = {
  path: 'license',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./License').default)
    })
  }
};
