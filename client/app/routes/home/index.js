import nprogress from 'nprogress'

export default {
  getComponent(nextState, cb) {
    System.import('./Home').then((module) => {
      process.browser && nprogress.done();
      cb(null, module.default);
    });
  },
  onEnter() {
    process.browser && nprogress.start();
  }
};
