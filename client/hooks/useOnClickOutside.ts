import { useEffect } from 'react';

export function useOnClickOutside(ref: React.RefObject<HTMLElement>, handler: React.EventHandler<any>) {
  useEffect(() => {
    const listener = (ev: MouseEvent | TouchEvent) => {
      // Only run if clicking ref's element or descendent elements
      if (ev.target !== null && ref.current !== null && !ref.current.contains(ev.target as Node)) {
        handler(ev);
      }
    };

    // TODO: test this, we might need to use capture
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
