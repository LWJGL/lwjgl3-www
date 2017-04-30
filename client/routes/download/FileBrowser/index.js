import React from 'react';
import { connect } from 'react-redux';
import ControlledPanel from '../../../components/ControlledPanel';
import Browser from './components/Browser';
import { actions as $$ } from './reducer';
import { register } from '../../../store/asyncReducers';
import reduxSaga from '../../../store/saga';
import reducer from './reducer';
import saga from './saga';

function isClosed({ browser: { open } }) {
  return open === false;
}

function isBrowsing({ browser: { open } }) {
  return open;
}

class FileBrowser extends React.Component {
  browse = () => {
    this.props.browserOpen();
  };

  render() {
    return (
      <div>
        <ControlledPanel predicate={isClosed}>
          <button className="btn btn-outline-primary" onClick={this.browse}>Click to browse…</button>
        </ControlledPanel>
        <ControlledPanel predicate={isBrowsing}>
          <Browser />
        </ControlledPanel>
      </div>
    );
  }
}

register('browser', reducer);
reduxSaga.run(saga);

export default connect(null, { browserOpen: $$.browserOpen })(FileBrowser);
