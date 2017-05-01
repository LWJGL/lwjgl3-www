import { takeEvery, call, put } from 'redux-saga/effects';

// Actions
type LOAD_STATUS_TYPE = 'TEAMCITY_STATUS/LOAD';
type STORE_STATUS_TYPE = 'TEAMCITY_STATUS/STORE';
const LOAD_STATUS: LOAD_STATUS_TYPE = 'TEAMCITY_STATUS/LOAD';
const STORE_STATUS: STORE_STATUS_TYPE = 'TEAMCITY_STATUS/STORE';

// Action Creators
type ActionLoad = {
  type: LOAD_STATUS_TYPE,
  name: string,
};
export const loadStatus = (name: string): ActionLoad => ({ type: LOAD_STATUS, name });

export type TC_STATUS = 'loading' | 'passing' | 'failing' | 'unknown';
export type TcStatus = {
  status: TC_STATUS,
  build?: string,
};
type ActionStore = {
  type: STORE_STATUS_TYPE,
  name: string,
  payload: TcStatus,
};
export const storeStatus = (name: string, status: TC_STATUS, build?: string): ActionStore => ({
  type: STORE_STATUS,
  name,
  payload: { status, build },
});

type Action = ActionLoad | ActionStore;

// Reducer
type State = {
  [_: string]: TcStatus,
};

export default function(state: State = {}, action: Action) {
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
    const response: TcStatus = yield call(fetchStatus, `/teamcity?build=${name}`);
    yield put(storeStatus(name, response.status, response.build));
  } catch (e) {
    yield put(storeStatus(name, 'unknown'));
    return;
  }
}

export function* saga(): Generator<any, any, any> {
  yield takeEvery(LOAD_STATUS, getStatus);
}
