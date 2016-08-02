import React from 'react'
import { render } from 'react-dom'
import { match, Router, browserHistory, applyRouterMiddleware } from 'react-router'
import useScroll from 'react-router-scroll';
import routes from './routes/Routes'
import {StyleSheet} from 'aphrodite/no-important'
import nprogress from 'nprogress'
import './utils/ga'

// Hide spinner from nprogress
nprogress.configure({
  showSpinner: false
});

// Re-hydrate Aphrodite from server-generated class names
if ( process.browser ) {
  let rehydrateFrom = document.getElementById('aphro-hydrate');
  if ( rehydrateFrom ) {
    StyleSheet.rehydrate(JSON.parse(rehydrateFrom.innerHTML));
  }
}

const {pathname, search, hash} = window.location;
const location = `${pathname}${search}${hash}`;

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
