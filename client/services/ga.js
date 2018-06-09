// @flow
import loadJS from 'fg-loadjs';

// Use this to load GA on demand
let firstCall = true;

const DNT = navigator.doNotTrack === 1 || window.doNotTrack === 1;
const ENABLE_TRACKING = FLAG_PRODUCTION && document.location.hostname === 'www.lwjgl.org';

const track = function(command: string, ...fields: Array<any>): void {
  if (DNT) {
    return;
  }
  if (ENABLE_TRACKING && firstCall) {
    loadJS('https://www.google-analytics.com/analytics.js');
    firstCall = false;
  }

  track.q.push(arguments);
};

track.q = [];
track.l = 1 * new Date();

window.ga = track;
window.GoogleAnalyticsObject = 'ga';

// Create primary Tracker
track('create', ANALYTICS_TRACKING_ID, 'auto');

// Uncomment to enable Remarketing, Demographics and Interest Reporting
// track('require', 'displayfeatures');

// Updates the tracker to use `navigator.sendBeacon` if available.
track('set', 'transport', 'beacon');

// Do not track view here because we'll do it in the router (see ~/container/PageView.jsx)
// track('send', 'pageview');
