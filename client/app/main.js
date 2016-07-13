import React from 'react'
import { render } from 'react-dom'
import { match, Router, browserHistory, applyRouterMiddleware } from 'react-router/es6'
import useScroll from 'react-router-scroll';
import routes from './routes/Routes'
import nprogress from 'nprogress'
import './utils/ga'

const AppContainer = 'lwjgl-app';
const { pathname, search, hash } = window.location;
const location = `${pathname}${search}${hash}`;

nprogress.configure({
  showSpinner: false
});

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
