import { unstable_getCacheForType as getCacheForType } from 'react';
import { ResourceCache } from '~/services/Resource';
import { StatusCode, getResponseError } from '~/services/http';

interface FolderData {
  path: string;
  files: Array<string>;
  folders: Array<string>;
}

interface FolderData {
  path: string;
  files: Array<string>;
  folders: Array<string>;
}

type FolderDataAPI = Partial<FolderData>;

async function fetchPath(path: string): Promise<FolderData> {
  if (path === '') {
    return {
      path: '',
      files: [],
      folders: ['addons', 'release', 'stable', 'nightly'],
    };
  }

  const response = await fetch(`/list?path=${path}/`, {
    method: 'GET',
    mode: 'same-origin',
    credentials: 'omit',
    headers: {
      Accept: 'application/json',
    },
  });
  if (response.status !== StatusCode.OK) {
    throw new Error(await getResponseError(response));
  }

  let contents: FolderDataAPI = await response.json();
  contents.path = path;
  if (contents.files === undefined) {
    contents.files = [];
  }
  contents.folders =
    contents.folders === undefined ? [] : contents.folders.map((name) => name.substring(0, name.length - 1));

  return contents as FolderData;
}

function createPathCache() {
  return new ResourceCache<string, FolderData>(fetchPath, 1);
}

export function readPath(path: string): FolderData {
  return getCacheForType(createPathCache).read(path);
}
