import { useLayoutEffect } from 'react';

let isSupported: -1 | 0 | 1 = -1;
let elements: WeakMap<Element, DOMRectReadOnly>;
let intersectionObservers: IntersectionObserver;
let resizeObservers: ResizeObserver;

// Fuzzy rect matching to skip some work
function eqIsh(a: number, b: number, fuzz = 1) {
  return Math.abs(a - b) <= fuzz;
}

function rectNotEQ(a: DOMRectReadOnly, b: DOMRectReadOnly, fuzz = 2) {
  return !eqIsh(a.width, b.width, fuzz) || !eqIsh(a.height, b.height, fuzz);
}

// Only call this when it's known cheap; post layout
function reserveSpace(el: Element, rect: DOMRectReadOnly) {
  const old = elements.get(el);

  // Set intrinsic size to prevent jumping.
  if (!old || rectNotEQ(old, rect)) {
    elements.set(el, rect);
    //@ts-expect-error
    (el as HTMLElement).style.containIntrinsicSize = `${rect.width}px ${rect.height}px`;
  }
}

function init() {
  elements = new WeakMap();

  // Set up observers to notify of dimension changes on
  // scroll (via IntersectionObserver) or resize
  intersectionObservers = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio > 0) {
          reserveSpace(entry.target, entry.boundingClientRect);
        }
      });
    },
    { rootMargin: '50px 0px 100px 0px' },
  );

  resizeObservers = new ResizeObserver((entries: ResizeObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.contentRect.height) {
        reserveSpace(entry.target, entry.contentRect);
      }
    });
  });
}

export function useContentVisibility(ref: React.RefObject<HTMLElement>) {
  useLayoutEffect(() => {
    if (isSupported === -1) {
      if (
        // WeakMap !== undefined &&
        // IntersectionObserver !== undefined &&
        // ResizeObserver !== undefined &&
        'CSS' in global &&
        CSS.supports('content-visibility', 'auto')
      ) {
        isSupported = 1;
        init();
      } else {
        isSupported = 0;
      }
    }
    if (isSupported < 1) {
      return;
    }
    const el = ref.current;
    if (el !== null) {
      intersectionObservers.observe(el);
      resizeObservers.observe(el);
      return () => {
        intersectionObservers.unobserve(el);
        resizeObservers.unobserve(el);
      };
    }
  }, [ref]);
}
