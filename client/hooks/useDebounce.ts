import { useState, useEffect, useRef } from 'react';

export function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const handler: React.MutableRefObject<number | undefined> = useRef(undefined);

  useEffect(
    () => {
      handler.current = window.setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        window.clearTimeout(handler.current);
      };
    },
    [value, delay]
  );

  return debouncedValue;
}
