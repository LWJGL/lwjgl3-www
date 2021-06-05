import * as react from 'react';

declare const UNDEFINED_VOID_ONLY: unique symbol;
type VoidOrUndefinedOnly = void | { [UNDEFINED_VOID_ONLY]: never };

declare module 'react' {
  export interface SuspenseProps {
    unstable_expectedLoadTime?: number;
  }

  export type SuspenseListRevealOrder = 'forwards' | 'backwards' | 'together';
  export type SuspenseListTailMode = 'collapsed' | 'hidden';

  export interface SuspenseListCommonProps {
    children: ReactElement | Iterable<ReactElement>;
  }

  interface DirectionalSuspenseListProps extends SuspenseListCommonProps {
    revealOrder: 'forwards' | 'backwards';
    tail?: SuspenseListTailMode;
  }

  interface NonDirectionalSuspenseListProps extends SuspenseListCommonProps {
    revealOrder?: Exclude<SuspenseListRevealOrder, DirectionalSuspenseListProps['revealOrder']>;
    tail?: never;
  }

  export type SuspenseListProps = DirectionalSuspenseListProps | NonDirectionalSuspenseListProps;
  export const SuspenseList: ExoticComponent<SuspenseListProps>;

  export type TransitionFunction = () => VoidOrUndefinedOnly;
  export interface TransitionStartFunction {
    (callback: TransitionFunction): void;
  }

  export function useDeferredValue<T>(value: T): T;

  const opaqueIdentifierBranding: unique symbol;
  type OpaqueIdentifier = string & {
    readonly [opaqueIdentifierBranding]: unknown;
  };

  export function unstable_useOpaqueIdentifier(): OpaqueIdentifier;

  export function useTransition(config?: SuspenseConfig | null): [boolean, TransitionStartFunction];
  export function startTransition(scope: TransitionFunction): void;

  export function unstable_getCacheForType<T>(resourceType: () => T): T;
  export function unstable_useCacheRefresh(): <T>(resourceType?: () => T, type?: T) => void;
  export const unstable_Cache: FunctionComponent;
  export const unstable_DebugTracingMode: FunctionComponent;
  export const unstable_LegacyHidden: FunctionComponent;

  export interface OffscreenProps {
    mode?: 'hidden' | 'unstable-defer-without-hiding' | 'visible';
  }
  export const unstable_Offscreen: FunctionComponent<OffscreenProps>;
}
