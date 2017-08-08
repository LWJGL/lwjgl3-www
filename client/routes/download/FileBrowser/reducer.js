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
  open: boolean,
};

// Actions

export const BROWSER_OPEN = 'BROWSER/OPEN';
export const BROWSER_LOAD = 'BROWSER/LOAD_PATH';
export const STORE_CONTENTS = 'BROWSER/STORE_CONTENTS';

export type BrowserOpenAction = {|
  type: typeof BROWSER_OPEN,
|};

export type StoreContentsAction = {|
  type: typeof STORE_CONTENTS,
  path: string,
  contents: Folder,
|};

export type BrowserLoadAction = {|
  type: typeof BROWSER_LOAD,
  path: string,
|};

type Action = BrowserOpenAction | StoreContentsAction | BrowserLoadAction;

// Action Creators

export const browserOpen = (): BrowserOpenAction => ({ type: BROWSER_OPEN });

export const loadPath = (path: string): BrowserLoadAction => ({ type: BROWSER_LOAD, path });

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
    open: false,
  },
  action: Action
): State {
  switch (action.type) {
    case BROWSER_OPEN:
      return { ...state, open: true };

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
