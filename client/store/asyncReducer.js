import React from 'react'
import injectReducer from './injectReducer'
import ejectReducer from './ejectReducer'

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
