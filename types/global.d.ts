// Helpers

declare interface CSSModule {
  use: () => void;
  unuse: () => void;
}

// DOM API extensions (stuff missing from lib.dom.d.ts, usually experimental)

// https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API
declare class NetworkInformation {
  readonly downlink: number;
  // readonly downlinkMax: number; // Only supported in ChromeOS
  readonly effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
  readonly rtt: number;
  // readonly type: 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown'; // Only supported in ChromeOS
  readonly saveData: boolean;
  // ontypechange: (ev: Event) => void;
  addEventListener: (type: 'change', listener: (this: NetworkInformation, ev: Event) => any) => void;
  removeEventListener: (type: 'change', listener: (this: NetworkInformation, ev: Event) => any) => void;
  onchange: (this: NetworkInformation, ev: Event) => void;
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
declare const FLAG_HMR: boolean;
declare const HOSTNAME_PRODUCTION: string;
declare const ANALYTICS_TRACKING_ID: string;
