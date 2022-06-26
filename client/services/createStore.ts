export function createStore<Store>(initialState: Store) {
  let state = initialState;
  const getState = () => state;
  const listeners = new Set<Function>();
  const setState = (fn: (state: Store) => Store) => {
    state = fn(state);
    listeners.forEach((listener) => listener());
  };
  const subscribe = (listener: Function) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  return { getState, setState, subscribe };
}
