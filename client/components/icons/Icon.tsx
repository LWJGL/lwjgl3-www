import React from 'react';
import { css } from '@emotion/core';

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

export interface IconProps extends React.SVGAttributes<HTMLOrSVGElement> {
  style?: React.CSSProperties;
}

export const Icon: React.FC<IconProps> = ({ children, style, ...props }) => (
  <span css={SvgIcon} className="svg-icon" style={style}>
    <svg fill="currentColor" preserveAspectRatio="xMidYMid meet" {...props}>
      {children}
    </svg>
  </span>
);
