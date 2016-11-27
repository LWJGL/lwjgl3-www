import { fork } from 'redux-saga/effects'
import { saga as buildStatusSaga } from '../components/BuildStatus/reducer'
import { saga as teamcityStatusSaga } from '../components/TeamcityStatus/reducer'

export default function* root() {
  yield [
    fork(buildStatusSaga),
    fork(teamcityStatusSaga),
  ];
}
