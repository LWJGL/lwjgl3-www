import { fork } from 'redux-saga/effects'
import { saga as buildStatusSaga } from '../components/BuildStatus/reducer'

export default function* root() {
  yield [
    fork(buildStatusSaga)
  ];
}
