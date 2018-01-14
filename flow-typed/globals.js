// Helper
type _ExtractReturn<B, F: (...args: any[]) => B> = B;
declare type ExtractReturn<F> = _ExtractReturn<*, F>;

// Webpack globals
declare var NOHMR: boolean;
declare var CSSMODULES: boolean;
declare var ASYNC_ROUTES: boolean;
declare var HOSTNAME: string;
declare var ANALYTICS_TRACKING_ID: string;

declare var module: {
  hot: {
    accept(path: string, callback: () => void): void,
  },
};
