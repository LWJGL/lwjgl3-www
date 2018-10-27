// @flow
import produce from 'immer';
//$FlowFixMe
import { useState, useReducer } from 'react';
import type { Reducer } from 'redux';
// https://github.com/mweststrate/use-immer

type Updater = <S>(draftState: S) => S;

export function useImmer<S>(initialValue: S) {
  const [value, updateValue] = useState(initialValue);
  return [
    value,
    (updater: Updater) => {
      updateValue(produce(updater));
    },
  ];
}

export function useImmerReducer<S, A>(reducer: Reducer<S, A>, initialState: S) {
  return useReducer(produce(reducer), initialState);
}
