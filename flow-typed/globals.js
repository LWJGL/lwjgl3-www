// Helper
type _ExtractReturn<B, F: (...args: any[]) => B> = B;
declare type ExtractReturn<F> = _ExtractReturn<*, F>;

// Webpack globals
declare var FLAG_PRODUCTION: boolean;
declare var FLAG_CSSMODULES: boolean;
declare var ANALYTICS_TRACKING_ID: string;

declare var module: {
  hot: {
    accept(path: string, callback: () => void): void,
  },
};
