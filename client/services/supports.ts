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

// https://twitter.com/mathias/status/1278208408857051136
export function supportsMediaQuery(query: string): boolean {
  return matchMedia(`(${query})`).media != 'not all';
}

export function supportsScriptType(type: 'module' | 'classic' | 'importmap' | 'speculationrules'): -1 | 0 | 1 {
  if (typeof HTMLScriptElement.supports === 'undefined') {
    return -1;
  }

  return HTMLScriptElement.supports(type) ? 1 : 0;
}
