// Passive Event Listeners
let supportsPassive: boolean = false;

try {
  let opts = Object.defineProperty({}, 'passive', {
    get: function () {
      supportsPassive = true;
    },
  });
  let emptyFn = () => {};
  window.addEventListener('test', emptyFn, opts);
  window.removeEventListener('test', emptyFn, opts);
} catch (ignore) {}

export const SUPPORTS_PASSIVE_EVENTS = supportsPassive;

// Loading Property in images
export const SUPPORTS_IMG_LOADING: boolean = 'loading' in HTMLImageElement.prototype;

// Observers
export const SUPPORTS_INTERSECTION_OBSERVER: boolean = 'IntersectionObserver' in window;
export const SUPPORTS_RESIZE_OBSERVER: boolean = 'ResizeObserver' in window;

// Touch

// export const supportsTouch = navigator.maxTouchPoints > 1;
