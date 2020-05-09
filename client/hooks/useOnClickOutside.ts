import { useEffect } from 'react';

export function useOnClickOutside(ref: React.RefObject<HTMLElement>, handler: React.EventHandler<any>) {
  useEffect(() => {
    const listener = (ev: MouseEvent | TouchEvent) => {
      // Do nothing if clicking ref's element or descendent elements
      if (ev.target === null || ref.current === null || ref.current.contains(ev.target as Node)) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
