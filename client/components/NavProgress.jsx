// @flow
// @jsx jsx
import * as React from 'react';
//$FlowFixMe
import { useState, useEffect, useContext, useRef } from 'react';
import { jsx, css, keyframes } from '@emotion/core';
import { COLOR_CUSTOM_CONTROL_INDICATOR_BG, COLOR_CUSTOM_CONTROL_INDICATOR_CHECKED_BG, ZINDEX_FIXED } from '~/theme';

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

const cssProgressContainer = css`
  position: fixed;
  width: 100%;
  height: 3px;
  z-index: ${ZINDEX_FIXED};
  background: ${COLOR_CUSTOM_CONTROL_INDICATOR_BG.css()};
  pointer-events: none;
  will-change: opacity;
  transition: opacity 0.75s 0.25s ease-out;
  &.fade-out {
    opacity: 0;
  }
`;

const cssProgressBar = css`
  width: 100%;
  height: 3px;
  background: ${COLOR_CUSTOM_CONTROL_INDICATOR_CHECKED_BG.css()};
  will-change: transform;
  transform-origin: left;
  transition: transform 0.2s linear;
`;

const cssProgressPulse = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 20vw;
  height: 3px;
  will-change: transform;
  transform-origin: left;
  background: linear-gradient(to right, transparent, ${COLOR_CUSTOM_CONTROL_INDICATOR_BG.css()} 50%, transparent);
  animation: ${pulseAnimation.name} 2.5s linear 10s both infinite;
  ${pulseAnimation.styles};
`;

type Context = {
  start: (delay: number) => void,
  end: () => void,
};

type ProviderProps = {
  children?: React.Node,
};

export const NavProgressContext = React.createContext<Context>({
  start: () => {},
  end: () => {},
});

let counter = 0;
let delayTimeout: TimeoutID | null = null;

export function NavProgressProvider({ children }: ProviderProps) {
  const [count, setCount] = useState(counter);

  function start(delay: number = 0) {
    if (delay > 0 && delayTimeout !== null) {
      delayTimeout = setTimeout(delayedStart, delay);
    } else {
      delayedStart();
    }
  }

  function delayedStart() {
    counter += 1;
    setCount(counter);
    cleanup();
  }

  function cleanup() {
    if (delayTimeout !== null) {
      clearTimeout(delayTimeout);
      delayTimeout = null;
      return true;
    }
    return false;
  }

  function end() {
    if (!cleanup()) {
      if (counter <= 0 && !FLAG_PRODUCTION) {
        throw new Error('Called end without first calling start');
      }

      counter -= 1;
      setCount(counter);
    }
  }

  const state = {
    count,
    start,
    end,
  };

  return <NavProgressContext.Provider value={state}>{React.Children.only(children)}</NavProgressContext.Provider>;
}

const PERC_MAX = 99.4;

export function NavProgress() {
  const { count } = useContext(NavProgressContext);
  const [progress, setProgress] = useState(0);
  const trickleTimeoutId = useRef(null);
  const resetTimeoutId = useRef(null);

  useEffect(
    () => {
      function trickle() {
        setProgress(progress => {
          if (progress < PERC_MAX) {
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

            trickleTimeoutId.current = setTimeout(trickle, 200 + Math.floor(400 * Math.random()));
            return progress >= PERC_MAX ? PERC_MAX : progress + step;
          }
        });
      }

      function reset() {
        if (count === 0) {
          setProgress(0);
        }
      }

      if (count > 0) {
        if (progress === 0) {
          trickle();
        } else if (progress === 100) {
          // This is caused by a quick "start → end → start"
          setProgress(0);
          trickle();
          if (resetTimeoutId.current !== null) {
            clearTimeout(resetTimeoutId.current);
            resetTimeoutId.current = null;
          }
        }
      } else if (progress > 0) {
        // Fill bar and wait 750ms before resetting
        setProgress(100);
        resetTimeoutId.current = setTimeout(reset, 750);

        // Clear tricle timeout
        if (trickleTimeoutId.current !== null) {
          clearTimeout(trickleTimeoutId.current);
          trickleTimeoutId.current = null;
        }
      }
    },
    [count]
  );

  return (
    <div hidden={progress === 0} className={progress === 100 ? 'fade-out' : ''} css={cssProgressContainer}>
      <div
        css={cssProgressBar}
        style={{
          transform: `scaleX(${progress / 100})`,
        }}
      />
      <div css={cssProgressPulse} />
    </div>
  );
}
