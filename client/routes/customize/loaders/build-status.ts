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

let cache = new Map<BuildType, Promise<BuildStatus>>();

export function getBuildStatus(name: BuildType): Promise<BuildStatus> {
  if (!cache.has(name)) {
    let url = `https://build.lwjgl.org/${name}`;
    if (name === 'release') {
      url += `/${config.versions[0]}`;
    }
    url += `/bin/build.txt`;
    cache.set(name, fetchStatus(url));
  }
  return cache.get(name)!;
}

async function fetchStatus(url: string): Promise<BuildStatus> {
  let response: Response;

  try {
    response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
      headers: {
        Accept: 'text/plain',
      },
    });
  } catch (err) {
    return {
      error: err.message,
    };
  }

  if (response.status !== StatusCode.OK) {
    return {
      error: await getResponseError(response),
    };
  }

  return {
    lastModified: response.headers.get('Last-Modified') ?? 'N/A',
    version: await response.text(),
  };
}
