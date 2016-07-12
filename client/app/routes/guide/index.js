import nprogress from 'nprogress'

export default {
  path: 'guide',
  getComponent(nextState, cb) {
    System.import('./Guide').then((module) => {
      process.browser && nprogress.done();
      cb(null, module.default);
    });
  },
  onEnter() {
    process.browser && nprogress.start();
  }
};
