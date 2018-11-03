import * as React from 'react';
import { memo, useEffect } from 'react';
import { CircularProgress } from '~/components/CircularProgress';
import { BUILD_TYPES, BuildStatus as BuildStatusType } from '../types';

interface Props {
  name: BUILD_TYPES;
  status: BuildStatusType | null;
  loadStatus: (name: string) => void;
}

export const BuildStatus = memo(({ name, status, loadStatus }: Props) => {
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
          {'error' in status ? <span className="text-danger">{status.error}</span> : status.version}
          <br />
          {'lastModified' in status ? status.lastModified : <br />}
        </>
      )}
    </p>
  );
});
