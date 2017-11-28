// @flow
import { createStore, compose, applyMiddleware } from 'redux';
import { createReducer } from './createReducer';
import reduxThunk from 'redux-thunk';
import { breakpointMiddleware } from './middleware/breakpoint';

import type { Store } from 'redux';

const middleware = [reduxThunk, breakpointMiddleware];
const composed = [];

if (process.env.NODE_ENV !== 'production') {
  if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ !== undefined) {
    // https://github.com/zalmoxisus/redux-devtools-extension
    composed.push(window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__());
  }
}

export const store = createStore(createReducer(), compose(applyMiddleware(...middleware), ...composed));

if (process.env.NODE_ENV !== 'production') {
  // Enable Webpack hot module replacement for global reducers
  if (module.hot) {
    module.hot.accept('./createReducer', () => {
      store.replaceReducer(createReducer());
    });
  }
}
