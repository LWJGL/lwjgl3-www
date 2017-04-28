import React from 'react';
import { connect } from 'react-redux';
import { actions as $$ } from './reducer';
import ControlledPanel from '../../../components/ControlledPanel';
import Browser from './components/Browser';

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

export default connect(null, { browserOpen: $$.browserOpen })(FileBrowser);
