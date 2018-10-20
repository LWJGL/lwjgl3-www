// @flow
// @jsx jsx
import * as React from 'react';
import { jsx } from '@emotion/core';
import css from '@emotion/css';
import keyframes from '@emotion/keyframes';
import { COLOR_CUSTOM_CONTROL_INDICATOR_BG, COLOR_CUSTOM_CONTROL_INDICATOR_CHECKED_BG, ZINDEX_FIXED } from '~/theme';

let instance: null | NavProgress = null;
let count = 0;
const PERC_MAX = 99.4;

const pulseAnimation = keyframes(css`
  from {
    transform: translateX(-20vw);
  }
  25% {
    transform: translateX(-20vw);
  }
  75% {
    transform: translateX(120vw);
  }
  to {
    transform: translateX(120vw);
  }
`);

export function start(delay: number = 0) {
  count += 1;
  if (delay > 0) {
    setTimeout(startInstance, delay);
  } else {
    startInstance();
  }
}

function startInstance() {
  if (count > 0 && instance !== null && instance.mounted) {
    instance.start();
  }
}

export function end() {
  if (count > 0) {
    count -= 1;
    if (count === 0 && instance !== null && instance.mounted) {
      instance.end();
    }
  }
}

type State = {
  progress: number,
};

export class NavProgress extends React.Component<{||}, State> {
  mounted = false;
  trickleTimeoutId: TimeoutID | null = null;

  state = {
    progress: 0,
  };

  componentDidMount() {
    this.mounted = true;
    if (instance === null) {
      instance = this;
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    if (instance === this) {
      instance = null;
    }
  }

  start() {
    this.setState({ progress: 1 });
    this.trickleTimeoutId = setTimeout(this.trickle.bind(this), 0);
  }

  trickle() {
    let { progress } = this.state;
    if (this.mounted && progress < PERC_MAX) {
      let step = 0;

      if (progress < 37) {
        step = 13;
      } else if (progress >= 37 && progress < 59) {
        step = 7;
      } else if (progress >= 59 && progress < 83) {
        step = 3;
      } else {
        step = 0.5;
      }

      progress += step;
      if (progress > PERC_MAX) {
        progress = PERC_MAX;
      }

      this.setState({ progress: progress });
      this.trickleTimeoutId = setTimeout(this.trickle.bind(this), 200 + Math.floor(400 * Math.random()));
    }
  }

  end() {
    if (this.state.progress > 0) {
      this.setState({ progress: 100 });
      setTimeout(this.reset.bind(this), 400);
    }
    if (this.trickleTimeoutId !== null) {
      clearTimeout(this.trickleTimeoutId);
      this.trickleTimeoutId = null;
    }
  }

  reset() {
    if (count === 0) {
      this.setState({ progress: 0 });
    }
  }

  render() {
    const { progress } = this.state;
    return progress === 0 ? null : (
      <div
        className={progress === 100 ? 'fade-out' : ''}
        css={css`
          position: fixed;
          width: 100%;
          height: 3px;
          z-index: ${ZINDEX_FIXED};
          background: ${COLOR_CUSTOM_CONTROL_INDICATOR_BG.css()};
          pointer-events: none;
          will-change: opacity;
          transition: opacity 0.3s ease-out;
          &.fade-out {
            opacity: 0;
          }
        `}
      >
        <div
          style={{
            transform: `scaleX(${progress / 100})`,
          }}
          css={css`
            width: 100%;
            height: 3px;
            background: ${COLOR_CUSTOM_CONTROL_INDICATOR_CHECKED_BG.css()};
            will-change: transform;
            transform-origin: left;
            transition: transform 0.2s linear;
          `}
        />
        <div
          css={css`
            position: absolute;
            top: 0;
            left: 0;
            width: 20vw;
            height: 3px;
            will-change: transform;
            transform-origin: left;
            background: linear-gradient(
              to right,
              transparent,
              ${COLOR_CUSTOM_CONTROL_INDICATOR_BG.css()} 50%,
              transparent
            );
            animation: ${pulseAnimation.name} 2.5s linear 10s both infinite;
            ${pulseAnimation.styles};
          `}
        />
      </div>
    );
  }
}
