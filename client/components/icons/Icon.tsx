// @jsx jsx
import * as React from 'react';
//@ts-ignore
import { jsx, css } from '@emotion/core';

export interface IconProps extends React.SVGAttributes<HTMLOrSVGElement> {
  children?: React.ReactNode;
  style?: React.StyleHTMLAttributes<HTMLSpanElement>;
}

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

export const Icon = ({ children, style, ...props }: IconProps) => (
  <span css={SvgIcon} className="svg-icon" style={style}>
    <svg fill="currentColor" preserveAspectRatio="xMidYMid meet" {...props}>
      {children}
    </svg>
  </span>
);
