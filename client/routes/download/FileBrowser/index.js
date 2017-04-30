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

let sagaTask;

class FileBrowser extends React.Component {
  componentDidMount() {
    sagaTask = reduxSaga.run(saga);
  }
  componentWillUnmount() {
    sagaTask.cancel();
  }
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

export default connect(null, { browserOpen: $$.browserOpen })(FileBrowser);
