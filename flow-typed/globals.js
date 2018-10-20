import * as React from 'react';
declare type ComponentImport = () => Promise<{ default: React.ComponentType<any> }>;

// Helper
type _ExtractReturn<B, F: (...args: any[]) => B> = B;
declare type ExtractReturn<F> = _ExtractReturn<*, F>;

// Webpack globals
declare var FLAG_PRODUCTION: boolean;
declare var FLAG_CSSMODULES: boolean;
declare var FLAG_REDUXLOGGER: boolean;
declare var HOSTNAME_PRODUCTION: string;
declare var ANALYTICS_TRACKING_ID: string;

declare var module: {
  hot: {
    accept(path: string, callback: () => void): void,
  },
};

// Google Analytics (GTAG)
declare var dataLayer: Array<any>;
declare var gtag: (...args: Array<any>) => void;

// Navigator Extras
declare class NetworkInformation {
  +downlink: number;
  +downlinkMax: number;
  +effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
  +rtt: number;
  +type: 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown';
  +saveData: boolean;
  onchange: (ev: Event) => any;
}

declare class NavigatorExtras mixins NavigatorCommon, Navigator {
  +deviceMemory?: number;
  msSaveOrOpenBlob?: (blob: Blob, name: string) => void;
  connection?: NetworkInformation;
}

declare var navigator: NavigatorExtras;
