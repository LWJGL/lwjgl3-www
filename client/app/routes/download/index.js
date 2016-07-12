import nprogress from 'nprogress'

export default {
  path: 'download',
  getComponent(nextState, cb) {
    System.import('./Download').then((module) => {
      process.browser && nprogress.done();
      cb(null, module.default);
    });
  },
  onEnter() {
    process.browser && nprogress.start();
  }
};
