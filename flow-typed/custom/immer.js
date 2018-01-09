declare module 'immer' {
  declare export function setAutoFreeze(enableAutoFreeze: boolean): void;
  declare export default function produce<T>(baseState: T, thunk: (draftState: T) => void): T;
}

declare module 'immer/es5' {
  declare export function setAutoFreeze(enableAutoFreeze: boolean): void;
  declare export default function produce<T>(baseState: T, thunk: (draftState: T) => void): T;
}
