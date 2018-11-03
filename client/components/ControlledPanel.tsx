import * as React from 'react';
import { Connect } from '~/store/Connect';

interface Props {
  predicate: (state: any) => boolean;
  children: React.ReactNode;
}

interface ConnectedProps {
  hidden: boolean;
}

export const ControlledPanel = ({ children, predicate }: Props) => (
  <Connect
    state={state => ({
      hidden: !predicate(state),
    })}
  >
    {({ hidden }: ConnectedProps) => (hidden || children === undefined ? null : children)}
  </Connect>
);
