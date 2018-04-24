// @flow
import * as React from 'react';

export type Props = {
  style?: { ...CSSStyleDeclaration },
  children?: React.Node,
  props?: { [$Keys<HTMLElement>]: any },
};

export const Icon = ({ children, style, ...props }: Props) => (
  <span className="svg-icon" style={style}>
    <svg children={children} fill="currentColor" preserveAspectRatio="xMidYMid meet" {...props} />
  </span>
);
