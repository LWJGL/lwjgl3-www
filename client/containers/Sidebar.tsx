import { useCallback, useEffect, useRef, useState } from 'react';
import { styled } from '~/theme/stitches.config';
import { MainMenu } from './MainMenu';
import { ZINDEX_MODAL_BACKDROP } from '~/theme';
import { SUPPORTS_PASSIVE_EVENTS } from '~/services/supports';
import { FocusScope } from '@react-aria/focus';
import { OverlayContainer, useOverlay, usePreventScroll, useModal } from '@react-aria/overlays';
import '~/components/icons/fa/regular/bars';
import '~/components/icons/fa/regular/times';

const MenuToggleButton = styled('button', {
  marginLeft: 'auto',
  height: 24,
  width: 30,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'stretch',
  padding: 0,
  border: 0,
  background: 'transparent',
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
  pointerEvents: 'none',
});

const Backdrop = styled('div', {
  // backdropFilter: 'blur(3px)',
  willChange: 'background-color',
  transition: 'background-color 0.3s cubic-bezier(0, 0, 0.3, 1)',
  variants: {
    open: {
      true: {
        position: 'fixed',
        zIndex: ZINDEX_MODAL_BACKDROP - 3,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.55)',
      },
    },
  },
});

const MenuOverlay = styled('div', {
  padding: '4rem 1rem 0 1rem',
  backgroundColor: 'black',
  zIndex: ZINDEX_MODAL_BACKDROP - 2,
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  maxWidth: 320,
  minWidth: 260,
  overflowX: 'hidden',
  overflowY: 'auto',
  '-webkit-overflow-scrolling': 'touch',
  overscrollBehavior: 'contain',
  willChange: 'transform',
  transform: 'translateX(102%) translate3d(0, 0, 0)',
  transition: 'transform 0.3s cubic-bezier(0, 0, 0.3, 1)',
  // pointerEvents: 'none',

  '&.touching': {
    transition: 'none',
  },

  variants: {
    open: {
      true: {
        pointerEvents: 'auto',
        transform: 'none',
      },
    },
  },
});

export const Sidebar: React.FC<{ children?: never }> = () => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const onToggle = useCallback(() => {
    setOpen((open) => !open);
  }, []);

  // @react-aria
  usePreventScroll({ isDisabled: !open });

  const { overlayProps } = useOverlay(
    {
      isOpen: open,
      onClose: onToggle,
      isDismissable: true,
      shouldCloseOnInteractOutside: (el) => {
        return el !== buttonRef.current && el !== backdropRef.current;
      },
    },
    overlayRef
  );

  useEffect(() => {
    if (!open) {
      // Skip effect when closed
      return;
    }

    let touchingSideNav = false;
    let startX = 0;
    let currentX = 0;
    let sideDiv = overlayRef.current;

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
    if (sideDiv !== null) {
      sideDiv.addEventListener('touchstart', onTouchStart, SUPPORTS_PASSIVE_EVENTS ? { passive: true } : false);
      // Disable passive to avoid triggering gestures in some devices
      sideDiv.addEventListener('touchmove', onTouchMove, SUPPORTS_PASSIVE_EVENTS ? { passive: false } : false);
      sideDiv.addEventListener('touchend', onTouchEnd, false);
    }

    // Auto-focus current active link
    if (overlayRef.current !== null) {
      const activeLink = overlayRef.current.querySelector('.active') as HTMLAnchorElement | null;
      if (activeLink !== null) {
        activeLink.focus();
      }
    }

    return () => {
      if (sideDiv !== null) {
        sideDiv.removeEventListener('touchstart', onTouchStart, false);
        sideDiv.removeEventListener('touchmove', onTouchMove, false);
        sideDiv.removeEventListener('touchend', onTouchEnd, false);
      }
    };
  }, [open, onToggle]);

  // * Do not use <Portal> for menu because focus trap must
  // * contain toggle button and the menu under the same tree

  return (
    <>
      <MenuToggleButton
        type="button"
        ref={buttonRef}
        onClick={onToggle}
        title={`${open ? 'Close' : 'Open'} navigation menu`}
        open={open}
      >
        <MenuToggleLine />
        <MenuToggleLine />
        <MenuToggleLine />
      </MenuToggleButton>

      <OverlayContainer>
        <Backdrop ref={backdropRef} open={open} onClick={onToggle} />
        <MenuOverlay
          open={open}
          role="menu"
          ref={overlayRef}
          aria-hidden={!open}
          aria-expanded={open}
          {...overlayProps}
        >
          {open && (
            <FocusScope contain={open} restoreFocus>
              <Modal>
                <MainMenu vertical onClick={onToggle} />
              </Modal>
            </FocusScope>
          )}
        </MenuOverlay>
      </OverlayContainer>
    </>
  );
};

const Modal: React.FC<{}> = ({ children }) => {
  const { modalProps } = useModal();
  return <div {...modalProps}>{children}</div>;
};
