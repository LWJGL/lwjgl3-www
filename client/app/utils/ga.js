const track = function() {
  track.q.push(arguments);
};

track.q = [];
track.l = 1 * new Date();

if ( process.browser && process.env.NODE_ENV === 'production' ) {
  window.ga = track;
  window.GoogleAnalyticsObject = 'ga';

  track('create', 'UA-83518-1', {cookieDomain: location.host});
  track('require', 'displayfeatures');
  // Do not track view here because it will happen in the router
  // track('send', 'pageview');

  const script = document.createElement('script');
  script.async = true;
  script.src ='https://www.google-analytics.com/analytics.js';

  (document.head||document.body).appendChild(script);
}

export default (...args) => {
  window.ga.apply(null, args);
};