import { takeEvery, call, put, select } from 'redux-saga/effects';

const LOAD_STATUS = 'BUILD_STATUS/LOAD';
const STORE_STATUS = 'BUILD_STATUS/STORE';

type State = {
  [_: string]: string,
};

type Action = {
  type: string,
  name: string,
  state: any,
};

export const loadStatus = (name: string) => ({ type: LOAD_STATUS, name });
export const storeStatus = (name: string, state: any) => ({ type: STORE_STATUS, name, state });

async function fetchStatus(url: string): {} | { error: string } {
  let response;

  try {
    response = await fetch(url);

    if (response.status !== 200) {
      return { error: response.statusText };
    }

    return await response.json();
  } catch (e) {
    return { error: e.message };
  }
}

function* getStatus(action: Action) {
  const { name } = action;
  let url = `/build/${name}`;
  if (name === 'release') {
    const version = yield select(({ build }): string => build.versions[0]);
    url += `/${version}`;
  }
  const response = yield call(fetchStatus, url);
  yield put(storeStatus(name, response));
}

export function* saga(): Generator<any, void, void> {
  yield takeEvery(LOAD_STATUS, getStatus);
}

export default function BuildStatusReducer(state: State = {}, action: Action) {
  if (action == null) {
    return state;
  }
  switch (action.type) {
    case STORE_STATUS:
      if (action.state.version) {
        action.state.version = action.state.version.replace(/^LWJGL\s+/, '');
      }

      return { ...state, [action.name]: action.state };
  }

  return state;
}
