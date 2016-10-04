import { fork } from 'redux-saga/effects'
import { saga as buildStatusSaga } from '../components/BuildStatus/reducer'
import buildDownloadSaga from '../routes/download/BuildConfigurator/saga'

export default function* root() {
  yield [
    fork(buildStatusSaga),
    fork(buildDownloadSaga),
  ];
}
