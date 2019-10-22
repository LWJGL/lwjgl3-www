import { ExoticComponent } from 'react';

// Fix @types/react-dom definitions for react@experimental
declare module 'react' {
  interface SuspenseConfig {
    timeoutMs: number;
    busyDelayMs?: number;
    busyMinDurationMs?: number;
  }
  export function useTransition(config?: SuspenseConfig): [(callback: () => void) => void, boolean]; // [startTransition, isPending]

  interface TimeoutConfig {
    timeoutMs: number;
  }
  export function useDeferredValue<T>(value: T, config?: TimeoutConfig): T;

  interface SuspenseListProps {
    children?: ReactNode;
  }
  export type SuspenseList = ExoticComponent<SuspenseListProps>;

  // Within the scope of the callback, mark all updates as being allowed to suspend.
  export function unstable_withSuspenseConfig(scope: () => void, config?: SuspenseConfig): void;
}
