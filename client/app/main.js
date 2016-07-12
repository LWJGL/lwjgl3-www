import React from 'react'
import { render } from 'react-dom'
import { match, Router, browserHistory, applyRouterMiddleware } from 'react-router/es6'
import useScroll from 'react-router-scroll';
import routes from './routes/Routes'
import nprogress from 'nprogress'

const AppContainer = 'lwjgl-app';
const { pathname, search, hash } = window.location;
const location = `${pathname}${search}${hash}`;

nprogress.configure({
  showSpinner: false
});

if ( process.browser ) {
  require('./components/CSSPreloadPolyfill');

  if ( process.env.NODE_ENV === 'production' ) {
    window.GoogleAnalyticsObject = 'ga';
    window.ga = function() {
      ga.q.push(arguments)
    };
    ga.q = [];
    ga.l = 1 * new Date();
    ga('create', 'UA-83518-1', {cookieDomain: location.host});
    ga('require', 'displayfeatures');
    ga('send', 'pageview');

    const script = document.createElement('script');
    script.async = true;
    script.src ='https://www.google-analytics.com/analytics.js';

    (document.head||document.body).appendChild(script);
  }
}

// calling `match` is simply for side effects of
// loading route/component code for the initial location
match({routes, location}, () => {
  render((
    <Router
      history={browserHistory}
      routes={routes}
      render={applyRouterMiddleware(useScroll())}
    />
  ), document.getElementById(AppContainer));
});
