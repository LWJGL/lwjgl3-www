// @flow

// no easing, no acceleration
export function linear(t: number) {
  return t;
}

// accelerating from zero velocity
export function easeInQuad(t: number) {
  return t * t;
}

// decelerating to zero velocity
export function easeOutQuad(t: number) {
  return t * (2 - t);
}

// acceleration until halfway, then deceleration
export function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// accelerating from zero velocity
export function easeInCubic(t: number) {
  return t * t * t;
}

// decelerating to zero velocity
export function easeOutCubic(t: number) {
  let tx = t;
  return --tx * tx * tx + 1;
}

// acceleration until halfway, then deceleration
export function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

// accelerating from zero velocity
export function easeInQuart(t: number) {
  return t * t * t * t;
}

// decelerating to zero velocity
export function easeOutQuart(t: number) {
  let tx = t;
  return 1 - --tx * tx * tx * tx;
}

// acceleration until halfway, then deceleration
export function easeInOutQuart(t: number) {
  let tx = t;
  return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --tx * tx * tx * tx;
}

// accelerating from zero velocity
export function easeInQuint(t: number) {
  return t * t * t * t * t;
}

// decelerating to zero velocity
export function easeOutQuint(t: number) {
  let tx = t;
  return 1 + --tx * tx * tx * tx * tx;
}

// acceleration until halfway, then deceleration
export function easeInOutQuint(t: number) {
  if (t < 0.5) {
    return 16 * t * t * t * t * t;
  } else {
    let tx = t;
    return 1 + 16 * --tx * tx * tx * tx * tx;
  }
}
