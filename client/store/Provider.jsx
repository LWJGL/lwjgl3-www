// @flow
import * as React from 'react';
//$FlowFixMe
import { useEffect, useState } from 'react';
import { store } from './';

type Props = {
  children: React.Node,
};

export const StoreContext = React.createContext(store.getState());

export function Provider({ children }: Props) {
  const [state, setState] = useState(store.getState());

  function updateProvider() {
    const nextState = store.getState();
    if (state !== nextState) {
      setState(nextState);
    }
  }

  useEffect(() => store.subscribe(updateProvider), []);

  return <StoreContext.Provider value={state}>{React.Children.only(children)}</StoreContext.Provider>;
}
