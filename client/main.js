// @flow
import { mount } from './mount';
import { setAutoFreeze } from 'immer';
// import loadJS from 'fg-loadjs';

setAutoFreeze(false);

if (process.env.NODE_ENV === 'production' && window.isSecureContext) {
  window.addEventListener('load', () => {
    // Register service worker
    if (navigator.serviceWorker) {
      navigator.serviceWorker.register('/sw.js');
      // .then(registration => {
      //   // Registration was successful
      //   console.log('ServiceWorker registration successful with scope: ', registration.scope);
      // })
      // .catch(err => {
      //   // registration failed :(
      //   console.error('ServiceWorker registration failed: ', err);
      // });
      // } else {
      //   console.warn('Service workers are not supported.');
    }
  });

  // Prevent web app install banner from being displayed automatically
  // https://developers.google.com/web/fundamentals/app-install-banners/#defer_or_cancel
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    return false;
  });
} else if (CSSMODULES) {
  // Inject global styles, this enables HMR for SASS
  const styles = require('./styles/layout.scss');
  styles.use();

  // Unregister service workers if found
  // if (navigator.serviceWorker) {
  //   navigator.serviceWorker.getRegistrations().then(registrations => {
  //     registrations.forEach(registration => registration.unregister());
  //   });
  // }
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
  bootPromises.push(import(/* webpackChunkName: "nosw-fetch" */ 'whatwg-fetch'));
}

if (bootPromises.length) {
  Promise.all(bootPromises).then(mount);
} else {
  mount();
}
