import { createStore, compose, applyMiddleware } from 'redux';
import createReducer from './createReducer';
import breakpointMiddeware from './middleware/breakpoint';
import sagaMiddleware from './saga';
import type { Store } from 'redux';

declare var module: {
  hot: {
    accept(path: string, callback: () => void): void,
  },
};

const middleware = [sagaMiddleware, breakpointMiddeware];
const composed = [];

if (process.env.NODE_ENV !== 'production') {
  /*
  middleware.push(
    // https://github.com/evgenyrodionov/redux-logger
    require('redux-logger').createLogger({
      duration: true,
      // diff: true,
      collapsed: true,
    })
  );
  */

  if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    // https://github.com/zalmoxisus/redux-devtools-extension
    composed.push(window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__());
  }
}

const store = createStore(createReducer(), compose(applyMiddleware(...middleware), ...composed));

if (process.env.NODE_ENV !== 'production') {
  // Enable Webpack hot module replacement for reducers
  if (module.hot) {
    module.hot.accept('./createReducer', () => {
      store.replaceReducer(createReducer());
    });
  }
}

export default store;