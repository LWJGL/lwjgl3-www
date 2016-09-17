if ( process.browser && process.env.NODE_ENV === 'production' ) {
  const track = function() {
    track.q.push(arguments);
  };

  track.q = [];
  track.l = 1 * new Date();

  window.ga = track;
  window.GoogleAnalyticsObject = 'ga';

  track('create', 'UA-83518-1', 'auto');
  track('require', 'displayfeatures');
  // Do not track view here because it will happen in the router
  // track('send', 'pageview');

  const script = document.createElement('script');
  script.async = true;
  script.src ='https://www.google-analytics.com/analytics.js';

  setTimeout(function(){
    // delay execution so that route JS is scheduled for download first
    (document.head||document.body).appendChild(script);
  }, 1);
}