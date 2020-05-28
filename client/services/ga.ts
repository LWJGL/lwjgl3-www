import { loadJS } from './loadJS';

declare global {
  interface Window {
    gtag: (...args: Array<any>) => void;
  }
}

const MEASUREMENT_ID = ANALYTICS_TRACKING_ID;
const DNT = navigator.doNotTrack === '1' || window.doNotTrack === '1';
const ENABLE_TRACKING = FLAG_PRODUCTION && document.location.hostname === HOSTNAME_PRODUCTION;

let firstCall = true;

export function analytics(...args: Array<any>) {
  if (!DNT && ENABLE_TRACKING) {
    if (firstCall) {
      loadJS(`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`);
      firstCall = false;
    }

    window.gtag(...args);
  }
}

export function trackView(params: any) {
  analytics('config', MEASUREMENT_ID, params);
}
