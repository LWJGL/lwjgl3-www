// Webpack globals
declare var NOHMR: boolean;
declare var CSSMODULES: boolean;
declare var ASYNC_ROUTES: boolean;
declare var HOSTNAME: string;
declare var ANALYTICS_TRACKING_ID: string;
declare var webpackManifest: {
  [chunkId: string]: string,
};

declare var module: {
  hot: {
    accept(path: string, callback: () => void): void,
  },
};

// TODO: Remove this when Flow adds support
declare var Intl: {
  NumberFormat: Function,
};

// TODO: Remove this when Flow adds support
declare class DOMRectReadOnly {
  x: number,
  y: number,
  width: number,
  height: number,
  top: number,
  right: number,
  bottom: number,
  left: number,
  constructor(x: number, y: number, width: number, height: number): void,
  static fromRect(rectangle?: { x?: number, y?: number, width?: number, height?: number }): DOMRect,
}

declare class DOMRect extends DOMRectReadOnly {
  constructor(x: number, y: number, width: number, height: number): void,
}

// https://www.w3.org/TR/hr-time-2/#dom-domhighrestimestamp
// https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp
declare type DOMHighResTimeStamp = number;

declare type IntersectionObserverEntry = {
  boundingClientRect: DOMRectReadOnly,
  intersectionRatio: number,
  intersectionRect: DOMRectReadOnly,
  isIntersecting: boolean,
  rootBounds: DOMRectReadOnly,
  target: HTMLElement,
  time: DOMHighResTimeStamp,
};

declare type IntersectionObserverCallback = (
  entries: Array<IntersectionObserverEntry>,
  observer: IntersectionObserver
) => any;

declare type IntersectionObserverOptions = {
  root?: Node | null,
  rootMargin?: string,
  threshold?: number | Array<number>,
};

declare class IntersectionObserver {
  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverOptions): void,
  observe(target: HTMLElement): void,
  unobserve(): void,
  takeRecords(): Array<IntersectionObserverEntry>,
  disconnect(): void,
}
