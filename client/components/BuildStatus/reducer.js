import { takeEvery } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'

const LOAD_STATUS = 'BUILD_STATUS/LOAD';
const STORE_STATUS = 'BUILD_STATUS/STORE';

export const loadStatus = name => ({type: LOAD_STATUS, name});
export const storeStatus = (name, state) => ({type: STORE_STATUS, name, state});

async function fetchStatus(url) {
  let response;

  try {
    response = await fetch(url);

    if ( response.status !== 200 ) {
      return {error: response.statusText};
    }

    return await response.json();
  } catch (e) {
    return {error: e.message};
  }
}

function* getStatus(action) {
  const { name } = action;
  let url = `/build/${name}`;
  if ( name === 'release' ) {
    const version = yield select(({build}) => build.builds.byId.release.latest.join('.'));
    url += `/${version}`;
  }
  const response = yield call(fetchStatus, url);
  yield put(storeStatus(name, response));
}

export function* saga() {
  yield* takeEvery(LOAD_STATUS, getStatus);
}

export default function(state = {}, action) {
  switch (action.type) {
    case STORE_STATUS:
      if ( action.state.version ) {
        action.state.version = action.state.version.replace(/^LWJGL\s+/, '');
      }

      return {...state, [action.name]: action.state};
  }

  return state;
}
