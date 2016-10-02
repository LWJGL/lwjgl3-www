import { createStore, compose } from 'redux'
import { createResponsiveStoreEnhancer } from 'redux-responsive'
import createReducer from './createReducer'

function configureStore() {
  const store = createStore(
    createReducer(),
    compose(
      createResponsiveStoreEnhancer({calculateStateInitially: false, performanceMode: true}),
    )
  );
  store.asyncReducers = {};
  return store;
}

export default configureStore
