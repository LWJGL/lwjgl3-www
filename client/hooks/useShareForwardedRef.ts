import { useRef, useEffect } from 'react';

export function useShareForwardedRef<T>(forwardedRef: React.Ref<T>) {
  // final ref that will share value with forward ref. this is the one we will attach to components
  const innerRef = useRef<T>(null);

  useEffect(() => {
    // after every render - try to share current ref value with forwarded ref
    if (!forwardedRef) {
      return;
    }
    if (typeof forwardedRef === 'function') {
      forwardedRef(innerRef.current);
      return;
    } else {
      // by default forwardedRef.current is readonly. Let's ignore it
      // @ts-expect-error
      forwardedRef.current = innerRef.current;
    }
  });

  return innerRef;
}
