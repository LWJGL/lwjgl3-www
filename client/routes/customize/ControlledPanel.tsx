import * as React from 'react';
import { useSlice } from './Store';
import { BuildStore } from './types';

interface Props {
  predicate: (state: BuildStore) => boolean;
  children: React.ReactNode;
}

export function ControlledPanel({ children, predicate }: Props) {
  const [visible] = useSlice(state => predicate(state));
  return visible ? (children as any) : null;
}
