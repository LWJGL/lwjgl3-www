// import 'core-js';
import { mount } from './mount';

// const bootPromises: Array<Promise<any>> = [];
const bootPromises = [];

if (!('fetch' in window)) {
  bootPromises.push(
    //@ts-ignore
    import(/* webpackChunkName: "vendor-polyfill-fetch" */ 'whatwg-fetch')
  );
}

if (bootPromises.length) {
  Promise.all(bootPromises).then(mount);
} else {
  mount();
}
