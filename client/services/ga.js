// @flow
import loadJS from 'fg-loadjs';

const DNT = navigator.doNotTrack === 1 || window.doNotTrack === 1;
const ENABLE_TRACKING = FLAG_PRODUCTION && document.location.hostname === HOSTNAME_PRODUCTION;
let firstCall = true;

export function analytics(...args: Array<any>) {
  if (!DNT && ENABLE_TRACKING) {
    if (firstCall) {
      loadJS(`https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_TRACKING_ID}`);
      firstCall = false;
    }

    window.gtag.apply(null, args);
  }
}

export function trackView(params: {}) {
  analytics('config', ANALYTICS_TRACKING_ID, params);
}
