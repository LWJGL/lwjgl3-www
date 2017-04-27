import createSagaMiddleware from 'redux-saga';
import { fork } from 'redux-saga/effects';
import { saga as buildStatusSaga } from '../components/BuildStatus/reducer';
import { saga as teamcityStatusSaga } from '../components/TeamcityStatus/reducer';

export const sagaMiddleware = createSagaMiddleware();

/**
 * Root saga generator
 *
 * Generator signature types are: Yield, Return, Next ( https://flow.org/blog/2015/11/09/Generators/ )
 *  Yield is the type of values which are yielded from the generator function.
 *  Return is the type of the value which is returned from the generator function.
 *  Next is the type of values which are passed into the generator via the next method on the Generator itself
 */
export function* saga(): Generator<Array<any>, void, void> {
  yield [fork(buildStatusSaga), fork(teamcityStatusSaga)];
}
