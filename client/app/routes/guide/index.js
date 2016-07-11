module.exports = {
  path: 'guide',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Guide').default)
    })
  }
};
