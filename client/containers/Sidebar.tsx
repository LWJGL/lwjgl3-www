import { useCallback, useEffect, useRef, useState } from 'react';
import { cx } from '@emotion/css';
import createFocusTrap, { FocusTrap } from 'focus-trap';
import { on, off } from '~/services/noscroll';
import { MainMenu } from './MainMenu';
import { Icon, Menu, Close } from '~/components/icons';
import { SUPPORTS_PASSIVE_EVENTS } from '~/services/supports';

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const slidingMenu = useRef<HTMLDivElement>(null);
  const sideContainer = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const focusTrap = useRef<FocusTrap | null>(null);

  const onToggle = useCallback(() => {
    setOpen((open) => !open);
  }, []);

  useEffect(() => {
    if (slidingMenu.current !== null && closeButton.current !== null) {
      focusTrap.current = createFocusTrap(slidingMenu.current, {
        onDeactivate: onToggle,
        initialFocus: closeButton.current,
        // clickOutsideDeactivates: true
      });
    }
  }, [onToggle]);

  useEffect(() => {
    if (!open) {
      // Skip effect when closed
      return;
    }

    let touchingSideNav = false;
    let startX = 0;
    let currentX = 0;
    let sideDiv = sideContainer.current;

    function onTouchStart(evt: TouchEvent) {
      startX = evt.touches[0].pageX;
      currentX = startX;

      touchingSideNav = true;
      if (sideDiv !== null) {
        sideDiv.classList.add('touching');
      }
      requestAnimationFrame(update);
    }

    function onTouchMove(evt: TouchEvent) {
      if (touchingSideNav) {
        currentX = evt.touches[0].pageX;
        evt.preventDefault();
      }
    }

    function onTouchEnd() {
      if (touchingSideNav) {
        touchingSideNav = false;

        if (sideDiv !== null) {
          sideDiv.style.transform = '';
          sideDiv.classList.remove('touching');
        }

        if (currentX - startX > 0) {
          onToggle();
        }
      }
    }

    function update() {
      if (!touchingSideNav) {
        return;
      }

      requestAnimationFrame(update);

      let translateX = currentX - startX;

      if (translateX < 0) {
        translateX = 0;
      }

      if (sideDiv !== null) {
        sideDiv.style.transform = `translateX(${translateX}px)`;
      }
    }

    // On Open
    on();
    if (focusTrap.current !== null) {
      focusTrap.current.activate();
    }
    if (sideDiv !== null) {
      sideDiv.addEventListener('touchstart', onTouchStart, SUPPORTS_PASSIVE_EVENTS ? { passive: true } : false);
      // Disable passive to avoid triggering gestures in some devices
      sideDiv.addEventListener('touchmove', onTouchMove, SUPPORTS_PASSIVE_EVENTS ? { passive: false } : false);
      sideDiv.addEventListener('touchend', onTouchEnd, false);
    }

    return () => {
      off();
      if (focusTrap.current !== null) {
        focusTrap.current.deactivate({ onDeactivate: () => {} });
      }
      if (sideDiv !== null) {
        sideDiv.removeEventListener('touchstart', onTouchStart, false);
        sideDiv.removeEventListener('touchmove', onTouchMove, false);
        sideDiv.removeEventListener('touchend', onTouchEnd, false);
      }
    };
  }, [open, onToggle]);

  return (
    <div ref={slidingMenu} className={cx('col', 'sliding-menu', { open: open })}>
      <button
        type="button"
        className="btn btn-link sliding-menu-icon"
        onClick={onToggle}
        aria-hidden={open}
        title="Open navigation menu"
      >
        <Icon children={<Menu />} />
      </button>
      <div className="sliding-menu-overlay" onClick={onToggle} />
      <div ref={sideContainer} className="sliding-menu-container" role="menu" aria-hidden={!open} aria-expanded={open}>
        <div className="text-right">
          <button
            tabIndex={open ? 0 : -1}
            ref={closeButton}
            type="button"
            className="btn btn-link sliding-menu-icon"
            onClick={onToggle}
            title="Close navigation menu"
          >
            <Icon children={<Close />} />
          </button>
        </div>
        {open && <MainMenu onClick={onToggle} />}
      </div>
    </div>
  );
}
