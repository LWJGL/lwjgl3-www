// @flow
import { createStore, compose, applyMiddleware } from 'redux';
import { createReducer } from './createReducer';
import reduxThunk from 'redux-thunk';
import type { Store } from 'redux';

const middleware = [reduxThunk];

if (!FLAG_PRODUCTION && FLAG_REDUXLOGGER) {
  //$FlowFixMe
  middleware.push(require('redux-logger').logger);
}

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
//$FlowFixMe
export const store: Store<any, any, any> = createStore(createReducer(), compose(applyMiddleware(...middleware)));

if (!FLAG_PRODUCTION) {
  // Enable Webpack hot module replacement for global reducers
  if (module.hot) {
    module.hot.accept('./createReducer', () => {
      store.replaceReducer(createReducer());
    });
  }
}
