// @flow
import * as React from 'react';
//$FlowFixMe
import { memo, useEffect } from 'react';
import { CircularProgress } from '~/components/CircularProgress';
import type { BUILD_TYPES, BuildStatus as BuildStatusType } from '../types';

type Props = {|
  name: BUILD_TYPES,
  status: BuildStatusType | null,
  loadStatus: (name: string) => void,
|};

export const BuildStatus = memo(({ name, status, loadStatus }) => {
  useEffect(() => {
    if (status === null) {
      loadStatus(name);
    }
  }, []);

  return (
    <p className="my-0">
      {status === null ? (
        <>
          <CircularProgress size={24} thickness={8} style={{ color: 'hsla(0, 0%, 0%, 0.5)' }} />
          <br />
          <br />
        </>
      ) : (
        <>
          {status.error !== undefined ? <span className="text-danger">{status.error}</span> : status.version}
          <br />
          {status.lastModified !== undefined ? status.lastModified : <br />}
        </>
      )}
    </p>
  );
});
