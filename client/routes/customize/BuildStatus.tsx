import * as React from 'react';
import { BuildType } from './types';
import { config } from './config';
import { createCache, createResource } from 'react-cache';

interface BuildStatusSuccess {
  lastModified: string;
  version?: string;
}

interface BuildStatusError {
  error: string;
}

type BuildStatus = BuildStatusSuccess | BuildStatusError;

interface Props {
  name: BuildType;
}

const cache = createCache();
const BuildStatusResource = createResource<BuildType, BuildStatus>(loadStatus);

export const BuildStatus = React.memo(({ name }: Props) => {
  const status = BuildStatusResource.read(cache, name);

  return (
    <p className="my-0">
      {'error' in status ? <span className="text-danger">{status.error}</span> : status.version}
      <br />
      {'lastModified' in status ? status.lastModified : <br />}
    </p>
  );
});

async function loadStatus(name: BuildType): Promise<BuildStatus> {
  let url = `/build/${name}`;

  if (name === 'release') {
    url += `/${config.versions[0]}`;
  }

  try {
    return await fetchStatus(url);
  } catch (err) {
    return { error: err.message };
  }
}

async function fetchStatus(url: string) {
  const response = await fetch(url);

  if (response.status !== 200) {
    throw new Error(response.statusText);
  }

  return await response.json();
}
