// Passive Event Listeners
let supportsPassive: boolean = false;

try {
  let opts = Object.defineProperty({}, 'passive', {
    get: function() {
      supportsPassive = true;
    },
  });
  window.addEventListener('test', () => {}, opts);
} catch (ignore) {}

export const SUPPORTS_PASSIVE_EVENTS = supportsPassive;

// Loading Property in images
export const SUPPORTS_IMG_LOADING: boolean = 'loading' in HTMLImageElement.prototype;

// Observers
export const SUPPORTS_INTERSECTION_OBSERVER: boolean = 'IntersectionObserver' in window;

// Touch

// export const supportsTouch = navigator.maxTouchPoints > 1;
