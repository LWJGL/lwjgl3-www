import { useEffect } from 'react';

export function useOnClickOutside(ref: React.RefObject<HTMLElement>, handler: React.EventHandler<any>) {
  useEffect(() => {
    const listener = (ev: MouseEvent | TouchEvent) => {
      // Only run if clicking ref's element or descendent elements
      if (ev.target !== null && ref.current !== null && !ref.current.contains(ev.target as Node)) {
        handler(ev);
      }
    };

    let ownerDocument: Document | null = null;

    // See: Attaching manual event listeners in a passive effect
    // https://gist.github.com/bvaughn/fc1c3f27f1aab91c7378f2264f7c3aa1
    let timeoutID = window.setTimeout(() => {
      timeoutID = 0;
      ownerDocument = ref.current !== null ? ref.current.ownerDocument : window.document;

      // TODO: test this, we might need to use capture
      ownerDocument.addEventListener('mousedown', listener);
      ownerDocument.addEventListener('touchstart', listener);
    }, 0);

    return () => {
      if (timeoutID > 0) {
        // Don't attach handlers if we're unmounted before the timeout has run.
        // This is important! Without it, we might leak!
        clearTimeout(timeoutID);
      }

      if (ownerDocument !== null) {
        ownerDocument.removeEventListener('mousedown', listener);
        ownerDocument.removeEventListener('touchstart', listener);
      }
    };
  }, [ref, handler]);
}
