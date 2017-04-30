import loadJS from 'fg-loadjs';

// Use this to load GA on demand
let firstCall = true;

let track = function() {
  if (process.env.NODE_ENV === 'production' && firstCall) {
    if (document.location.hostname === 'www.lwjgl.org') {
      loadJS('https://www.google-analytics.com/analytics.js');
    }
    firstCall = false;
  }

  track.q.push(arguments);
};

track.q = [];
track.l = 1 * new Date();

window.ga = track;
window.GoogleAnalyticsObject = 'ga';

// Create primary Tracker
track('create', 'UA-83518-1', 'auto');

// Uncomment to enable Remarketing, Demographics and Interest Reporting
// track('require', 'displayfeatures');

// Updates the tracker to use `navigator.sendBeacon` if available.
track('set', 'transport', 'beacon');

// Do not track view here because we'll do it in the router (see ../routes/asyncRoute.js)
// track('send', 'pageview');
