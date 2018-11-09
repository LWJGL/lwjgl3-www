// https://github.com/streamich/ts-easing/blob/master/src/index.ts

// No easing, no acceleration
export const linear = (t: number) => t;

// Accelerates fast, then slows quickly towards end.
export const quadratic = (t: number) => t * (-(t * t) * t + 4 * t * t - 6 * t + 4);

// Overshoots over 1 and then returns to 1 towards end.
export const cubic = (t: number) => t * (4 * t * t - 9 * t + 6);

// Overshoots over 1 multiple times - wiggles around 1.
export const elastic = (t: number) => t * (33 * t * t * t * t - 106 * t * t * t + 126 * t * t - 67 * t + 15);

// Accelerating from zero velocity
export const inQuad = (t: number) => t * t;

// Decelerating to zero velocity
export const outQuad = (t: number) => t * (2 - t);

// Acceleration until halfway, then deceleration
export const inOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

// Accelerating from zero velocity
export const inCubic = (t: number) => t * t * t;

// Decelerating to zero velocity
export const outCubic = (t: number) => --t * t * t + 1;

// Acceleration until halfway, then deceleration
export const inOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1);

// Accelerating from zero velocity
export const inQuart = (t: number) => t * t * t * t;

// Decelerating to zero velocity
export const outQuart = (t: number) => 1 - --t * t * t * t;

// Acceleration until halfway, then deceleration
export const inOutQuart = (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t);

// Accelerating from zero velocity
export const inQuint = (t: number) => t * t * t * t * t;

// Decelerating to zero velocity
export const outQuint = (t: number) => 1 + --t * t * t * t * t;

// Acceleration until halfway, then deceleration
export const inOutQuint = (t: number) => (t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t);

// Accelerating from zero velocity
export const inSine = (t: number) => -Math.cos(t * (Math.PI / 2)) + 1;

// Decelerating to zero velocity
export const outSine = (t: number) => Math.sin(t * (Math.PI / 2));

// Accelerating until halfway, then decelerating
export const inOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

// Exponential accelerating from zero velocity
export const inExpo = (t: number) => Math.pow(2, 10 * (t - 1));

// Exponential decelerating to zero velocity
export const outExpo = (t: number) => -Math.pow(2, -10 * t) + 1;

// Exponential accelerating until halfway, then decelerating
export const inOutExpo = (t: number) => {
  t /= 0.5;
  if (t < 1) return Math.pow(2, 10 * (t - 1)) / 2;
  t--;
  return (-Math.pow(2, -10 * t) + 2) / 2;
};

// Circular accelerating from zero velocity
export const inCirc = (t: number) => -Math.sqrt(1 - t * t) + 1;

// Circular decelerating to zero velocity Moves VERY fast at the beginning and
// then quickly slows down in the middle. This tween can actually be used
// in continuous transitions where target value changes all the time;
// because of the very quick start, it hides the jitter between target value changes.
export const outCirc = (t: number) => Math.sqrt(1 - (t = t - 1) * t);

// Circular acceleration until halfway, then deceleration
export const inOutCirc = (t: number) => {
  t /= 0.5;
  if (t < 1) return -(Math.sqrt(1 - t * t) - 1) / 2;
  t -= 2;
  return (Math.sqrt(1 - t * t) + 1) / 2;
};
