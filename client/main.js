// @flow
import { mount } from './mount';

if (FLAG_CSSMODULES) {
  // Inject global styles, this enables HMR for SASS
  const styles = require('./styles/layout.scss');
  styles.use();
}

const bootPromises: Array<Promise<any>> = [];

if (!('fetch' in window)) {
  //$FlowFixMe
  bootPromises.push(import(/* webpackChunkName: "polyfill-fetch" */ 'whatwg-fetch'));
}

if (bootPromises.length) {
  Promise.all(bootPromises).then(mount);
} else {
  mount();
}
