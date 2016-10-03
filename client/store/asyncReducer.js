import React from 'react'
import createReducer from './createReducer'

function injectReducer(store, name, asyncReducer) {
  store.asyncReducers[name] = asyncReducer;
  store.replaceReducer(createReducer(store.asyncReducers));
}

function ejectReducer(store, name) {
  // store.dispatch({
  //   type: 'SYSTEM/EJECT_REDUCER',
  //   name: name
  // });
  delete store.asyncReducers[name];
  store.replaceReducer(createReducer(store.asyncReducers));
}

const asyncReducer = (name, reducer, modulePath) => ReduxComponent => class ReducerManager extends React.Component {

  static contextTypes = {
    store: React.PropTypes.object
  };

  componentWillMount() {
    injectReducer(this.context.store, name, reducer);

    if ( process.env.NODE_ENV !== 'production' ) {
      if ( !ReducerManager._init ) {
        ReducerManager._init = true;

        if ( module.hot ) {
          module.hot.accept(modulePath, () => {
            injectReducer(this.context.store, name, reducer);
          })
        }
      }
    }
  }

  componentWillUnmount() {
    ejectReducer(this.context.store, name);
  }

  render() {
    return (
      <ReduxComponent {...this.props} />
    )
  }

};

export default asyncReducer
