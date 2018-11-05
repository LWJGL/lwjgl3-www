import * as React from 'react';
import { useStore } from './Store';
import { BuildStore } from './types';

interface Props {
  predicate: (state: BuildStore) => boolean;
  children: React.ReactNode;
}

export function ControlledPanel({ children, predicate }: Props) {
  const [state] = useStore(state => ({
    visible: predicate(state),
  }));

  return state.visible ? <React.Fragment>{children}</React.Fragment> : null;
}
