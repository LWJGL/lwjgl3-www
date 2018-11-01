import { useRef, useEffect } from 'react';

export function usePrevious(value: any) {
  const ref: React.RefValue<any> = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
