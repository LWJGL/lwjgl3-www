// @flow
import * as React from 'react';
import { CircularProgress } from '~/components/CircularProgress';
import type { BUILD_TYPES, BuildStatus as BuildStatusType } from '../types';

type Props = {|
  name: BUILD_TYPES,
  status: BuildStatusType | null,
  loadStatus: (name: string) => void,
|};

export class BuildStatus extends React.PureComponent<Props> {
  componentDidMount() {
    const { name, status, loadStatus } = this.props;
    if (status === null) {
      loadStatus(name);
    }
  }

  render() {
    const { name, status } = this.props;

    return status === null ? (
      <p className="my-0">
        <CircularProgress size={24} thickness={8} style={{ color: 'hsla(0, 0%, 0%, 0.5)' }} />
        <br />
        <br />
      </p>
    ) : (
      <p className="my-0">
        {status.error !== undefined ? <span className="text-danger">{status.error}</span> : status.version}
        <br />
        {status.lastModified !== undefined ? status.lastModified : <br />}
      </p>
    );
  }
}
