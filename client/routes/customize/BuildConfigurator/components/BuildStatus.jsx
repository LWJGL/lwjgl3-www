// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import LoaderSpinner from '~/components/LoaderSpinner';
import { loadStatus, typeof loadStatus as LoadStatusType } from '../reducer';
import type { BuildStatus as BuildStatusType, BUILD_TYPES } from '../types';

type OwnProps = {
  name: BUILD_TYPES,
};

type ConnectProps = {
  loadStatus: LoadStatusType,
  status: BuildStatusType,
};

type Props = OwnProps & ConnectProps;

class BuildStatus extends React.Component<Props, void> {
  componentDidMount() {
    const { name, loadStatus, status } = this.props;

    if (status === null) {
      loadStatus(name);
    }
  }

  render() {
    const status = this.props.status;
    const loading = status === null;
    const lastModified = !loading && status.lastModified ? status.lastModified : <br />;

    return (
      <p className="my-0">
        {loading ? <LoaderSpinner size={16} /> : status.error !== undefined ? status.error : status.version}
        <br />
        {lastModified}
      </p>
    );
  }
}

export default connect((state: any, props: OwnProps) => ({ status: state.build.builds.byId[props.name].status }), {
  loadStatus,
})(BuildStatus);
