type ConnectionType = 'bluetooth' | 'cellular' | 'ethernet' | 'mixed' | 'none' | 'other' | 'unknown' | 'wifi';
type EffectiveConnectionType = '2g' | '3g' | '4g' | 'slow-2g';

declare interface NetworkInformation extends EventTarget {
  readonly type: ConnectionType;
  readonly effectiveType: EffectiveConnectionType;
  readonly downlink: number;
  readonly downlinkMax: number;
  readonly saveData: boolean;
}
