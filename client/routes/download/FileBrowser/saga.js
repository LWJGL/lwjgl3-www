import { takeEvery, select, call, put } from 'redux-saga/effects';
import { types as $, actions as $$ } from './reducer';
import { HTTP_OK } from '../../../services/http_status_codes';

const getData = state => {
  return {
    path: state.browser.path,
    ...state.browser.contents[state.browser.path],
  };
};

async function fetchContents(path) {
  let requestUrl = '/browse';

  if (path !== '/') {
    requestUrl += `?path=${path}`;
  }

  const response = await fetch(requestUrl);
  if (response.status !== HTTP_OK) {
    throw response.statusText;
  }
  return await response.json();
}

function* loadPath() {
  const data = yield select(getData);

  if (!data.loading) {
    return;
  }

  let contents;
  try {
    contents = yield call(fetchContents, data.path);
  } catch (ignore) {
    return;
  }

  yield put($$.storeContents(data.path, contents));
}

export default function* fileBrowserSaga(): Generator<*, *, *> {
  yield takeEvery($.BROWSER_LOAD, loadPath);
}
