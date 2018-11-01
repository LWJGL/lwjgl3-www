import { useState, useReducer } from 'react';
import produce, { Draft } from 'immer';
// https://github.com/mweststrate/use-immer

type Updater = <S>(draftState: Draft<S>) => void | S;

export function useImmer<S>(initialValue: S) {
  const [value, updateValue] = useState(initialValue);
  return [
    value,
    (updater: Updater) => {
      updateValue(produce(updater));
    },
  ];
}

export function useImmerReducer<S, A>(reducer: React.Reducer<S, A>, initialState: S) {
  //@ts-ignore
  return useReducer(produce(reducer), initialState);
}
