import { StatusCode, getResponseError } from '~/services/http';

interface FolderData {
  path: string;
  files: Array<string>;
  folders: Array<string>;
}

type FolderDataAPI = Partial<FolderData>;

let cache = new Map<string, Promise<FolderData>>([
  [
    '',
    Promise.resolve({
      path: '',
      files: [],
      folders: ['addons', 'release', 'stable', 'nightly'],
    }),
  ],
]);

export function getFolderData(path: string): Promise<FolderData> {
  if (!cache.has(path)) {
    cache.set(path, fetchPath(path));
  }
  return cache.get(path)!;
}

async function fetchPath(path: string): Promise<FolderData> {
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
