import React from 'react';
import { connect } from 'react-redux';
import reduxSaga from '../../store/saga';
import LoaderSpinner from '../LoaderSpinner';
import { loadStatus, saga } from './reducer';
import typeof { loadStatus as LoadStatus } from './reducer';
import type { Task } from 'redux-saga';

type OwnProps = {
  name: string,
};

type ConnectProps = {
  loadStatus: LoadStatus,
  lastModified?: string,
  version?: string,
  error?: string,
};

type Props = OwnProps & ConnectProps;

let instances = 0;
let sagaTask: Task | null = null;

class BuildStatus extends React.Component<void, Props, void> {
  componentDidMount() {
    const { name, loadStatus, version, error } = this.props;

    if (instances === 0) {
      sagaTask = reduxSaga.run(saga);
    }
    instances += 1;

    if (version === undefined && error === undefined) {
      loadStatus(name);
    }
  }

  componentWillUnmount() {
    instances -= 1;
    if (instances === 0 && sagaTask !== null) {
      sagaTask.cancel();
    }
  }

  render() {
    const { version, lastModified, error } = this.props;
    const loading = version === undefined && error === undefined;

    return (
      <p className="my-0">
        {loading ? <LoaderSpinner size={16} /> : error !== undefined ? error : version}
        <br />
        {lastModified !== undefined ? lastModified : <br />}
      </p>
    );
  }
}

export default connect(
  (state: any, props: OwnProps) => {
    return state.buildStatus[props.name] !== undefined ? { ...state.buildStatus[props.name] } : {};
  },
  { loadStatus }
)(BuildStatus);
