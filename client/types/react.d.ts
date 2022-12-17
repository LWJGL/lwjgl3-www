import 'react';

declare module 'react' {
  // Unstable Suspense cache API
  export function unstable_getCacheForType<T>(resourceType: () => T): T;

  // Unstable Offscreen API
  export type OffscreenMode = 'hidden' | 'unstable-defer-without-hiding' | 'visible';
  export const unstable_Offscreen: ComponentClass<
    {
      children: ReactNode;
      mode: OffscreenMode;
    },
    any
  >;
}
