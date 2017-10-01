// @flow
import type { Dispatch } from 'redux';
import { HTTP_OK } from '~/services/http_status_codes';

// State

type Folder = {|
  parent: Folder | null,
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

export const loadPath = (path: string) => async (dispatch: Dispatch<*>, getState: () => Object) => {
  dispatch({ type: BROWSER_LOAD, path });

  const browser: State = getState().browser;
  const data = {
    path: browser.path,
    ...browser.contents[browser.path],
  };

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

export default function fileBrowserReducer(
  state: State = {
    contents: {
      '/': {
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
  switch (action.type) {
    case STORE_CONTENTS:
      return {
        ...state,
        contents: {
          ...state.contents,
          [action.path]: {
            ...state.contents[action.path],
            loading: false,
            files: action.contents.files || [],
            folders: action.contents.folders || [],
          },
        },
      };

    case BROWSER_LOAD:
      if (state.path !== action.path) {
        if (state.contents[action.path]) {
          // Go back to a path we have already loaded
          return { ...state, path: action.path };
        } else {
          // Load a new path
          return {
            ...state,
            path: action.path,
            contents: {
              ...state.contents,
              [action.path]: {
                parent: state.path,
                loading: true,
                files: [],
                folders: [],
              },
            },
          };
        }
      }
      break;
  }

  return state;
}
