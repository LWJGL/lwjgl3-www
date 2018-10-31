// @flow

// Passive Event Listeners

let supportsPassive: boolean = false;

try {
  // $FlowFixMe
  let opts = Object.defineProperty({}, 'passive', {
    get: function() {
      supportsPassive = true;
    },
  });
  window.addEventListener('test', null, opts);
} catch (ignore) {}

export const SUPPORTS_PASSIVE_EVENTS = supportsPassive;

// Intersection Observers

export const SUPPORTS_INTERSECTION_OBSERVER: boolean =
  typeof window !== 'undefined' && window.IntersectionObserver !== undefined;

// Touch

// export const supportsTouch = navigator.maxTouchPoints > 1;
