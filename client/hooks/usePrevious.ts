import { useRef, useEffect } from 'react';

export function usePrevious(value: any) {
  const ref: React.MutableRefObject<any> = useRef(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
