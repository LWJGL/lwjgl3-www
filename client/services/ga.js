// @flow
import loadJS from 'fg-loadjs';

const DNT = navigator.doNotTrack === 1 || window.doNotTrack === 1;
const ENABLE_TRACKING = FLAG_PRODUCTION && document.location.hostname === 'www.lwjgl.org';
let firstCall = true;

window.dataLayer = window.dataLayer || [];

export function gtag(...args: Array<any>) {
  if (!DNT && ENABLE_TRACKING) {
    if (firstCall) {
      loadJS(`https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_TRACKING_ID}`);
      firstCall = false;
    }

    window.dataLayer.push(args);
  }
}

export function trackView(params: {}) {
  gtag('config', ANALYTICS_TRACKING_ID, params);
}

gtag('js', new Date());
gtag('config', ANALYTICS_TRACKING_ID, {
  send_page_view: false,
  transport_type: 'beacon',
  anonymize_ip: true,
});
