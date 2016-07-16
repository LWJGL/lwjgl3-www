import React from 'react'
import { render } from 'react-dom'
import { match, Router, browserHistory, applyRouterMiddleware } from 'react-router/es6'
import useScroll from 'react-router-scroll';
import routes from './routes/Routes'
import {StyleSheet} from 'aphrodite'
import nprogress from 'nprogress'
import './utils/ga'

// Hide spinner from nprogress
nprogress.configure({
  showSpinner: false
});

const {pathname, search, hash} = window.location;
const location = `${pathname}${search}${hash}`;

// Re-hydrate Aphrodite from server-generated class names
if ( process.browser ) {
  let rehydrateFrom = document.getElementById('aphro-hydrate');
  if ( rehydrateFrom ) {
    StyleSheet.rehydrate(JSON.parse(rehydrateFrom.innerHTML));
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
  ), document.getElementById('lwjgl-app'));
});