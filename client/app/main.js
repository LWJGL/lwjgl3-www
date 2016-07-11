import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory, applyRouterMiddleware } from 'react-router'
import useScroll from 'react-router-scroll';
import Routes from './routes/Routes'

const AppContainer = 'lwjgl-app';

if ( typeof window !== 'undefined' ) {
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

render((
  <Router
    history={browserHistory}
    routes={Routes}
    render={applyRouterMiddleware(useScroll())}
  />
), document.getElementById(AppContainer));
