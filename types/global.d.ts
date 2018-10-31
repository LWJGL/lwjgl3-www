// Type definitions for LWJGL

declare const FLAG_PRODUCTION: boolean;
declare const FLAG_CSSMODULES: boolean;
declare const FLAG_REDUXLOGGER: boolean;
declare const HOSTNAME_PRODUCTION: string;
declare const ANALYTICS_TRACKING_ID: string;

declare type ComponentImport = () => Promise<{ default: React.ComponentType<any> }>;
