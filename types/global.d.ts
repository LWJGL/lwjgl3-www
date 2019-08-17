// Helpers

declare interface CSSModule {
  use: () => void;
  unuse: () => void;
}

// DOM API extensions (stuff missing from lib.dom.d.ts, usually experimental)

declare class NetworkInformation {
  readonly downlink: number;
  readonly downlinkMax: number;
  readonly effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
  readonly rtt: number;
  readonly type: 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown';
  readonly saveData: boolean;
  onchange: (ev: Event) => void;
}

interface Navigator {
  readonly deviceMemory?: number;
  readonly connection?: NetworkInformation;
}

interface BlobPropertyBag {
  endings?: 'transparent' | 'native';
}

interface HTMLImageElement {
  loading?: 'auto' | 'lazy' | 'eager';
}

// Code-split components

declare type ComponentImport = () => Promise<{ default: React.ComponentType<any> }>;

// Type definitions for LWJGL

declare const FLAG_PRODUCTION: boolean;
declare const FLAG_CSSMODULES: boolean;
declare const HOSTNAME_PRODUCTION: string;
declare const ANALYTICS_TRACKING_ID: string;
