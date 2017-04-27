import { createStore, compose, applyMiddleware } from 'redux';
import createReducer from './createReducer';
import breakpointMiddeware from './middleware/breakpoint';
import { sagaMiddleware, saga } from './saga';
import type { Store } from 'redux';

declare var module: {
  hot: {
    accept(path: string, callback: () => void): void,
  },
};

function configureStore() {
  const middleware = [sagaMiddleware, breakpointMiddeware];
  const composed = [];

  if (process.env.NODE_ENV !== 'production') {
    /*middleware.push(
      // https://github.com/evgenyrodionov/redux-logger
      require('redux-logger').createLogger({
        duration: true,
        // diff: true,
        collapsed: true,
      })
    );*/

    // https://github.com/zalmoxisus/redux-devtools-extension
    if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
      composed.push(window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__());
    }
  }

  // $FlowFixMe
  const store = createStore(createReducer(), compose(applyMiddleware(...middleware), ...composed));
  sagaMiddleware.run(saga);

  if (process.env.NODE_ENV !== 'production') {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./createReducer', () => {
      store.replaceReducer(createReducer());
    });
  }

  return store;
}

export default configureStore;
