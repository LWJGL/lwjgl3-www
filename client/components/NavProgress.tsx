import { useEffect } from 'react';
import { css, keyframes } from '@emotion/css';
import { COLOR_CUSTOM_CONTROL_INDICATOR_BG, COLOR_CUSTOM_CONTROL_INDICATOR_CHECKED_BG, ZINDEX_FIXED } from '~/theme';
import { useLocationPending } from 'react-router-dom';

const pulseAnimation = keyframes`
  0% {
    transform: translateX(-20vw);
  }
  25% {
    transform: translateX(-20vw);
  }
  75% {
    transform: translateX(120vw);
  }
  100% {
    transform: translateX(120vw);
  }
`;

const cssProgressContainer = css`
  position: fixed;
  top: 0;
  left: 0;
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
  animation: ${pulseAnimation} 2.5s linear 10s both infinite;
`;

const PERC_MAX = 99.4;
let progress = 0;
let delayTimeoutId: number | null = null;
let trickleTimeoutId: number | null = null;
let resetTimeoutId: number | null = null;
let navProgress: HTMLDivElement;
let bar: HTMLDivElement;

function trickle() {
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

    trickleTimeoutId = window.setTimeout(trickle, 200 + Math.floor(400 * Math.random()));
    progress = progress >= PERC_MAX ? PERC_MAX : progress + step;
    pos(progress);
  }
}

function pos(progress: number) {
  bar.style.transform = `scaleX(${progress / 100})`;
}

function start() {
  if (navProgress === undefined) {
    //@ts-ignore
    navProgress = document.getElementById('nav-progress');
    //@ts-ignore
    bar = document.getElementById('nav-progress-bar');
  }

  if (delayTimeoutId !== null) {
    clearTimeout(delayTimeoutId);
    delayTimeoutId = null;
  }
  clearReset();
  navProgress.removeAttribute('hidden');
  progress = 1;
  pos(1);
  trickleTimeoutId = window.setTimeout(trickle);
}

function stop() {
  pos(100);
  progress = 100;
  if (trickleTimeoutId !== null) {
    clearTimeout(trickleTimeoutId);
    trickleTimeoutId = null;
  }
  navProgress.classList.add('fade-out');
  resetTimeoutId = window.setTimeout(reset, 750);
}

function clearReset() {
  if (resetTimeoutId !== null) {
    clearTimeout(resetTimeoutId);
    resetTimeoutId = null;
    navProgress.classList.remove('fade-out');
  }
}

function reset() {
  clearReset();
  progress = 0;
  navProgress.setAttribute('hidden', '');
}

export function NavProgress() {
  const isPending: boolean = useLocationPending();
  console.log(isPending);

  useEffect(() => {
    if (isPending) {
      delayTimeoutId = window.setTimeout(start, 250);
    } else if (delayTimeoutId !== null) {
      clearTimeout(delayTimeoutId);
      delayTimeoutId = null;
    } else if (progress > 0) {
      stop();
    }
  }, [isPending]);

  return (
    <div hidden id="nav-progress" className={cssProgressContainer}>
      <div id="nav-progress-bar" className={cssProgressBar} />
      <div className={cssProgressPulse} />
    </div>
  );
}
