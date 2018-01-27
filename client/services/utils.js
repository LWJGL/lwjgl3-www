// @flow
/**
 * Returns true if testElement is element or is contained within it
 */
export function elementIsOrContains(element: HTMLElement, testElement: HTMLElement) {
  return element === testElement || element.contains(testElement);
}

/**
 * Returns the difference in length between two arrays. A `null` argument is considered an empty list.
 * The return value will be positive if `a` is longer than `b`, negative if the opposite is true,
 * and zero if their lengths are equal.
 */
export function arrayLengthCompare(a: Array<any> = [], b: Array<any> = []) {
  return a.length - b.length;
}

/**
 * Returns true if the two numbers are within the given tolerance of each other.
 * This is useful to correct for floating point precision issues, less useful for integers.
 */
export function approxEqual(a: number, b: number, tolerance: number = 0.00001) {
  return Math.abs(a - b) <= tolerance;
}

/** Clamps the given number between min and max values. Returns value if within range, or closest bound. */
export function clamp(val: number, min: number, max: number) {
  if (process.env.NODE_ENV === 'development' && max < min) {
    throw new Error('min > max');
  }
  return Math.min(Math.max(val, min), max);
}

/** Returns the number of decimal places in the given number. */
export function countDecimalPlaces(num: number) {
  if (typeof num !== 'number' || Math.floor(num) === num) {
    return 0;
  }
  return num.toString().split('.')[1].length;
}
