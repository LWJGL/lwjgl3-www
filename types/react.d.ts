import * as react from 'react';

// Declare missing types for @types/react/experimental
declare module 'react' {
  export function unstable_useOpaqueIdentifier(): string;
  export function unstable_getCacheForType<T>(resourceType: () => T): T;
  export function unstable_useCacheRefresh(): <T>(resourceType?: () => T, type?: T) => void;
  export const unstable_Cache: React.FC;
}
