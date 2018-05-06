// @flow
// @jsx jsx
import * as React from 'react';
import { jsx } from '@emotion/core';
import css from '@emotion/css';

export type Props = {
  style?: { ...CSSStyleDeclaration },
  children?: React.Node,
  props?: { [$Keys<HTMLElement>]: any },
};

// Based on https://blog.prototypr.io/align-svg-icons-to-text-and-say-goodbye-to-font-icons-d44b3d7b26b4#.58pqpyl6w
const SvgIcon = css`
  display: inline-flex;
  align-self: center;
  position: relative;
  height: 1em;
  width: 1em;
  svg {
    height: 1em;
    width: 1em;
    bottom: -0.125em;
    position: absolute;
    .align-items-center & {
      bottom: auto;
    }
  }
`;

export const Icon = ({ children, style, ...props }: Props) => (
  <span css={SvgIcon} className="svg-icon" style={style}>
    <svg children={children} fill="currentColor" preserveAspectRatio="xMidYMid meet" {...props} />
  </span>
);
