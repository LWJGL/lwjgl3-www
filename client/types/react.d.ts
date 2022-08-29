import 'react';

declare module 'react' {
  // use() hook
  // The subset of a Thenable required by things thrown by Suspense.
  // This doesn't require a value to be passed to either handler.
  export interface Wakeable {
    then(onFulfill: () => any, onReject: () => any): void | Wakeable;
  }
  // The subset of a Promise that React APIs rely on. This resolves a value.
  // This doesn't require a return value neither from the handler nor the
  // then function.
  interface ThenableImpl<T> {
    then(onFulfill: (value: T) => any, onReject: (error: any) => any): void | Wakeable;
  }
  interface UntrackedThenable<T> extends ThenableImpl<T> {
    status?: void;
  }
  export interface PendingThenable<T> extends ThenableImpl<T> {
    status: 'pending';
  }
  export interface FulfilledThenable<T> extends ThenableImpl<T> {
    status: 'fulfilled';
    value: T;
  }
  export interface RejectedThenable<T> extends ThenableImpl<T> {
    status: 'rejected';
    reason: mixed;
  }
  export type Thenable<T> = UntrackedThenable<T> | PendingThenable<T> | FulfilledThenable<T> | RejectedThenable<T>;
  type Usable<T> = Thenable<T>;
  export function experimental_use<T>(usable: Usable<T>): T;

  // Unstable Suspense cache API
  export function unstable_getCacheForType<T>(resourceType: () => T): T;
  export function unstable_useCacheRefresh(): () => void;

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
