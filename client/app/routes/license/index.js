import nprogress from 'nprogress'

export default {
  path: 'license',
  getComponent(nextState, cb) {
    System.import('./License').then((module) => {
      process.browser && nprogress.done();
      cb(null, module.default);
    });
  },
  onEnter() {
    process.browser && nprogress.start();
  }
};
