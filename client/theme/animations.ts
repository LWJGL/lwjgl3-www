import { keyframes } from './stitches.config';

export const spin = keyframes({
  to: {
    transform: 'rotate(360deg)',
  },
});

const pingTransform = {
  transform: 'scale(2)',
  opacity: '0',
};
export const ping = keyframes({
  '75%': pingTransform,
  '100%': pingTransform,
});

export const pulse = keyframes({
  '50%': {
    opacity: '.5',
  },
});

export const resetOpacityTransform = keyframes({
  to: {
    opacity: 1,
    transform: 'translate3d(0, 0, 0)',
  },
});

const bounceInitial = {
  transform: 'translateY(-25%)',
  animationTimingFunction: 'cubic-bezier(0.8,0,1,1)',
};
export const bounce = keyframes({
  '0%': bounceInitial,
  '50%': {
    transform: 'none',
    animationTimingFunction: 'cubic-bezier(0,0,0.2,1)',
  },
  '100%': bounceInitial,
});

export const grow = keyframes({
  '0%': {
    transform: 'scale(0)',
  },
  '50%': {
    opacity: 1,
    transform: 'none',
  },
});
