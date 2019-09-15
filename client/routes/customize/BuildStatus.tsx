import React from 'react';
import { BuildType } from './types';
import { BuildStatusResource } from './BuildStatusResource';

interface Props {
  name: BuildType;
}

export const BuildStatus = ({ name }: Props) => {
  const status = BuildStatusResource.read(name);

  return (
    <p className="my-0">
      {'error' in status ? <span className="text-danger">{status.error}</span> : status.version}
      <br />
      {'lastModified' in status ? status.lastModified : <br />}
    </p>
  );
};
