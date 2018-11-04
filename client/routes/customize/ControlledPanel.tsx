import * as React from 'react';
import { useStore } from './Store';
import { BuildStore } from './types';

interface Props {
  predicate: (state: BuildStore) => boolean;
  children: React.ReactNode;
}

interface ConnectedProps {
  visible: boolean;
}

export function ControlledPanel({ children, predicate }: Props) {
  const [state] = useStore(
    (state: BuildStore): ConnectedProps => ({
      visible: predicate(state),
    })
  );

  return state.visible ? React.Children.only(children) : null;
}
