type Init<Args extends any[]> = (emit: Emit<Args>) => Cleanup;
type Emit<Args extends any[]> = (...args: Args) => void;
type Cleanup = () => void;
type Subscriber<Args extends any[]> = (...args: Args) => void;

/*
  USAGE:

  let windowClicks = createLazyEmitter((emit) => {
    console.log('started');

    function onClick() {
      emit('arg1', 'arg2');
    }

    addEventListener('click', onClick);
    return () => {
      removeEventListener('click', onClick);
      console.log('stopped');
    };
  });

  let unsubscribe1 = windowClicks((arg1, arg2) => {
    ...
  });
  // logs: "started"
  let unsubscribe2 = windowClicks((arg1, arg2) => {
    ...
  });

  unsubscribe1();
  unsubscribe2();
  // logs: "stopped"
*/

export function createLazyEmitter<Args extends any[]>(init: Init<Args>) {
  const subscribers = new Set<Subscriber<Args>>();
  let cleanup: Cleanup | 0 = 0;

  const emit = (...args: Args) => {
    subscribers.forEach((subscriber) => subscriber(...args));
  };

  const subscribe = (subscriber: Subscriber<Args>) => {
    subscribers.add(subscriber);

    if (cleanup === 0) {
      cleanup = init(emit);
    }

    return () => {
      subscribers.delete(subscriber);

      if (subscribers.size === 0) {
        (cleanup as Cleanup)();
        cleanup = 0;
      }
    };
  };

  return subscribe;
}
