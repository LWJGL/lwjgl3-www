import React from 'react';
import { useSlice } from './Store';
import { BuildStore } from './types';

interface Props {
  predicate: (state: BuildStore) => boolean;
}

export const ControlledPanel: React.FC<Props> = ({ children, predicate }) => {
  const [visible] = useSlice(state => predicate(state));
  return visible ? (children as JSX.Element) : null;
};
