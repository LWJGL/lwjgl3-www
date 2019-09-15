import { BuildType } from './types';
// import { unstable_createResource as createResource } from 'react-cache';
import { createResource } from '~/services/react-cache/ReactCache';
import { config } from './config';

interface BuildStatusSuccess {
  lastModified: string;
  version?: string;
}

interface BuildStatusError {
  error: string;
}

type BuildStatus = BuildStatusSuccess | BuildStatusError;

export const BuildStatusResource = createResource<BuildType, BuildStatus>(loadStatus);

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
  const response = await fetch(url, {
    method: 'GET',
    mode: 'same-origin',
    credentials: 'omit',
    headers: {
      Accept: 'application/json',
    },
  });

  if (response.status !== 200) {
    throw new Error(response.statusText);
  }

  return await response.json();
}
