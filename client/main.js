// Loosely based on "Polyfills: everything you ever wanted to know, or maybe a bit less" by David Gilbertson
// https://hackernoon.com/polyfills-everything-you-ever-wanted-to-know-or-maybe-a-bit-less-7c8de164e423#.qtc0jwnhc
import 'babel-polyfill';

// Pull common modules that we want preloaded in the main chunk
import './containers/PageView';
import './components/Style';

// Used to load external polyfills
import loadJS from 'fg-loadjs';

// Mounts the app only after we are done polyfilling
import mount from './mount';

// Webpack manifest
if (process.env.NODE_ENV === 'production') {
  // $FlowFixMe
  window.webpackManifest = JSON.parse(document.getElementById('manifest').innerHTML);
}

// We want to handle scroll restoration on our own
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

// The following should resolve immediatelly in modern browsers
Promise.all([
  // Really-old browsers that need to be taken by the hand
  // This requires HTTP request out of our control
  new Promise(resolve => {
    if ('requestAnimationFrame' in window && 'classList' in HTMLElement.prototype) {
      resolve();
    } else {
      loadJS(
        'https://cdn.polyfill.io/v2/polyfill.min.js?flags=gated&features=requestAnimationFrame,Element.prototype.classList',
        resolve
      );
    }
  }),
  // Fetch polyfill
  'fetch' in window ? 1 : import(/* webpackChunkName: "whatwg-fetch" */ 'whatwg-fetch'),
]).then(mount);
