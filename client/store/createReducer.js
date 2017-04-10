import { combineReducers } from 'redux';
import breakpoint from './reducers/breakpoint';
import buildStatus from '../components/BuildStatus/reducer';
import teamcityStatus from '../components/TeamcityStatus/reducer';

export default function createReducer(asyncReducers) {
  let reducers = {
    breakpoint,
    buildStatus,
    teamcityStatus,
    ...asyncReducers,
  };

  // Force import during development to enable async reducer HMR
  if (process.env.NODE_ENV === 'development') {
    reducers = {
      build: require('../routes/download/BuildConfigurator/reducer').default,
      browser: require('../routes/download/FileBrowser/reducer').default,
      ...reducers,
    };
  }

  return combineReducers(reducers);
}
