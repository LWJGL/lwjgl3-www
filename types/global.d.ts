// Webpack

declare interface CSSModule {
  use: () => void;
  unuse: () => void;
}

// React Helpers

declare type FCC<Props = unknown> = React.FunctionComponent<React.PropsWithChildren<Props>>;

// Type definitions for LWJGL

declare const FLAG_PRODUCTION: boolean;
declare const FLAG_CSSMODULES: boolean;
declare const HOSTNAME_PRODUCTION: string;
declare const ANALYTICS_TRACKING_ID: string;
