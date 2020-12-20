import { unstable_getCacheForType as getCacheForType } from 'react';
import { ResourceCache } from '~/services/Resource';
import { StatusCode } from '~/services/http';
import { config } from '../config';
import type { BuildType } from '../types';

interface BuildStatusSuccess {
  lastModified: string;
  version?: string;
}

interface BuildStatusError {
  error: string;
}

type BuildStatus = BuildStatusSuccess | BuildStatusError;

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

  if (response.status !== StatusCode.OK) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

function createBuildStatusCache() {
  return new ResourceCache<BuildType, BuildStatus>(loadStatus);
}

export function readStatus(build: BuildType) {
  return getCacheForType(createBuildStatusCache).read(build);
}
