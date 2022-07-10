declare const UNDEFINED_VOID_ONLY: unique symbol;
type Destructor = () => void | { [UNDEFINED_VOID_ONLY]: never };
type StateSetter<T> = (fn: (state: T) => T) => void;
type Initiator<T> = (fn: StateSetter<T>) => void | Destructor;

export function createStore<Store>(initialState: Store, lazySubscribe?: Initiator<Store>) {
  let state = initialState;
  let unsubscribe: void | Destructor;

  const getState = () => state;

  const listeners = new Set<Function>();

  const setState: StateSetter<Store> = (fn) => {
    state = fn(state);
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener: Function) => {
    listeners.add(listener);

    if (listeners.size === 1 && lazySubscribe != null) {
      unsubscribe = lazySubscribe(setState);
    }

    return () => {
      listeners.delete(listener);
      if (listeners.size === 0 && unsubscribe != null) {
        unsubscribe();
        unsubscribe = undefined;
      }
    };
  };

  return { getState, setState, subscribe };
}
