import { createStore, compose, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createResponsiveStoreEnhancer } from 'redux-responsive'
import createLogger from 'redux-logger'
import createReducer from './createReducer'
import saga from './saga'

function configureStore() {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    createReducer(),
    compose(
      applyMiddleware(sagaMiddleware),
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
  sagaMiddleware.run(saga);

  if ( module.hot ) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./createReducer', () => {
      store.replaceReducer(createReducer())
    });
    // Enable Webpack hot module replacement for sagas
    module.hot.accept('./saga', () => {
      sagaMiddleware.run(saga);
    });
  }

  return store;
}

export default configureStore
