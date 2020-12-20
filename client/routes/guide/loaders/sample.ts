import { unstable_getCacheForType as getCacheForType } from 'react';
import { ResourceCache } from '~/services/Resource';
import { StatusCode } from '~/services/http';

async function fetchSample() {
  const response = await fetch('/sample.html');
  if (response.status !== StatusCode.OK) {
    throw response.statusText;
  }

  return await response.text();
}

function createSampleCache() {
  return new ResourceCache<void, string>(fetchSample);
}

export function readSample() {
  return getCacheForType(createSampleCache).read();
}
