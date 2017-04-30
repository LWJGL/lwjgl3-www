import { takeEvery, call, put } from 'redux-saga/effects';

export type TcStatus = 'loading' | 'passing' | 'failing' | 'unknown';

export type TcStatusObject = {
  status: TcStatus,
  build?: string,
};

type State = {
  [_: string]: TcStatusObject,
};

type Action = {
  type: string,
  name: string,
  state?: TcStatusObject,
};

// Actions
const LOAD_STATUS = 'TEAMCITY_STATUS/LOAD';
const STORE_STATUS = 'TEAMCITY_STATUS/STORE';

// Action Creators
export const loadStatus = (name: string): Action => ({ type: LOAD_STATUS, name });
export const storeStatus = (name: string, status: TcStatus, build?: string): Action => ({
  type: STORE_STATUS,
  name,
  state: { status, build },
});

// Reducer
export default function(state: State = {}, action: Action) {
  switch (action.type) {
    case STORE_STATUS:
      return { ...state, [action.name]: action.state };
  }

  return state;
}

// Saga
async function fetchStatus(url: string) {
  const response = await fetch(url);

  if (response.status !== 200) {
    throw new Error(response.statusText);
  }

  const result = await response.json();

  if (result.error) {
    throw new Error(result.error);
  }

  return {
    status: result.count === 1 && result.build[0].status === 'SUCCESS' ? 'passing' : 'failing',
    build: result.build[0].number,
  };
}

function* getStatus(action: Action) {
  const { name } = action;

  try {
    const response: TcStatusObject = yield call(fetchStatus, `/teamcity?build=${name}`);
    yield put(storeStatus(name, response.status, response.build));
  } catch (e) {
    yield put(storeStatus(name, 'unknown'));
    return;
  }
}

export function* saga(): Generator<any, any, any> {
  yield takeEvery(LOAD_STATUS, getStatus);
}
