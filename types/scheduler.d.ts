// Type definitions for scheduler 0.16.1
declare module 'scheduler' {
  export type FrameCallbackType = () => FrameCallbackType | void;
  export interface CallbackNode {
    callback: FrameCallbackType;
    priorityLevel: number;
    expirationTime: number;
    next: CallbackNode | null;
    prev: CallbackNode | null;
  }

  export const unstable_ImmediatePriority = 1;
  export const unstable_UserBlockingPriority = 2;
  export const unstable_NormalPriority = 3;
  export const unstable_IdlePriority = 5;
  export const unstable_LowPriority = 4;
  export type PriorityLevels = 1 | 2 | 3 | 4 | 5;
  export function unstable_runWithPriority<T>(priorityLevel: number, eventHandler: () => T): T | undefined;
  export function unstable_next<T>(eventHandler: () => T): T | undefined;
  export function unstable_scheduleCallback(priorityLevel: number, callback: FrameCallbackType): CallbackNode;
  export function unstable_cancelCallback(callbackNode: CallbackNode): void;
  export function unstable_wrapCallback(callback: FrameCallbackType): () => FrameCallbackType | undefined;
  export function unstable_getCurrentPriorityLevel(): number;
  export function unstable_shouldYield(): boolean;
  export function unstable_requestPaint(): boolean;
  export function unstable_continueExecution(): void;
  export function unstable_pauseExecution(): void;
  export function unstable_getFirstCallbackNode(): CallbackNode | null;
  export function unstable_now(): number;
  export function unstable_forceFrameRate(fps: number): void;
}
