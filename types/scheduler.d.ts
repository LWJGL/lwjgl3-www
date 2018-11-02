declare module 'scheduler' {
  export var unstable_ImmediatePriority: 1;
  export var unstable_UserBlockingPriority: 2;
  export var unstable_NormalPriority: 3;
  export var unstable_IdlePriority: 4;

  export type PriorityLevel =
    | typeof unstable_ImmediatePriority
    | typeof unstable_UserBlockingPriority
    | typeof unstable_NormalPriority
    | typeof unstable_IdlePriority;

  interface CallbackNode<F> {
    callback: F;
    priorityLevel: PriorityLevel;
    expirationTime: number;
    next: null | CallbackNode<any>;
    previous: null | CallbackNode<any>;
  }

  export function unstable_runWithPriority<V>(priorityLevel: PriorityLevel, eventHandler: () => V): V;
  export function unstable_scheduleCallback<F>(callback: F): CallbackNode<F>;
  export function unstable_cancelCallback(callbackNode: CallbackNode<any>): void;
  export function unstable_wrapCallback(callback: Function): Function;
  export function unstable_getCurrentPriorityLevel(): PriorityLevel;
  export function unstable_now(): number;
}
