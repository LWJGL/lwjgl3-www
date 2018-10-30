// @flow
import * as React from 'react';
//$FlowFixMe
import { memo, useEffect, useRef } from 'react';
import createFocusTrap from 'focus-trap';
import { on, off } from '~/services/noscroll';
import type { FocusTrap } from 'focus-trap';

type TrapProps = {
  className?: string,
  role?: string,
  children?: React.Node,
  onClose?: () => mixed,
  noScroll: boolean,
  autoFocus: boolean,
  escapeDeactivates: boolean,
  clickOutsideDeactivates: boolean,
};

let lastTrap: null | FocusTrap = null;

function TrapComponent({
  className,
  role,
  children,
  onClose,
  noScroll = true,
  autoFocus = true,
  escapeDeactivates = true,
  clickOutsideDeactivates = true,
}: TrapProps) {
  const divRef = useRef(null);
  const isMounted = useRef(null);
  const returnFocus = useRef(null);

  const focusTrap = useRef(null);
  const prevTrap = useRef(null);

  useEffect(() => {
    function findFocusable(): ?HTMLElement {
      const trap = divRef.current;
      if (autoFocus && trap !== null) {
        let el = trap.querySelector(
          '[autofocus],input:not([type="hidden"]):not([disabled]):not([readonly]),select,textarea,button,[tabindex]:not([tabindex="-1"])'
        );
        if (el !== null) {
          return el;
        }
      }
      return trap;
    }

    isMounted.current = true;
    const trap = divRef.current;
    if (trap === null) {
      return;
    }

    if (lastTrap !== null) {
      prevTrap.current = lastTrap;
      lastTrap.pause();
    }

    focusTrap.current = createFocusTrap(trap, {
      onDeactivate: onClose,
      initialFocus: findFocusable,
      escapeDeactivates: escapeDeactivates,
      clickOutsideDeactivates: clickOutsideDeactivates,
      returnFocusOnDeactivate: false,
    });

    if (noScroll) {
      on();
    }

    focusTrap.current.activate();
    lastTrap = focusTrap;

    return () => {
      isMounted.current = false;
      focusTrap.current.deactivate({ onDeactivate: false });

      if (prevTrap.current !== null) {
        prevTrap.current.unpause();
        lastTrap = prevTrap.current;
      } else {
        lastTrap = null;
      }

      if (noScroll) {
        off();
      }

      // Return focus
      if (returnFocus.current !== null) {
        try {
          returnFocus.current.focus();
        } catch (e) {}
        returnFocus.current = null;
      }
    };
  }, []);

  if (isMounted.current === null) {
    returnFocus.current = document.activeElement;
  }

  return (
    <div ref={divRef} className={className} role={role} tabIndex={-1}>
      {children}
    </div>
  );
}

export const Trap = memo(TrapComponent);
