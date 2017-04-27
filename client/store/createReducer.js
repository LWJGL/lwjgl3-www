import { combineReducers } from 'redux';
import breakpoint from './reducers/breakpoint';
import buildStatus from '../components/BuildStatus/reducer';
import teamcityStatus from '../components/TeamcityStatus/reducer';

import type { Reducer } from 'redux';

type AsyncReducers = {
  [_: string]: Reducer<*, *>,
};

export default function createReducer(asyncReducers: ?AsyncReducers) {
  const reducers = {
    breakpoint,
    buildStatus,
    teamcityStatus,
    ...asyncReducers,
  };

  // Force import during development to enable async reducer HMR
  if (process.env.NODE_ENV === 'development') {
    return combineReducers({
      build: require('../routes/download/BuildConfigurator/reducer').default,
      browser: require('../routes/download/FileBrowser/reducer').default,
      ...reducers,
    });
  }

  return combineReducers(reducers);
}
