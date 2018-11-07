import { useRef, useEffect } from 'react';

export function usePrevious<T>(value: T) {
  const ref: React.MutableRefObject<T | null> = useRef<T>(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
