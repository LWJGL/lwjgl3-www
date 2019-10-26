import { ResourceCached } from '~/services/Resource';
import { HTTP_OK } from '~/services/http_status_codes';

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

async function fetchContents(path: string): Promise<FolderData> {
  if (path === '') {
    return {
      path: '',
      files: [],
      folders: ['addons', 'release', 'stable', 'nightly'],
    };
  }

  const response = await fetch(`/list?path=${path}/`);
  if (response.status !== HTTP_OK) {
    throw response.statusText;
  }

  let contents: FolderDataAPI = await response.json();
  contents.path = path;
  if (contents.files === undefined) {
    contents.files = [];
  }
  contents.folders =
    contents.folders === undefined ? [] : contents.folders.map(name => name.substring(0, name.length - 1));

  return contents as FolderData;
}

export const PathResource = new ResourceCached<string, FolderData>(fetchContents);
