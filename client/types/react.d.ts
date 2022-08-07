import 'react';

declare module 'react' {
  // Unstable Suspense cache API
  export function unstable_getCacheForType<T>(resourceType: () => T): T;
  export function unstable_useCacheRefresh(): () => void;

  // Unstable Offscreen API
  export const unstable_Offscreen: ComponentClass<
    {
      children: ReactNode;
      mode: 'hidden' | 'visible';
    },
    any
  >;
}
