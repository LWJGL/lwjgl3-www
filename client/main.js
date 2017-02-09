// Loosely based on "Polyfills: everything you ever wanted to know, or maybe a bit less" by David Gilbertson
// https://hackernoon.com/polyfills-everything-you-ever-wanted-to-know-or-maybe-a-bit-less-7c8de164e423#.qtc0jwnhc

// Promise polyfill is required for the entry to work
import 'core-js/es6/promise';

// Used to load external polyfills
import loadJS from 'fg-loadjs'

// Mounts the app only after we are done polyfilling
import mount from './mount'

// Webpack manifest
if ( process.env.NODE_ENV === 'production' ) {
  window.webpackManifest = JSON.parse(document.getElementById('manifest').innerHTML);
}

// The following should resolve immediatelly in modern browsers
Promise.all([
  // Really-old browsers that need to be taken by the hand
  // This requires HTTP request out of our control
  new Promise((resolve) => {
    if (
         'requestAnimationFrame' in window
      && 'classList' in Element.prototype
    ) {
      resolve();
    } else {
      loadJS(`https://cdn.polyfill.io/v2/polyfill.min.js?flags=gated&features=requestAnimationFrame,Element.prototype.classList`, resolve);
    }
  }),
  // Fetch polyfill
  'fetch' in window ? Promise.resolve() : import('whatwg-fetch'),
  // Load entire core-JS ( we could also use babel-polyfill here ), it's not worth cherry-picking further
  (
       'startsWith' in String.prototype
    && 'endsWith' in String.prototype
    && 'includes' in Array.prototype
    && 'assign' in Object
    && 'keys' in Object
    && 'entries' in Object // This should cover all the above, but let's keep them for safety
  )
    ? Promise.resolve()
    : import('core-js'),
]).then(mount);
