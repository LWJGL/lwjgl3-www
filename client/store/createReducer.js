import { combineReducers } from 'redux';
import breakpoint from './reducers/breakpoint';
import buildStatus from '../components/BuildStatus/reducer';
// import teamcityStatus from '../components/TeamcityStatus/reducer';

import type { Reducer } from 'redux';

type AsyncReducers = {
  [_: string]: Reducer<*, *>,
};

export default function createReducer(asyncReducers: ?AsyncReducers): Reducer<any, any> {
  const reducers = {
    breakpoint,
    buildStatus,
    // teamcityStatus,
    ...asyncReducers,
  };

  return combineReducers(reducers);
}
