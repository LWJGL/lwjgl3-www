import { takeEvery, call, put, select } from 'redux-saga/effects';

// Actions
type LOAD_STATUS_TYPE = 'BUILD_STATUS/LOAD';
type STORE_STATUS_TYPE = 'BUILD_STATUS/STORE';
const LOAD_STATUS: LOAD_STATUS_TYPE = 'BUILD_STATUS/LOAD';
const STORE_STATUS: STORE_STATUS_TYPE = 'BUILD_STATUS/STORE';

// Action Creators
type ActionLoad = {
  type: LOAD_STATUS_TYPE,
  name: string,
};
export const loadStatus = (name: string): ActionLoad => ({ type: LOAD_STATUS, name });

type StatusSuccess = {|
  lastModified: string,
  version?: string,
|};
type StatusError = {| error: string |};
type Status = StatusSuccess | StatusError;
type ActionStore = {
  type: STORE_STATUS_TYPE,
  name: string,
  payload: Status,
};
export const storeStatus = (name: string, payload: Status): ActionStore => {
  if (payload.error === undefined && payload.version !== undefined) {
    payload.version = payload.version.replace(/^LWJGL\s+/, '');
  }
  return { type: STORE_STATUS, name, payload };
};

type Action = ActionLoad | ActionStore;

// Reducer

type State = {
  [_: string]: Status,
};

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
