import React from 'react';
import { connect } from 'react-redux';
import reduxSaga from '../../store/saga';
import LoaderSpinner from '../LoaderSpinner';
import { loadStatus, saga } from './reducer';
import typeof { loadStatus as LoadStatus } from './reducer';

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

class BuildStatus extends React.Component<void, Props, void> {
  componentDidMount() {
    const { name, loadStatus, version, error } = this.props;

    if (version === undefined && error === undefined) {
      loadStatus(name);
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

reduxSaga.run(saga);

export default connect(
  (state: any, props: OwnProps) => {
    return state.buildStatus[props.name] !== undefined ? { ...state.buildStatus[props.name] } : {};
  },
  { loadStatus }
)(BuildStatus);
