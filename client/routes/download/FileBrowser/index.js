import React from 'react'
import reducer, { actions as $$ } from './reducer'
import saga from './saga'
import ControlledPanel from '../../../components/ControlledPanel'
import Browser from './components/Browser'

const SCOPE = 'browser';

function isClosed(state) {
  return state[SCOPE].open === false;
}

function isBrowsing(state) {
  return state[SCOPE].open;
}

class FileBrowser extends React.Component {

  //noinspection JSUnusedGlobalSymbols
  static contextTypes = {
    store: React.PropTypes.object
  };

  saga = null;

  componentWillMount() {
    const store = this.context.store;
    store.injectReducer(SCOPE, reducer);

    if ( process.env.NODE_ENV !== 'production' && module.hot ) {
      module.hot.accept('./reducer', () => {
        if ( store.asyncReducers[SCOPE] ) {
          store.injectReducer(SCOPE, reducer);
        }
      })
    }

    this.saga = store.runSaga(saga);
  }

  componentWillUnmount() {
    const store = this.context.store;
    if ( this.saga.isRunning() ) {
      this.saga.cancel();
    }
    store.ejectReducer(this.scope);
  }

  browse = () => {
    this.context.store.dispatch($$.browserOpen());
  };

  render() {

    return (
      <div>
        <ControlledPanel predicate={isClosed}>
          <button className="btn btn-outline-primary" onClick={this.browse}>Click to browse...</button>
        </ControlledPanel>
        <ControlledPanel predicate={isBrowsing}>
          <Browser />
        </ControlledPanel>
      </div>
    )
  }

}

export default FileBrowser
