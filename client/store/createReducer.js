// @flow
import { combineReducers, type Reducer } from 'redux';

type AsyncReducers = {
  [_: string]: Reducer<any, any>,
};

export function createReducer(asyncReducers: ?AsyncReducers): Reducer<any, any> {
  const reducers = {
    blank: () => ({}),
    ...asyncReducers,
  };

  return combineReducers(reducers);
}
