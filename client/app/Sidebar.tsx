import { useCallback, useEffect, useRef, useState } from 'react';
import { OverlayContainer, useOverlay, usePreventScroll, useModal } from '@react-aria/overlays';
import { FocusScope } from '@react-aria/focus';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { styled, css } from '~/theme/stitches.config';
import { MainMenu } from './MainMenu';
import { ZINDEX_MODAL_BACKDROP } from '~/theme';
import { BackdropCss } from '~/components/ui/Backdrop';

import type { DragHandlers } from 'framer-motion';

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

const MenuToggleLine = css({
  width: '100%',
  height: 4,
  backgroundColor: '$white',
  willChange: 'transform',
  pointerEvents: 'none',
});

const MENU_WIDTH = 260;
const MENU_INITIAL = MENU_WIDTH + 1;

const MenuOverlay = css({
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
  '-webkit-overflow-scrolling': 'touch',
  'touch-action': 'pan-y',
  overscrollBehavior: 'contain',
  willChange: 'transform',
  transform: `translate3d(${MENU_INITIAL}px, 0, 0)`,
  pointerEvents: 'none',
  overflowY: 'auto',
  overflowX: 'hidden',
  '@supports(overflow-x: clip)': {
    overflowX: 'clip',
  },

  variants: {
    open: {
      true: {
        pointerEvents: 'auto',
      },
    },
  },
});

const toggle = (state: boolean) => !state;

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
  const x = useMotionValue(MENU_INITIAL);
  const perc = useTransform(x, (value) => 1 - value / MENU_WIDTH);
  const rotateLine1 = useTransform(perc, (value) => value * -45);
  const scaleLine2 = useTransform(perc, (value) => 1 - value);
  const opacityLine2 = useTransform(perc, (value) => 1 - value);
  const rotateLine3 = useTransform(perc, (value) => value * 45);
  const backdropColor = useTransform(x, [0, MENU_WIDTH], ['rgba(0,0,0,0.75)', 'rgba(0,0,0,0)']);
  const onDragEnd: DragHandlers['onDragEnd'] = useCallback(
    (event, info): void => {
      if (info.velocity.x > 200 && info.offset.x > MENU_WIDTH * 0.33) {
        toggleOpen();
      } else {
        animate(x, 0, {
          velocity: info.velocity.x,
        });
      }
    },
    [x, toggleOpen]
  );

  useEffect(() => {
    if (isOpen) {
      animate(x, 0);

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
      animate(x, MENU_INITIAL);
    }
  }, [isOpen, x]);

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
        <motion.span className={MenuToggleLine()} style={{ rotate: rotateLine1 }} />
        <motion.span className={MenuToggleLine()} style={{ scale: scaleLine2, opacity: opacityLine2 }} />
        <motion.span className={MenuToggleLine()} style={{ rotate: rotateLine3 }} />
      </MenuToggleButton>

      <OverlayContainer>
        <motion.div
          ref={backdropRef}
          style={{
            zIndex: ZINDEX_MODAL_BACKDROP - 2,
            backgroundColor: backdropColor,
          }}
          className={BackdropCss({ open: isOpen })}
          onClick={toggleOpen}
        />
        <motion.div
          ref={overlayRef}
          style={{ x }}
          className={MenuOverlay({ open: isOpen })}
          role="menu"
          aria-hidden={!isOpen}
          aria-expanded={isOpen}
          drag="x"
          dragConstraints={{ left: 0, right: MENU_INITIAL }}
          dragElastic={0}
          dragMomentum={false}
          // @ts-expect-error
          onDragEnd={onDragEnd}
          {...overlayProps}
        >
          <FocusScope contain={isOpen} restoreFocus>
            <MainMenu direction="vertical" onClick={toggleOpen} focusableProps={focusableProps} {...modalProps} />
          </FocusScope>
        </motion.div>
      </OverlayContainer>
    </MenuArea>
  );
};
