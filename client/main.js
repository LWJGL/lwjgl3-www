// @flow
// Loosely based on "Polyfills: everything you ever wanted to know, or maybe a bit less" by David Gilbertson
// https://hackernoon.com/polyfills-everything-you-ever-wanted-to-know-or-maybe-a-bit-less-7c8de164e423#.qtc0jwnhc

// Used to load external polyfills
import loadJS from 'fg-loadjs';

// Webpack manifest
if (process.env.NODE_ENV === 'production') {
  //$FlowFixMe
  window.webpackManifest = JSON.parse(document.getElementById('manifest').innerHTML);
}

// We want to handle scroll restoration on our own
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

if (process.env.NODE_ENV === 'development' && CSSMODULES) {
  // Inject global styles, this enables HMR
  const styles = require('./styles/layout.scss');
  styles.use();
}

// Hide spinner from nprogress
import nprogress from 'nprogress';
nprogress.configure({
  showSpinner: false,
});

// Mounts the app only after we are done polyfilling
import mount from './mount';

const bootPromises: Array<Promise<any>> = [];

if (!('classList' in HTMLElement.prototype)) {
  bootPromises.push(
    new Promise(resolve => {
      loadJS('https://cdn.polyfill.io/v2/polyfill.min.js?flags=gated&features=Element.prototype.classList', resolve);
    })
  );
}

if (!('fetch' in window)) {
  bootPromises.push(import(/* webpackChunkName: "whatwg-fetch" */ 'whatwg-fetch'));
}

// The following should resolve immediatelly in modern browsers
if (bootPromises.length) {
  Promise.all(bootPromises).then(mount);
} else {
  mount();
}
