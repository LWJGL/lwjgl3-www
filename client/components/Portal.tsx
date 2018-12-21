import React from 'react';
import { createPortal } from 'react-dom';
import { memo, useRef, useEffect } from 'react';

interface Props {
  children?: React.ReactNode;
}

/**
 * This component detaches its contents and re-attaches them to document.body (using ReactDOM.createPortal).
 * Use it when you need to circumvent DOM z-stacking (for dialogs, popovers, etc.).
 * Any class names passed to this element will be propagated to the new container element on document.body.
 */
export const Portal = memo(({ children }: Props) => {
  const targetElement: React.MutableRefObject<HTMLDivElement | null> = useRef(null);

  if (targetElement.current === null) {
    targetElement.current = document.body.appendChild(document.createElement('div'));
  }

  useEffect(() => {
    return () => {
      if (targetElement.current !== null) {
        document.body.removeChild(targetElement.current);
        targetElement.current = null;
      }
    };
  }, []);

  return createPortal(children !== undefined ? children : null, targetElement.current);
});
