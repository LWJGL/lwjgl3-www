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

// TODO: Remove this when IntersectionObserver definition is fixed
// https://github.com/facebook/flow/pull/4664
declare class IntersectionObserver {
  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverOptions): void,
  observe(target: HTMLElement): void,
  unobserve(): void,
  takeRecords(): Array<IntersectionObserverEntry>,
  disconnect(): void,
}
