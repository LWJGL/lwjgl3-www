// @flow
// @jsx jsx
import * as React from 'react';
import { jsx } from '@emotion/core';
import { cc, COLOR_PRIMARY } from '~/theme';
import { easeInQuad as easeIn, easeOutCubic } from '~/theme/easing';
import css from '@emotion/css';
import keyframes from '@emotion/keyframes';

const SIZE = 44;

function getRelativeValue(value, min, max) {
  const clampedValue = Math.min(Math.max(min, value), max);
  return (clampedValue - min) / (max - min);
}

function easeOut(t) {
  return easeOutCubic(getRelativeValue(t, 0, 1));
}

type Props = {
  className?: string,
  size: number,
  style?: $Shape<CSSStyleDeclaration>,
  thickness: number,
  value: number,
  variant: 'determinate' | 'indeterminate' | 'static',
};

const indeterminateAnimation = keyframes(css`
  to {
    transform: rotate(360deg);
  }
`);

const indeterminateStrokeAnimation = keyframes(css`
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0px;
  }
  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }
  100% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -120px;
  }
`);

const ProgressStyle = css`
  display: inline-block;
  line-height: 1;
  color: ${COLOR_PRIMARY.css()};
  circle {
    stroke: currentColor;
  }
  &.static {
    transition: transform 0.3s cubic-bezier(0, 0, 0.2, 1);
    circle {
      transition: stroke-dashoffset 0.3s cubic-bezier(0, 0, 0.2, 1);
    }
  }
  &.indeterminate {
    animation: ${indeterminateAnimation.name} 1.8s linear infinite;
    ${indeterminateAnimation.styles};
    circle {
      animation: ${indeterminateStrokeAnimation.name} 1.8s ease-in-out infinite;
      ${indeterminateStrokeAnimation.styles};
      stroke-dasharray: 80px, 200px;
      stroke-dashoffset: 0px; /* Add the unit to fix a Edge 16 and below bug. */
    }
  }
`;

export class CircularProgress extends React.Component<Props, void> {
  static defaultProps = {
    size: 40,
    thickness: 3.6,
    value: 0,
    variant: 'indeterminate',
  };

  render() {
    const { size, thickness, value, variant, className, style, ...other } = this.props;

    const circleStyle = {};
    const rootStyle = {};
    const rootProps = {};

    if (variant === 'determinate' || variant === 'static') {
      const circumference = 2 * Math.PI * ((SIZE - thickness) / 2);
      circleStyle.strokeDasharray = circumference.toFixed(3);
      rootProps['aria-valuenow'] = Math.round(value);

      if (variant === 'static') {
        circleStyle.strokeDashoffset = `${(((100 - value) / 100) * circumference).toFixed(3)}px`;
        rootStyle.transform = 'rotate(-90deg)';
      } else {
        circleStyle.strokeDashoffset = `${(easeIn((100 - value) / 100) * circumference).toFixed(3)}px`;
        rootStyle.transform = `rotate(${(easeOut(value / 70) * 270).toFixed(3)}deg)`;
      }
    }

    return (
      <svg
        css={ProgressStyle}
        className={cc(className, {
          indeterminate: variant === 'indeterminate',
          static: variant === 'static',
        })}
        style={{ width: size, height: size, ...rootStyle, ...style }}
        role="progressbar"
        {...rootProps}
        {...other}
        viewBox={`${SIZE / 2} ${SIZE / 2} ${SIZE} ${SIZE}`}
      >
        <circle
          style={circleStyle}
          cx={SIZE}
          cy={SIZE}
          r={(SIZE - thickness) / 2}
          fill="none"
          strokeWidth={thickness}
        />
      </svg>
    );
  }
}
