//@ts-expect-error
import { unstable_getCacheForType as getCacheForType } from 'react';
import { ResourceCache } from '~/services/Resource';
import { StatusCode, getResponseError } from '~/services/http';

async function fetchSample() {
  const response = await fetch('/sample.html', {
    method: 'GET',
    mode: 'same-origin',
    credentials: 'omit',
    headers: {
      Accept: 'text/html',
    },
  });
  if (response.status !== StatusCode.OK) {
    throw new Error(await getResponseError(response));
  }

  return await response.text();
}

function createSampleCache() {
  return new ResourceCache<void, string>(fetchSample);
}

export function readSample(): string {
  return getCacheForType(createSampleCache).read();
}
