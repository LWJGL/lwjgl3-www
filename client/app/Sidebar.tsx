import { useCallback, useEffect, useRef, useState } from 'react';
import { OverlayContainer, useOverlay, usePreventScroll, useModal } from '@react-aria/overlays';
import { FocusScope } from '@react-aria/focus';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from 'react-use-gesture';
import { styled } from '~/theme/stitches.config';
import { MainMenu } from './MainMenu';
import { ZINDEX_MODAL_BACKDROP } from '~/theme';
import { Backdrop, getBackdropOpacity } from '~/components/layout/Backdrop';

const MenuArea = styled('div', {
  flex: '1 0 auto',
});

const MenuToggleButton = styled('button', {
  ml: 'auto',
  height: 24,
  width: 30,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'stretch',
  padding: 0,
  border: 0,
  background: 'transparent',
  '&:focus': {
    outline: 'none',
  },
  '&:focus-visible': {
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
});

const MenuToggleLine = styled('span', {
  width: '100%',
  height: 4,
  backgroundColor: '$white',
  willChange: 'transform',
  pointerEvents: 'none',
});

const MENU_WIDTH = 260;
const MENU_INITIAL = MENU_WIDTH + 1;

const MenuOverlay = styled('div', {
  padding: '4rem 1rem 0 1rem',
  backgroundColor: '$dark',
  '.dark &': {
    backgroundColor: '$darker',
  },
  zIndex: ZINDEX_MODAL_BACKDROP - 2,
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  width: MENU_WIDTH,
  // maxWidth: 320,
  // minWidth: 260,
  overflowX: 'hidden',
  overflowY: 'auto',
  '-webkit-overflow-scrolling': 'touch',
  'touch-action': 'pan-y',
  overscrollBehavior: 'contain',
  willChange: 'transform',
  transform: `translate3d(${MENU_INITIAL}px, 0, 0)`,
  pointerEvents: 'none',

  variants: {
    open: {
      true: {
        pointerEvents: 'auto',
      },
    },
  },
});

const toggle = (state: boolean) => !state;
// const clamp = (perc: number) => Math.min(perc, 1);
const transformLine1 = (perc: number) => (perc > 0 ? `rotate(${perc * -45}deg)` : 'none');
const transformLine2 = (perc: number) => (perc > 0 ? `scale(${1 - perc})` : 'none');
const transformLine3 = (perc: number) => (perc > 0 ? `rotate(${perc * 45}deg)` : 'none');

export const Sidebar: React.FC<{ children?: never }> = () => {
  const [isOpen, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const toggleOpen = useCallback(() => {
    setOpen(toggle);
  }, []);

  // @react-aria
  usePreventScroll({ isDisabled: !isOpen });
  const { modalProps } = useModal();
  const { overlayProps } = useOverlay(
    {
      isOpen: isOpen,
      onClose: toggleOpen,
      isDismissable: true,
      shouldCloseOnInteractOutside: (el) => {
        return el !== buttonRef.current && el !== backdropRef.current;
      },
    },
    overlayRef
  );

  // Animation
  const [{ x, perc }, animate] = useSpring(
    {
      x: MENU_INITIAL,
      perc: 0,
      config: { clamp: true },
    },
    []
  );

  useDrag(
    ({ down, swipe, movement: [mx] }) => {
      if (!down && (swipe[0] === 1 || mx >= MENU_WIDTH / 3)) {
        setOpen(toggle);
      } else {
        animate({
          x: down ? mx : 0,
          perc: down ? 1 - mx / MENU_WIDTH : 1,
          immediate: down,
        });
      }
    },
    {
      domTarget: overlayRef,
      enabled: isOpen,
      initial: () => [x.get(), 0],
      axis: 'x',
      swipeDistance: [40, 0],
      filterTaps: true,
      bounds: {
        left: 0,
        right: MENU_WIDTH,
        top: 0,
        bottom: 0,
      },
    }
  );

  useEffect(() => {
    if (isOpen) {
      animate({ x: 0, perc: 1, config: { velocity: 0 } });

      // Auto-focus current active link
      if (overlayRef.current !== null) {
        const activeLink = overlayRef.current.querySelector('.active') as HTMLAnchorElement | null;
        if (activeLink !== null) {
          activeLink.focus();
        } else {
          (overlayRef.current.querySelector('a') as HTMLAnchorElement).focus();
        }
      }
    } else {
      animate({ x: MENU_INITIAL, perc: 0 });
    }
  }, [isOpen, animate]);

  const toggleButtonTitle = `${isOpen ? 'Close' : 'Open'} navigation menu`;
  const focusableProps = isOpen ? {} : { tabIndex: -1 };

  return (
    <MenuArea>
      <MenuToggleButton
        type="button"
        ref={buttonRef}
        onClick={toggleOpen}
        title={toggleButtonTitle}
        aria-label={toggleButtonTitle}
      >
        <MenuToggleLine as={animated.span} style={{ transform: perc.to(transformLine1) }} />
        <MenuToggleLine as={animated.span} style={{ transform: perc.to(transformLine2) }} />
        <MenuToggleLine as={animated.span} style={{ transform: perc.to(transformLine3) }} />
      </MenuToggleButton>

      <OverlayContainer>
        <Backdrop
          ref={backdropRef}
          open={isOpen}
          onClick={toggleOpen}
          css={{
            zIndex: ZINDEX_MODAL_BACKDROP - 2,
          }}
          style={{
            //@ts-expect-error
            backgroundColor: perc.to(getBackdropOpacity),
          }}
        />
        <MenuOverlay
          as={animated.div}
          open={isOpen}
          role="menu"
          ref={overlayRef}
          aria-hidden={!isOpen}
          aria-expanded={isOpen}
          {...overlayProps}
          style={{ x }}
        >
          <FocusScope contain={isOpen} restoreFocus>
            <MainMenu direction="vertical" onClick={toggleOpen} focusableProps={focusableProps} {...modalProps} />
          </FocusScope>
        </MenuOverlay>
      </OverlayContainer>
    </MenuArea>
  );
};
