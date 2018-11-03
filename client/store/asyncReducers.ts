import { store } from './';
import { createReducer } from './createReducer';
import { Reducer } from 'redux';

interface AsyncReducers {
  [scope: string]: Reducer;
}

const asyncReducers: AsyncReducers = {};

export const register = (scope: string, reducer: Reducer): void => {
  asyncReducers[scope] = reducer;
  store.replaceReducer(createReducer(asyncReducers));
};
