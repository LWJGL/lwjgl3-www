// Webpack

declare interface CSSModule {
  use: () => void;
  unuse: () => void;
}

// Fix TS Global Polution
// e.g. deps referencing @types/node, pollutes global environment
// explainer here: https://gist.github.com/RyanCavanaugh/702ebd1ca2fc060e58e634b4e30c1c1c

declare namespace NodeJS {
  type Timeout = number;
  type Timer = number;
}

// React Helpers

declare type FC<Props = unknown> = React.FunctionComponent<Props>;
declare type FCC<Props = unknown> = React.FunctionComponent<React.PropsWithChildren<Props>>;

// Type definitions for LWJGL

declare const FLAG_PRODUCTION: boolean;
declare const FLAG_CSSMODULES: boolean;
declare const HOSTNAME_PRODUCTION: string;
declare const ANALYTICS_TRACKING_ID: string;
