import { takeEvery, call, put } from 'redux-saga/effects'

const LOAD_STATUS = 'TEAMCITY_STATUS/LOAD';
const STORE_STATUS = 'TEAMCITY_STATUS/STORE';

export const loadStatus = (name) => ({type: LOAD_STATUS, name});
export const storeStatus = (name, status, build) => ({type: STORE_STATUS, name, state: {status, build}});

async function fetchStatus(url) {
  let response;
  let result;

  try {
    response = await fetch(url);

    if ( response.status !== 200 ) {
      return {error: response.statusText};
    }

    result = await response.json();
  } catch (e) {
    return {error: e.message};
  }

  if ( result.error ) {
    return result;
  }

  return result.count === 1 && result.build[0].status === 'SUCCESS' ? {
    status: 'passing',
    build: result.build[0].number
  } : {
    status: 'failing',
    build: result.build[0].number
  };
}

function* getStatus(action) {
  const {name} = action;

  const response = yield call(fetchStatus, `/teamcity?build=${name}`);

  if ( response.error ) {
    yield put(storeStatus(name, 'error'));
    return;
  }

  yield put(storeStatus(name, response.status, response.build));
}

export function* saga() {
  yield takeEvery(LOAD_STATUS, getStatus);
}

export default function(state = {}, action) {
  switch (action.type) {
    case STORE_STATUS:
      return {...state, [action.name]: action.state};
  }

  return state;
}
