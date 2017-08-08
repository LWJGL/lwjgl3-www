import React from 'react';
import { connect } from 'react-redux';
import ControlledPanel from '~/components/ControlledPanel';
import Browser from './components/Browser';
import { browserOpen } from './reducer';
import { register } from '~/store/asyncReducers';
import reduxSaga from '~/store/saga';
import reducer from './reducer';
import saga from './saga';
import type { Task } from 'redux-saga';
import type { BrowserOpenAction } from './reducer';

type Props = {
  browserOpen: () => BrowserOpenAction,
};

type BrowserState = { browser: { open: boolean } };

function isClosed({ browser: { open } }: BrowserState): boolean {
  return open === false;
}

function isBrowsing({ browser: { open } }: BrowserState): boolean {
  return open;
}

let sagaTask: Task;

class FileBrowser extends React.Component<void, Props, void> {
  componentDidMount() {
    sagaTask = reduxSaga.run(saga);
  }
  componentWillUnmount() {
    sagaTask.cancel();
  }
  browse: () => void = () => {
    this.props.browserOpen();
  };

  render() {
    return [
      <ControlledPanel key="p1" predicate={isClosed}>
        <button className="btn btn-outline-primary" onClick={this.browse}>
          Click to browse…
        </button>
      </ControlledPanel>,
      <ControlledPanel key="p2" predicate={isBrowsing}>
        <Browser />
      </ControlledPanel>,
    ];
  }
}

register('browser', reducer);

export default connect(null, { browserOpen })(FileBrowser);
