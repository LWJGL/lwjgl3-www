import { useState, useRef, useCallback, useEffect } from 'react';
import { useLocation } from '~/components/router/client';
import { usePreventScroll } from '@react-aria/overlays';
import { motion, useMotionValue, useMotionTemplate, useTransform, animate, type PanInfo } from 'framer-motion';
import { useBreakpoint, Breakpoint } from '~/hooks/useBreakpoint';
import { supportsDialog } from '~/services/dialog';

const MENU_WIDTH = 260;
const MENU_INITIAL = MENU_WIDTH + 1;
const DRAG_OFFSET = MENU_WIDTH * 0.5;
const DRAG_CLOSE_ZONE = 30;

function autoFocus(btn: HTMLButtonElement) {
  // move focus back to toggle button
  requestAnimationFrame(() => {
    btn.focus({
      //@ts-expect-error
      focusVisible: true,
      preventScroll: true,
    });
  });
}

export const Sidebar: FCC = ({ children }) => {
  const [isOpen, setOpen] = useState(false);
  const breakpoint = useBreakpoint();
  const isDesktop = breakpoint >= Breakpoint.lg;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const toggleOpenWithFocus = useCallback(() => {
    setOpen(!isOpen);
    if (isOpen && buttonRef.current) {
      autoFocus(buttonRef.current);
    }
  }, [isOpen]);

  usePreventScroll({ isDisabled: !isOpen });

  useEffect(() => {
    // Auto-close if we resize to desktop viewport
    if (isDesktop && isOpen) {
      setOpen(false);
    }

    // Accessibility
    if (buttonRef.current) {
      if (isDesktop) {
        buttonRef.current.setAttribute('aria-hidden', '');
      } else {
        buttonRef.current.removeAttribute('aria-hidden');
      }
    }
    if (sidebarRef.current) {
      if (isDesktop || isOpen) {
        sidebarRef.current.removeAttribute('aria-hidden');
      } else {
        sidebarRef.current.setAttribute('aria-hidden', '');
      }
    }
  }, [isDesktop, isOpen]);

  // Auto-close on redirect
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Animation
  const x = useMotionValue(0);
  const keyframes2 = [MENU_WIDTH, 0];
  const keyframes3 = [MENU_WIDTH, MENU_WIDTH / 2, 0];
  // .btn-hamburger spans
  const spans = [
    {
      rotate: useTransform(x, keyframes3, [0, 0, 45]),
      translateY: useTransform(x, keyframes3, [0, 10, 10]),
    },
    {
      opacity: useTransform(x, keyframes3, [1, 1, 0], {
        // 100% opacity until halfway through the animation, then 0% opacity
        ease: (v) => (v < 1 ? 0 : 1),
      }),
      // scale: useTransform(x, keyframes2, [1, 0]),
    },
    {
      rotate: useTransform(x, keyframes3, [0, 0, -45]),
      translateY: useTransform(x, keyframes3, [0, -10, -10]),
    },
  ];
  // dialog.backdrop
  const backdropColorOpacity = useTransform(x, keyframes2, [0, 0.45]);
  const backdropColor = useMotionTemplate`rgba(0,0,0,${backdropColorOpacity})`;

  // .sidebar
  const onDragEnd = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
      // Close if we drag far enough to the right (50% of the menu width)
      // Close if we drag fast enough (velocity > 200)
      // Close if we x is near the viewport edge (within DRAG_CLOSE_ZONE pixels)
      if (info.velocity.x > 200 || info.offset.x > DRAG_OFFSET || info.point.x >= innerWidth - DRAG_CLOSE_ZONE) {
        let animation = animate(x, MENU_INITIAL, {
          type: 'spring',
          // velocity: Math.max(info.velocity.x, 200),
          velocity: info.velocity.x,
          onUpdate: (latest) => {
            // Kill animation immediately if we're past the target point
            if (latest >= MENU_INITIAL) {
              animation.stop();
              setOpen(false);
            }
          },
          onComplete: () => {
            setOpen(false);
          },
        });
      } else {
        animate(x, 0);
      }
    },
    [x]
  );
  // Initial render should reset x
  // If we did that on declaration (useMotionValue) would result in SSR/noscript conflict
  // (we don't want x-axis translation if noscript is active)
  useEffect(() => {
    x.set(MENU_INITIAL);
  }, [x]);

  useEffect(() => {
    if (isOpen) {
      let dialog = dialogRef.current;
      if (dialog) {
        // Do not rely on dialog[open] because it transitions instantly
        // Instead set a className and remove it when transition onComplete fires
        dialog.classList.add('open');
        if (supportsDialog()) {
          if (!dialog.open) {
            dialog.showModal();
          }
          // Listen for cancel event and automatically close dialog (e.g. if ESC is pressed)
          dialog.addEventListener('cancel', toggleOpenWithFocus);
        }
      }

      animate(x, 0);

      // Auto-focus current active link
      if (sidebarRef.current !== null) {
        let currentLink: HTMLAnchorElement | HTMLButtonElement | null = sidebarRef.current.querySelector(
          `a[href="${document.location.pathname}"]`
        );
        if (!currentLink) {
          currentLink = buttonRef.current;
        }
        if (currentLink) {
          currentLink.focus({
            //@ts-expect-error
            focusVisible: true,
            preventScroll: true,
          });
        }
      }

      // Auto-close on click outside
      let clickOutsideListener = (e: MouseEvent) => {
        if (
          sidebarRef.current !== null &&
          e.target !== null &&
          !sidebarRef.current.contains(e.target as Node) &&
          e.target !== buttonRef.current
        ) {
          setOpen(false);
        }
        return true;
      };
      window.addEventListener('pointerdown', clickOutsideListener);

      // Cleanup
      return () => {
        if (dialog !== null && supportsDialog()) {
          dialog.removeEventListener('cancel', toggleOpenWithFocus);
        }
        window.removeEventListener('pointerdown', clickOutsideListener);
      };
    } else {
      animate(x, MENU_INITIAL, {
        onComplete: () => {
          let dialog = dialogRef.current;
          if (dialog !== null) {
            dialog.classList.remove('open');
            if (supportsDialog()) {
              dialog.close();
            }
          }
        },
      });
    }
  }, [isOpen, x, toggleOpenWithFocus]);

  const toggleButtonTitle = `${isOpen ? 'Close' : 'Open'} navigation menu`;

  return (
    <dialog ref={dialogRef}>
      <button
        className="btn-hamburger"
        type="button"
        ref={buttonRef}
        onClick={toggleOpenWithFocus}
        title={toggleButtonTitle}
        aria-label={toggleButtonTitle}
      >
        <motion.span style={spans[0]} />
        <motion.span style={spans[1]} />
        <motion.span style={spans[2]} />
      </button>
      <motion.div
        ref={backdropRef}
        className={'backdrop'}
        style={{
          backgroundColor: backdropColor,
        }}
      />
      <motion.div
        className="sidebar"
        ref={sidebarRef}
        style={{ x }}
        role="menu"
        drag="x"
        dragConstraints={{ left: 0, right: MENU_INITIAL + 14 }}
        dragElastic={0}
        dragMomentum={false}
        onDragEnd={onDragEnd}
      >
        {children}
      </motion.div>
    </dialog>
  );
};
