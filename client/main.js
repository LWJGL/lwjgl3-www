// @flow
import nprogress from 'nprogress';
import loadJS from 'fg-loadjs';
import mount from './mount';

// Webpack manifest
if (process.env.NODE_ENV === 'production') {
  const manifestJson = document.getElementById('manifest');
  if (manifestJson) {
    window.webpackManifest = JSON.parse(manifestJson.innerHTML);
  }
} else if (CSSMODULES) {
  // Inject global styles, this enables HMR for SASS
  const styles = require('./styles/layout.scss');
  styles.use();
}

// We want to handle scroll restoration on our own
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

const bootPromises: Array<Promise<any>> = [];

// if (!('classList' in HTMLElement.prototype)) {
//   bootPromises.push(
//     new Promise(resolve => {
//       loadJS('https://cdn.polyfill.io/v2/polyfill.min.js?flags=gated&features=Element.prototype.classList', resolve);
//     })
//   );
// }

if (!('fetch' in window)) {
  bootPromises.push(import(/* webpackChunkName: "whatwg-fetch" */ 'whatwg-fetch'));
}

if (bootPromises.length) {
  Promise.all(bootPromises).then(mount);
} else {
  mount();
}
