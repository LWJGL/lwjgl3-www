// @flow
import { combineReducers, type Reducer } from 'redux';
import { breakpointReducer } from './reducers/breakpoint';

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
