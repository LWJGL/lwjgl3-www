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

// export const SUPPORTS_CSS_SUPPORTS: boolean = 'CSS' in window && typeof CSS.supports === 'function';
// export const SUPPORTS_CUSTOM_PROPERTIES: boolean = CSS.supports('color', 'var(--a)');
// export const SUPPORTS_IMAGE_SET: boolean = CSS.supports('background-image', 'image-set(url("a") 1x, url("b") 2x)');
// export const SUPPORTS_WEBKIT_IMAGE_SET: boolean = CSS.supports(
//   'background-image',
//   '-webkit-image-set(url("a") 1x, url("b") 2x)'
// );
