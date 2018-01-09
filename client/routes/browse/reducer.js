// @flow
import type { Dispatch } from 'redux';
import { HTTP_OK } from '~/services/http_status_codes';
import produce from 'immer/es5';

// State

type Folder = {|
  path: string,
  parent: string | null,
  loading: boolean,
  files: Array<string>,
  folders: Array<string>,
|};

type State = {
  contents: {
    [string]: Folder,
  },
  path: string,
};

// Actions

export const BROWSER_LOAD = 'BROWSER/LOAD_PATH';
export const STORE_CONTENTS = 'BROWSER/STORE_CONTENTS';

export type StoreContentsAction = {|
  type: typeof STORE_CONTENTS,
  path: string,
  contents: Folder,
|};

export type BrowserLoadAction = {|
  type: typeof BROWSER_LOAD,
  path: string,
|};

type Action = StoreContentsAction | BrowserLoadAction;

// Action Creators

async function fetchContents(path: string) {
  let requestUrl = '/list';

  if (path !== '/') {
    requestUrl += `?path=${path}`;
  }

  const response = await fetch(requestUrl);
  if (response.status !== HTTP_OK) {
    throw response.statusText;
  }
  return await response.json();
}

export const loadPath = (path: string) => async (dispatch: Dispatch<*>, getState: Function) => {
  dispatch({ type: BROWSER_LOAD, path });

  const browser: State = getState().browser;
  const data = browser.contents[browser.path];

  if (!data.loading) {
    // Already cached!
    return;
  }

  try {
    dispatch(storeContents(data.path, await fetchContents(data.path)));
  } catch (err) {
    // TODO: handle errors
    return;
  }
};

export const storeContents = (path: string, contents: Folder): StoreContentsAction => ({
  type: STORE_CONTENTS,
  path,
  contents,
});

// Reducer

export function fileBrowserReducer(
  state: State = {
    contents: {
      '/': {
        path: '/',
        parent: null,
        loading: false,
        files: [],
        folders: ['release/', 'stable/', 'nightly/'],
      },
    },
    path: '/',
  },
  action: Action
): State {
  return produce(state, (draft: State) => {
    switch (action.type) {
      case STORE_CONTENTS:
        const folder = draft.contents[action.path];
        folder.loading = false;
        folder.files = action.contents.files || [];
        folder.folders = action.contents.folders || [];
        return;

      case BROWSER_LOAD:
        if (state.path !== action.path) {
          draft.path = action.path;

          if (state.contents[action.path] === undefined) {
            // We haven't loaded this folder before, init it
            draft.contents[action.path] = {
              path: action.path,
              parent: state.path,
              loading: true,
              files: [],
              folders: [],
            };
          }
        }
        break;
    }
  });
}
