module.exports = {
  path: 'source',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Source').default)
    })
  }
};
