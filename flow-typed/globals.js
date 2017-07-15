// Webpack globals
declare var NOHMR: boolean;
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
