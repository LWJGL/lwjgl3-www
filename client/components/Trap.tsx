import React, { useEffect, useRef } from 'react';
import createFocusTrap, { FocusTrap } from 'focus-trap';
import { on, off } from '~/services/noscroll';

interface Props {
  className?: string;
  role?: string;
  onClose?: React.EventHandler<any>;
  noScroll?: boolean;
  autoFocus?: boolean;
  escapeDeactivates?: boolean;
  clickOutsideDeactivates?: boolean;
}

let lastTrap: null | FocusTrap = null;

export const Trap: React.FC<Props> = ({
  className,
  role,
  children,
  onClose,
  noScroll = true,
  autoFocus = true,
  escapeDeactivates = true,
  clickOutsideDeactivates = true,
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef<boolean>(false);
  const returnFocus = useRef<HTMLElement | null>(null);

  const focusTrap = useRef<FocusTrap | null>(null);
  const prevTrap = useRef<FocusTrap | null>(null);

  useEffect(() => {
    function findFocusable(): HTMLElement | null {
      const trap = divRef.current;
      if (autoFocus && trap !== null) {
        let el = trap.querySelector<HTMLElement>(
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
      onDeactivate: onClose as () => void,
      initialFocus: findFocusable,
      escapeDeactivates,
      clickOutsideDeactivates,
      returnFocusOnDeactivate: false,
    });

    if (noScroll) {
      on();
    }

    focusTrap.current.activate();
    lastTrap = focusTrap.current;

    return () => {
      isMounted.current = false;
      if (focusTrap.current !== null) {
        focusTrap.current.deactivate({ onDeactivate: false });
      }

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
  }, [autoFocus, clickOutsideDeactivates, escapeDeactivates, noScroll, onClose]);

  if (!isMounted.current) {
    returnFocus.current = document.activeElement as HTMLElement;
  }

  return (
    <div ref={divRef} className={className} role={role} tabIndex={-1}>
      {children}
    </div>
  );
};
