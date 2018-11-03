import { combineReducers, Reducer } from 'redux';

interface AsyncReducers {
  [scope: string]: Reducer;
}

export function createReducer(asyncReducers?: AsyncReducers): Reducer {
  const reducers = {
    blank: () => ({}),
    ...asyncReducers,
  };

  return combineReducers(reducers);
}
