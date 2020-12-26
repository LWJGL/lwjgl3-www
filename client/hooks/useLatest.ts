import { useRef, useLayoutEffect } from 'react';

export function useLatest<T>(val: T): React.RefObject<T> {
  const ref = useRef<T>(val);

  useLayoutEffect(() => {
    ref.current = val;
  }, [val]);

  return ref;
}
