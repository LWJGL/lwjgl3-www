import { StatusCode, getResponseError } from '~/services/http';

let cache: Promise<string>;

export function getSample(): Promise<string> {
  if (cache === undefined) {
    cache = fetchSample();
  }
  return cache;
}

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
