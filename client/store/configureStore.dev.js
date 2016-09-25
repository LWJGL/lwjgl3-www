import { createStore, compose, applyMiddleware } from 'redux'
import {createResponsiveStoreEnhancer} from 'redux-responsive'
import createLogger from 'redux-logger'
import rootReducer from './rootReducer'

export default function() {
  const store = createStore(
    rootReducer,
    compose(
      createResponsiveStoreEnhancer({calculateStateInitially: false, performanceMode: true}),
      applyMiddleware(createLogger({
        duration: true,
        // diff: true,
        collapsed: true,
      })),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  );

  if ( module.hot ) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./rootReducer', () => {
      const nextRootReducer = require('./rootReducer').default;
      store.replaceReducer(nextRootReducer)
    })
  }

  return store;
}
