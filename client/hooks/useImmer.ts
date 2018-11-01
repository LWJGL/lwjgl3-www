import { useState, useReducer } from 'react';
import produce, { Draft } from 'immer';
// https://github.com/mweststrate/use-immer

type Updater = <S>(this: void | Draft<S>, draftState: void | Draft<S>) => void | S;

export function useImmer<S>(initialValue: S) {
  const [value, updateValue] = useState(initialValue);
  return [
    value,
    (updater: Updater) => {
      updateValue(produce(updater));
    },
  ];
}

export function useImmerReducer<S>(reducer: Updater, initialState: S) {
  return useReducer(produce(reducer), initialState);
}
