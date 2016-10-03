import { combineReducers } from 'redux'
import breakpoint from './reducers/breakpoint'
import buildStatus from '../components/BuildStatus/reducer'

export default function createReducer(asyncReducers) {
  // const appReducer = combineReducers({
  return combineReducers({
    breakpoint,
    buildStatus,
    ...asyncReducers
  });

  // return function rootReducer(state, action) {
  //   if ( action.type === 'SYSTEM/EJECT_REDUCER' ) {
  //     delete state[action.name];
  //   }
  //
  //   return appReducer(state, action);
  // }
}
