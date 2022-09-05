import { useRef, useInsertionEffect, useCallback } from 'react';

// The useEvent API has not yet been added to React, so this is a temporary shim
// TODO: deprecate me when useEvent is available

export function useEvent<T extends Function>(fn: T) {
  const ref = useRef<T | null>(null);

  useInsertionEffect(() => {
    ref.current = fn;
  }, [fn]);

  return useCallback((...args: any[]) => {
    const f = ref.current;
    return f!(...args);
  }, []);
}
