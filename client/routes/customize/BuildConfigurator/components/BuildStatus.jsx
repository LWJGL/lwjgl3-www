// @flow
import * as React from 'react';
import LoaderSpinner from '~/components/LoaderSpinner';
import { loadStatus } from '../reducer';
import type { BUILD_TYPES } from '../types';
import Connect from '~/store/Connect';

type Props = {|
  name: BUILD_TYPES,
|};

const BuildStatus = ({ name }: Props) => (
  <Connect
    state={(state: Object) => ({
      status: state.build.builds.byId[name].status,
    })}
    actions={{
      loadStatus,
    }}
  >
    {({ status }, { loadStatus }) => {
      if (status === null) {
        loadStatus(name);
        return (
          <p className="my-0">
            <LoaderSpinner size={16} />
            <br />
            <br />
          </p>
        );
      }

      return (
        <p className="my-0">
          {status.error ? <span className="text-danger">{status.error}</span> : status.version}
          <br />
          {status.lastModified ? status.lastModified : <br />}
        </p>
      );
    }}
  </Connect>
);

export default BuildStatus;
