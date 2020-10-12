import { useCallback, useEffect, useRef, useState } from 'react';
import { styled } from '~/theme/stitches.config';
import { cc } from '~/theme/cc';
import { createFocusTrap } from 'focus-trap';
import type { FocusTrap } from 'focus-trap';
import { on, off } from '~/services/noscroll';
import { MainMenu } from './MainMenu';
import { SUPPORTS_PASSIVE_EVENTS } from '~/services/supports';
import '~/components/icons/fa/regular/bars';
import '~/components/icons/fa/regular/times';

const MenuToggleButton = styled('button', {
  height: 24,
  width: 30,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'stretch',
  padding: 0,
  border: 0,
  background: 'transparent',
  position: 'absolute',
  zIndex: 3,

  ':focus': {
    outline: 'none',
  },

  ':focus-visible': {
    span: {
      backgroundColor: 'yellow',
    },
  },

  '> :nth-child(1)': {
    transformOrigin: 'top right',
  },
  '> :nth-child(3)': {
    transformOrigin: 'bottom right',
  },
  variants: {
    open: {
      true: {
        '> :nth-child(1)': {
          transform: 'rotate(-45deg)',
        },
        '> :nth-child(2)': {
          transform: 'scale(0)',
        },
        '> :nth-child(3)': {
          transform: 'rotate(45deg)',
        },
      },
    },
  },
});

const MenuToggleLine = styled('span', {
  width: '100%',
  height: 4,
  backgroundColor: 'white',
  transition: 'transform 0.2s',
});

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
        preventScroll: true,
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
    <div ref={slidingMenu} className={cc('col', 'text-right', 'sliding-menu', { open: open })}>
      <MenuToggleButton
        open={open}
        type="button"
        onClick={onToggle}
        title={`${open ? 'Close' : 'Open'} navigation menu`}
      >
        <MenuToggleLine />
        <MenuToggleLine />
        <MenuToggleLine />
      </MenuToggleButton>
      <div className="sliding-menu-overlay" onClick={onToggle} />
      <div ref={sideContainer} className="sliding-menu-container" role="menu" aria-hidden={!open} aria-expanded={open}>
        <div className="text-right"></div>
        {open && <MainMenu onClick={onToggle} />}
      </div>
    </div>
  );
}
