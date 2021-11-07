import { useRef, useEffect } from 'react';

export function usePrevious<T>(value: T, initial: T | null = null) {
  const ref = useRef<T | null>(initial);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
