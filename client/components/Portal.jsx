// @flow
import * as React from 'react';
//$FlowFixMe
import { memo, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

type Props = {
  children?: React.Node,
};

/**
 * This component detaches its contents and re-attaches them to document.body (using ReactDOM.createPortal).
 * Use it when you need to circumvent DOM z-stacking (for dialogs, popovers, etc.).
 * Any class names passed to this element will be propagated to the new container element on document.body.
 */
export const Portal = React.memo(({ children }: Props) => {
  const targetElement = useRef(null);

  if (targetElement.current === null) {
    //$FlowFixMe
    targetElement.current = document.body.appendChild(document.createElement('div'));
  }

  useEffect(() => {
    return () => {
      if (targetElement.current !== null) {
        //$FlowFixMe
        document.body.removeChild(targetElement.current);
        targetElement.current = null;
      }
    };
  }, []);

  return ReactDOM.createPortal(children !== undefined ? children : null, targetElement.current);
});
