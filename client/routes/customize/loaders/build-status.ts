import { unstable_getCacheForType as getCacheForType } from 'react';
import { ResourceCache } from '~/services/Resource';
import { StatusCode, getResponseError } from '~/services/http';
import { config } from '../config';
import type { BuildType } from '../types';

interface BuildStatusSuccess {
  lastModified: string;
  version: string;
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

async function fetchStatus(url: string): Promise<BuildStatusSuccess> {
  const response = await fetch(url, {
    method: 'GET',
    mode: 'same-origin',
    credentials: 'omit',
    headers: {
      Accept: 'text/plain',
    },
  });

  if (response.status !== StatusCode.OK) {
    throw new Error(await getResponseError(response));
  }

  return {
    lastModified: response.headers.get('Last-Modified') ?? 'N/A',
    version: await response.text(),
  };
}

function createBuildStatusCache() {
  return new ResourceCache<BuildType, BuildStatus>(loadStatus);
}

export function readStatus(build: BuildType) {
  return getCacheForType(createBuildStatusCache).read(build);
}
