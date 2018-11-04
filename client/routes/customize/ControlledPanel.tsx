import * as React from 'react';
import { useStore } from './Store';
import { BuildConfig } from './types';

interface Props {
  predicate: (state: BuildConfig) => boolean;
  children: React.ReactNode;
}

interface ConnectedProps {
  visible: boolean;
}

export function ControlledPanel({ children, predicate }: Props) {
  const [state] = useStore(
    (state: BuildConfig): ConnectedProps => ({
      visible: predicate(state),
    })
  );

  return state.visible ? React.Children.only(children) : null;
}
