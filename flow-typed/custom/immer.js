declare module 'immer' {
  declare export function setAutoFreeze(enableAutoFreeze: boolean): void;
  declare export default function produce<T>(baseState: T, thunk: (draftState: T) => void): T;
}
