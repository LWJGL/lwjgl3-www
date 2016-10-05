import React from 'react'
import createReducer from './createReducer'
import { pageEnter, pageLeave } from './reducers/redirect'

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

const asyncStore = ({scope, reducer, saga, module}) => ReduxComponent => class ReducerManager extends React.Component {

  static contextTypes = {
    store: React.PropTypes.object
  };

  sagaTask = null;

  componentWillMount() {
    // this.context.store.dispatch(pageEnter());
    if ( reducer ) {
      injectReducer(this.context.store, scope, reducer);

      if ( process.env.NODE_ENV !== 'production' ) {
        if ( !ReducerManager._init ) {
          ReducerManager._init = true;

          if ( module.hot ) {
            module.hot.accept(`${module}/reducer`, () => {
              injectReducer(this.context.store, scope, reducer);
            })
          }
        }
      }
    }
    if ( saga ) {
      this.sagaTask = this.context.store.runSaga(saga);
    }
  }

  componentWillUnmount() {
    this.context.store.dispatch(pageLeave());
    if ( reducer ) {
      ejectReducer(this.context.store, scope);
    }
    if ( this.sagaTask !== null ) {
      this.sagaTask.cancel();
    }
  }

  render() {
    return (
      <ReduxComponent {...this.props} />
    )
  }

};

export default asyncStore
