import createReducer from './createReducer'

function ejectReducer(store, name) {
  // store.dispatch({
  //   type: 'SYSTEM/EJECT_REDUCER',
  //   name: name
  // });
  delete store.asyncReducers[name];
  store.replaceReducer(createReducer(store.asyncReducers));
}

export default ejectReducer
