import { createStore } from 'redux'
import createReducer from './createReducer'

function configureStore() {
  const store = createStore(
    createReducer()
  );
  store.asyncReducers = {};
  return store;
}

export default configureStore
