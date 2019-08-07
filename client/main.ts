import { mount } from './mount';

if (FLAG_CSSMODULES) {
  // Inject global styles, this enables HMR for SASS
  require('./styles/layout.scss');
}

// const bootPromises: Array<Promise<any>> = [];
const bootPromises = [];

if (!('fetch' in window)) {
  //@ts-ignore
  bootPromises.push(import(/* webpackChunkName: "polyfill-fetch" */ 'whatwg-fetch'));
}

if (bootPromises.length) {
  Promise.all(bootPromises).then(mount);
} else {
  mount();
}
