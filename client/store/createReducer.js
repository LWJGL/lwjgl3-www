import { combineReducers } from 'redux'
import breakpoint from './reducers/breakpoint'
import buildStatus from '../components/BuildStatus/reducer'
import teamcityStatus from '../components/TeamcityStatus/reducer'

export default function createReducer(asyncReducers) {
  return combineReducers({
    breakpoint,
    buildStatus,
    teamcityStatus,
    ...asyncReducers
  });
}
