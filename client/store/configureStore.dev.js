import { createStore, compose, applyMiddleware } from 'redux'
import { createResponsiveStoreEnhancer } from 'redux-responsive'
import createLogger from 'redux-logger'

import createReducer from './createReducer'

function configureStore() {
  const store = createStore(
    createReducer(),
    compose(
      createResponsiveStoreEnhancer({calculateStateInitially: false, performanceMode: true}),
      applyMiddleware(createLogger({
        duration: true,
        // diff: true,
        collapsed: true,
        colors: {
          title: () => 'inherit',
          prevState: () => '#9E9E9E',
          action: () => '#03A9F4',
          nextState: () => '#4CAF50',
          error: () => '#F20404',
        }
      })),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  );
  store.asyncReducers = {};

  if ( module.hot ) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./createReducer', () => {
      // const nextRootReducer = require('./createReducer').default;
      store.replaceReducer(createReducer())
    })
  }

  return store;
}

export default configureStore
