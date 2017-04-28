import store from './';
import createReducer from './createReducer';
import type { Reducer } from 'redux';

const asyncReducers = {};

export const register = (scope: string, reducer: Reducer<any, any>): void => {
  asyncReducers[scope] = reducer;
  store.replaceReducer(createReducer(asyncReducers));
};
