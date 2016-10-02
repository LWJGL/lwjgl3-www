import createReducer from './createReducer'

function ejectReducer(store, name) {
  delete store.asyncReducers[name];
  store.replaceReducer(createReducer(store.asyncReducers));
}

export default ejectReducer
