import { useAnimationTimer } from './useAnimationTimer';
import { linear, elastic, inExpo } from '../services/easing';

export enum Easing {
  Linear = 'linear',
  Elastic = 'elastic',
  InExpo = 'inExpo',
}

export function useAnimation(easing = Easing.Linear, duration = 500, delay = 0) {
  // The useAnimationTimer hook calls useState every animation frame
  // giving us elapsed time and causing a rerender as frequently
  // as possible for a smooth animation.
  // Example: https://codesandbox.io/s/qxnmn1n45q
  const elapsed = useAnimationTimer(duration, delay);

  // Amount of specified duration elapsed on a scale from 0 - 1
  const n = Math.min(1, elapsed / duration);

  switch (easing) {
    case Easing.Linear:
      return linear(n);
    case Easing.Elastic:
      return elastic(n);
    case Easing.InExpo:
      return inExpo(n);
  }
}
