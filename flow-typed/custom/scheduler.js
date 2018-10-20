declare module 'scheduler' {
  declare export var unstable_ImmediatePriority: 1;
  declare export var unstable_UserBlockingPriority: 2;
  declare export var unstable_NormalPriority: 3;
  declare export var unstable_IdlePriority: 4;

  declare export type PriorityLevel =
    | typeof unstable_ImmediatePriority
    | typeof unstable_UserBlockingPriority
    | typeof unstable_NormalPriority
    | typeof unstable_IdlePriority;

  declare type CallbackNode<F> = {
    callback: F,
    priorityLevel: PriorityLevel,
    expirationTime: number,
    next: null | CallbackNode<any>,
    previous: null | CallbackNode<any>,
  };

  declare export function unstable_runWithPriority<V>(priorityLevel: PriorityLevel, eventHandler: () => V): V;
  declare export function unstable_scheduleCallback<F>(callback: F): CallbackNode<F>;
  declare export function unstable_cancelCallback(callbackNode: CallbackNode<any>): void;
  declare export function unstable_wrapCallback(callback: Function): Function;
  declare export function unstable_getCurrentPriorityLevel(): PriorityLevel;
  declare export function unstable_now(): number;
}
