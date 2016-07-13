import React from 'react'
import { render } from 'react-dom'
import { match, Router, browserHistory, applyRouterMiddleware } from 'react-router/es6'
import useScroll from 'react-router-scroll';
import routes from './routes/Routes'
import nprogress from 'nprogress'
import './utils/ga'

// Hide spinner from nprogress
nprogress.configure({
  showSpinner: false
});

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