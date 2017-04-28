import { register } from '../../../store/asyncReducers';
import { sagaMiddleware } from '../../../store/saga';
import saga from './saga';

const $ = {
  BROWSER_OPEN: 'BROWSER/OPEN',
  BROWSER_LOAD: 'BROWSER/LOAD_PATH',
  STORE_CONTENTS: 'BROWSER/STORE_CONTENTS',
};

const $$ = {
  browserOpen: () => ({ type: $.BROWSER_OPEN }),
  loadPath: path => ({ type: $.BROWSER_LOAD, path }),
  storeContents: (path, contents) => ({ type: $.STORE_CONTENTS, path, contents }),
};

const defaultState = {
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
};

export { $ as types };
export { $$ as actions };

export default function fileBrowserReducer(state = defaultState, action) {
  switch (action.type) {
    case $.BROWSER_OPEN:
      return { ...state, open: true };

    case $.STORE_CONTENTS:
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

    case $.BROWSER_LOAD:
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

register('browser', fileBrowserReducer);
sagaMiddleware.run(saga);
