declare module 'immer' {
  declare export default function immer<T>(baseState: T, thunk: (draftState: T) => void): T;
}
