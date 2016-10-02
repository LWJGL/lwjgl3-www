import { createStore, compose, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createResponsiveStoreEnhancer } from 'redux-responsive'
import createReducer from './createReducer'
import saga from './saga'

function configureStore() {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    createReducer(),
    compose(
      applyMiddleware(sagaMiddleware),
      createResponsiveStoreEnhancer({calculateStateInitially: false, performanceMode: true}),
    )
  );

  store.asyncReducers = {};
  sagaMiddleware.run(saga);

  return store;
}

export default configureStore
