import nprogress from 'nprogress'

export default {
  path: 'source',
  getComponent(nextState, cb) {
    System.import('./Source').then((module) => {
      process.browser && nprogress.done();
      cb(null, module.default);
    });
  },
  onEnter() {
    process.browser && nprogress.start();
  }
};
