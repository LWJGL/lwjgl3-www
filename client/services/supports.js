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

export const SupportsPassiveEvents = supportsPassive;

// Intersection Observers

export const SupportsIntersectionObserver: boolean =
  typeof window !== 'undefined' && window.IntersectionObserver !== undefined;
