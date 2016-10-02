import { combineReducers } from 'redux'
import { createResponsiveStateReducer } from 'redux-responsive'
import buildStatus from '../components/BuildStatus/reducer'

export default function createReducer(asyncReducers) {
  // const appReducer = combineReducers({
  return combineReducers({
    browser: createResponsiveStateReducer({
      xs: 544,
      sm: 768,
      md: 992,
      lg: 1200,
      // xs: 0,
      // sm: 544,
      // md: 768,
      // lg: 992,
      // xl: 1200,
    }),
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
