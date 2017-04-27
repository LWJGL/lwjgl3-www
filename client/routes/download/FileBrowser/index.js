import React from 'react';
import { connect } from 'react-redux';
import reducer, { actions as $$ } from './reducer';
import saga from './saga';
import ControlledPanel from '../../../components/ControlledPanel';
import Browser from './components/Browser';
import subscribe from '../../../store/subscribe';

const SCOPE = 'browser';

function isClosed(state) {
  return state[SCOPE].open === false;
}

function isBrowsing(state) {
  return state[SCOPE].open;
}

class FileBrowser extends React.Component {
  static reducers = {
    [SCOPE]: reducer,
  };

  static sagas = [saga];

  browse = () => {
    this.props.browserOpen();
  };

  render() {
    return [
      <ControlledPanel key="panel1" predicate={isClosed}>
        <button className="btn btn-outline-primary" onClick={this.browse}>Click to browse…</button>
      </ControlledPanel>,
      <ControlledPanel key="panel2" predicate={isBrowsing}>
        <Browser />
      </ControlledPanel>,
    ];
  }
}

export default connect(null, { browserOpen: $$.browserOpen })(subscribe(FileBrowser));
