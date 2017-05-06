import { takeEvery, call, put, select } from 'redux-saga/effects';

// Data Types

type StatusSuccess = {|
  lastModified: string,
  version?: string,
|};
type StatusError = {| error: string |};
type Status = StatusSuccess | StatusError;

// Reducer Data Types

type BUILD_STATUS_LOAD = 'BUILD_STATUS/LOAD';
type BUILD_STATUS_STORE = 'BUILD_STATUS/STORE';

type ActionLoad = {
  type: BUILD_STATUS_LOAD,
  name: string,
};

type ActionStore = {
  type: BUILD_STATUS_STORE,
  name: string,
  payload: Status,
};

type Action = ActionLoad | ActionStore;

type State = {
  [_: string]: Status,
};

// Actions
const LOAD_STATUS: BUILD_STATUS_LOAD = 'BUILD_STATUS/LOAD';
const STORE_STATUS: BUILD_STATUS_STORE = 'BUILD_STATUS/STORE';

// Action Creators
export const loadStatus = (name: string): ActionLoad => ({ type: LOAD_STATUS, name });

export const storeStatus = (name: string, payload: Status): ActionStore => {
  if (payload.error === undefined && payload.version !== undefined) {
    payload.version = payload.version.replace(/^LWJGL\s+/, '');
  }
  return { type: STORE_STATUS, name, payload };
};

// Reducer
export default function BuildStatusReducer(state: State = {}, action: Action) {
  switch (action.type) {
    case STORE_STATUS:
      return { ...state, [action.name]: action.payload };
  }

  return state;
}

// Saga
async function fetchStatus(url: string) {
  const response = await fetch(url);

  if (response.status !== 200) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

function* getStatus(action: Action) {
  const { name } = action;
  let url = `/build/${name}`;

  if (name === 'release') {
    const version = yield select(({ build }): string => build.versions[0]);
    url += `/${version}`;
  }

  try {
    const response: StatusSuccess = yield call(fetchStatus, url);
    yield put(storeStatus(name, response));
  } catch (err) {
    yield put(storeStatus(name, { error: err.message }));
  }
}

export function* saga(): Generator<any, any, any> {
  yield takeEvery(LOAD_STATUS, getStatus);
}
