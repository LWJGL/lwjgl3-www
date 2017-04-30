import { takeEvery, call, put, select } from 'redux-saga/effects';

type StatusSuccess = {|
  lastModified: string,
  version?: string,
|};

type StatusError = {| error: string |};

export type Status = StatusSuccess | StatusError;

export type Action = {
  type: string,
  name: string,
  status?: Status,
};

type State = {
  [_: string]: Status,
};

// Actions
const LOAD_STATUS = 'BUILD_STATUS/LOAD';
const STORE_STATUS = 'BUILD_STATUS/STORE';

// Action Creators
export const loadStatus = (name: string): Action => ({ type: LOAD_STATUS, name });
export const storeStatus = (name: string, status: Status): Action => {
  if (status.error === undefined && status.version !== undefined) {
    status.version = status.version.replace(/^LWJGL\s+/, '');
  }
  return { type: STORE_STATUS, name, status };
};

// Reducer
export default function BuildStatusReducer(state: State = {}, action: Action) {
  switch (action.type) {
    case STORE_STATUS:
      return { ...state, [action.name]: action.status };
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
