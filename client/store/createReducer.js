// @flow
import { combineReducers } from 'redux';
import { breakpointReducer } from './reducers/breakpoint';

import type { Reducer } from 'redux';

type AsyncReducers = {
  [_: string]: Reducer<*, *>,
};

export function createReducer(asyncReducers: ?AsyncReducers): Reducer<any, any> {
  const reducers = {
    breakpoint: breakpointReducer,
    ...asyncReducers,
  };

  return combineReducers(reducers);
}
