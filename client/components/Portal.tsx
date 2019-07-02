import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * This component detaches its contents and re-attaches them to document.body (using ReactDOM.createPortal).
 * Use it when you need to circumvent DOM z-stacking (for dialogs, popovers, etc.).
 */
export const Portal: React.FC = ({ children }) => {
  const targetElement = useRef<HTMLDivElement | null>(null);

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
};
