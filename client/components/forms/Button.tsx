import { useEffect, useState, useRef, useMemo, forwardRef } from 'react';
import { styled, css, keyframes } from '~/theme/stitches.config';
import { useShareForwardedRef } from '~/hooks/useShareForwardedRef';
import { Link } from '~/components/router/client';

// Button style is a mix of
// a) Material Buttons: https://material.io/components/buttons
// b) Tailwind UI Buttons: https://tailwindui.com/components/application-ui/elements/buttons

interface Coordinates {
  x: number;
  y: number;
}

interface Translation {
  start: Coordinates;
  end: Coordinates;
}

const RIPPLE_DURATION_MS = 225; // Corresponds to ripple translate duration (i.e. activation animation duration)
const DEACTIVATION_MS = 150; // Corresponds to ripple fade-out duration (i.e. deactivation animation duration)
const INITIAL_ORIGIN_SCALE = 0.6;

enum ButtonState {
  Idle,
  Pressed,
  Released,
}

const fgRadiusIn = keyframes({
  from: {
    animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'translate(var(--ripple-translate-start, 0)) scale(1)',
  },
  to: {
    transform: 'translate(var(--ripple-translate-end, 0)) scale(var(--ripple-scale, 1))',
  },
});

const fgOpacityIn = keyframes({
  from: {
    animationTimingFunction: 'linear',
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

const fgOpacityOut = keyframes({
  from: {
    animationTimingFunction: 'linear',
    opacity: 1,
  },
  to: {
    opacity: 0,
  },
});

const ButtonCss = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '$medium',
  userSelect: 'none',
  touchAction: 'none',
  border: '1px solid transparent',
  willChange: 'transform,opacity,border,box-shadow',
  transition: 'box-shadow, border-color 150ms cubic-bezier(0.4, 0, 0.2, 1)', // Transition only box-shadow instead of all like Tailwind does, feels faster
  position: 'relative', // for Ripple
  '-webkit-font-smoothing': 'antialiased',
  '-webkit-user-drag': 'none',
  '--ripple-size': 0, // initial circle size
  '--ripple-scale': 1, // target scale
  '--ripple-left': 0,
  '--ripple-top': 0,
  '--ripple-translate-start': 0,
  '--ripple-translate-end': 0,

  '&:active,&:focus': {
    outline: 'none',
  },

  '&:active': {
    transform: 'translateY(1px)',
  },

  '&[disabled]': {
    pointerEvents: 'none',
    filter: 'grayscale(100%)',
    boxShadow: 'none',
    opacity: 0.45,
  },

  variants: {
    size: {
      xs: {
        fontSize: '$xs',
      },
      sm: {
        fontSize: '$sm',
      },
      base: {
        fontSize: '$sm',
      },
      lg: {
        fontSize: '$base',
      },
      xl: {
        fontSize: '$base',
      },
    },
    variant: {
      base: {},
      secondary: {},
      outline: {
        backgroundColor: 'transparent',
      },
      text: {
        backgroundColor: 'transparent',
      },
    },
    tone: {
      primary: {},
      neutral: {},
      critical: {},
      caution: {},
      positive: {},
      info: {},
    },
    rounding: {
      normal: {
        padding: '$xsm $sm',
        borderRadius: '$md',
        lineHeight: '1.5rem',
      },
      icon: {
        borderRadius: '$full',
        square: '2em',
      },
    },
    fill: {
      auto: {
        display: 'flex',
        '@sm': {
          display: 'inline-flex',
        },
      },
      full: {
        display: 'flex',
      },
    },
  },
  compoundVariants: [
    { rounding: 'normal', size: 'xs', css: { borderRadius: '$rounded', padding: '$xxsm $xsm', lineHeight: '1rem' } },
    { rounding: 'normal', size: 'sm', css: { lineHeight: '1rem' } },
    { rounding: 'normal', size: 'xl', css: { padding: '$sm $gutter' } },
    { rounding: 'icon', size: 'xs', css: { square: '1.7rem' } },
    { rounding: 'icon', size: 'sm', css: { square: '2.1rem' } },
    { rounding: 'icon', size: 'base', css: { square: '2.5rem' } },
    { rounding: 'icon', size: 'lg', css: { square: '2.5rem' } },
    { rounding: 'icon', size: 'xl', css: { square: '3rem' } },

    // Primary
    {
      variant: 'base',
      tone: 'primary',
      css: {
        color: '$primary50',
        backgroundColor: '$primary600',
        boxShadow: '$md',
        '&:focus:focus-visible': {
          boxShadow: '0 0 0 3px $colors$outline_primary',
          borderColor: '$primary700',
        },
        '&:hover,&:active': {
          backgroundColor: '$primary700',
        },
      },
    },
    {
      variant: 'secondary',
      tone: 'primary',
      css: {
        color: '$primary700',
        backgroundColor: '$primary200',
        '&:focus': {
          borderColor: '$primary400',
          boxShadow: '0 0 0 3px $colors$outline_primary',
        },
        '&:focus:not(:focus-visible)': {
          borderColor: '$primary300',
          boxShadow: 'none',
        },
        '&:hover,&:active': {
          color: '$primary800',
          backgroundColor: '$primary300',
        },
      },
    },
    {
      variant: 'outline',
      tone: 'primary',
      css: {
        color: '$primary600',
        borderColor: '$primary400',
        boxShadow: '$sm',
        '&:focus': {
          borderColor: '$primary500',
          boxShadow: `0 0 0 3px $colors$outline_primary`,
        },
        '&:focus:not(:focus-visible)': {
          borderColor: '$primary600',
          boxShadow: '$sm',
        },
        '&:hover,&:active': {
          color: '$primary700',
          borderColor: '$primary600',
          backgroundColor: '$primary50',
        },
      },
    },
    {
      variant: 'text',
      tone: 'primary',
      css: {
        color: '$primary600',
        '&:focus': {
          boxShadow: `0 0 0 3px $colors$outline_primary`,
        },
        '&:focus:not(:focus-visible)': {
          boxShadow: 'none',
        },
        '&:hover,&:active': {
          color: '$primary700',
          backgroundColor: '$primary50',
        },
      },
    },

    // Neutral
    {
      variant: 'base',
      tone: 'neutral',
      css: {
        color: '$neutral50',
        backgroundColor: '$neutral600',
        boxShadow: '$md',
        '&:focus:focus-visible': {
          boxShadow: '0 0 0 3px $colors$outline_neutral',
          borderColor: '$neutral700',
        },
        '&:hover,&:active': {
          backgroundColor: '$neutral700',
        },
      },
    },
    {
      variant: 'secondary',
      tone: 'neutral',
      css: {
        color: '$neutral700',
        backgroundColor: '$neutral200',
        '&:focus': {
          borderColor: '$neutral400',
          boxShadow: '0 0 0 3px $colors$outline_neutral',
        },
        '&:focus:not(:focus-visible)': {
          borderColor: '$neutral300',
          boxShadow: 'none',
        },
        '&:hover,&:active': {
          color: '$neutral800',
          backgroundColor: '$neutral300',
        },
      },
    },
    {
      variant: 'outline',
      tone: 'neutral',
      css: {
        color: '$neutral600',
        borderColor: '$neutral400',
        boxShadow: '$sm',
        '&:focus': {
          borderColor: '$neutral500',
          boxShadow: `0 0 0 3px $colors$outline_neutral`,
        },
        '&:focus:not(:focus-visible)': {
          borderColor: '$neutral600',
          boxShadow: '$sm',
        },
        '&:hover,&:active': {
          color: '$neutral700',
          borderColor: '$neutral600',
          backgroundColor: '$neutral50',
        },
      },
    },
    {
      variant: 'text',
      tone: 'neutral',
      css: {
        color: '$neutral600',
        '&:focus': {
          boxShadow: `0 0 0 3px $colors$outline_neutral`,
        },
        '&:focus:not(:focus-visible)': {
          boxShadow: 'none',
        },
        '&:hover,&:active': {
          color: '$neutral700',
          backgroundColor: '$neutral50',
        },
      },
    },

    // Critical
    {
      variant: 'base',
      tone: 'critical',
      css: {
        color: '$critical50',
        backgroundColor: '$critical600',
        boxShadow: '$md',
        '&:focus:focus-visible': {
          boxShadow: '0 0 0 3px $colors$outline_critical',
          borderColor: '$critical700',
        },
        '&:hover,&:active': {
          backgroundColor: '$critical700',
        },
      },
    },
    {
      variant: 'secondary',
      tone: 'critical',
      css: {
        color: '$critical700',
        backgroundColor: '$critical200',
        '&:focus': {
          borderColor: '$critical400',
          boxShadow: '0 0 0 3px $colors$outline_critical',
        },
        '&:focus:not(:focus-visible)': {
          borderColor: '$critical300',
          boxShadow: 'none',
        },
        '&:hover,&:active': {
          color: '$critical800',
          backgroundColor: '$critical300',
        },
      },
    },
    {
      variant: 'outline',
      tone: 'critical',
      css: {
        color: '$critical600',
        borderColor: '$critical400',
        boxShadow: '$sm',
        '&:focus': {
          borderColor: '$critical500',
          boxShadow: `0 0 0 3px $colors$outline_critical`,
        },
        '&:focus:not(:focus-visible)': {
          borderColor: '$critical600',
          boxShadow: '$sm',
        },
        '&:hover,&:active': {
          color: '$critical700',
          borderColor: '$critical600',
          backgroundColor: '$critical50',
        },
      },
    },
    {
      variant: 'text',
      tone: 'critical',
      css: {
        color: '$critical600',
        '&:focus': {
          boxShadow: `0 0 0 3px $colors$outline_critical`,
        },
        '&:focus:not(:focus-visible)': {
          boxShadow: 'none',
        },
        '&:hover,&:active': {
          color: '$critical700',
          backgroundColor: '$critical50',
        },
      },
    },

    // Caution
    {
      variant: 'base',
      tone: 'caution',
      css: {
        color: '$caution50',
        backgroundColor: '$caution600',
        boxShadow: '$md',
        '&:focus:focus-visible': {
          boxShadow: '0 0 0 3px $colors$outline_caution',
          borderColor: '$caution700',
        },
        '&:hover,&:active': {
          backgroundColor: '$caution700',
        },
      },
    },
    {
      variant: 'secondary',
      tone: 'caution',
      css: {
        color: '$caution700',
        backgroundColor: '$caution200',
        '&:focus': {
          borderColor: '$caution400',
          boxShadow: '0 0 0 3px $colors$outline_caution',
        },
        '&:focus:not(:focus-visible)': {
          borderColor: '$caution300',
          boxShadow: 'none',
        },
        '&:hover,&:active': {
          color: '$caution800',
          backgroundColor: '$caution300',
        },
      },
    },
    {
      variant: 'outline',
      tone: 'caution',
      css: {
        color: '$caution600',
        borderColor: '$caution400',
        boxShadow: '$sm',
        '&:focus': {
          borderColor: '$caution500',
          boxShadow: `0 0 0 3px $colors$outline_caution`,
        },
        '&:focus:not(:focus-visible)': {
          borderColor: '$caution600',
          boxShadow: '$sm',
        },
        '&:hover,&:active': {
          color: '$caution700',
          borderColor: '$caution600',
          backgroundColor: '$caution50',
        },
      },
    },
    {
      variant: 'text',
      tone: 'caution',
      css: {
        color: '$caution600',
        '&:focus': {
          boxShadow: `0 0 0 3px $colors$outline_caution`,
        },
        '&:focus:not(:focus-visible)': {
          boxShadow: 'none',
        },
        '&:hover,&:active': {
          color: '$caution700',
          backgroundColor: '$caution50',
        },
      },
    },

    // Positive
    {
      variant: 'base',
      tone: 'positive',
      css: {
        color: '$positive50',
        backgroundColor: '$positive600',
        boxShadow: '$md',
        '&:focus:focus-visible': {
          boxShadow: '0 0 0 3px $colors$outline_positive',
          borderColor: '$positive700',
        },
        '&:hover,&:active': {
          backgroundColor: '$positive700',
        },
      },
    },
    {
      variant: 'secondary',
      tone: 'positive',
      css: {
        color: '$positive700',
        backgroundColor: '$positive200',
        '&:focus': {
          borderColor: '$positive400',
          boxShadow: '0 0 0 3px $colors$outline_positive',
        },
        '&:focus:not(:focus-visible)': {
          borderColor: '$positive300',
          boxShadow: 'none',
        },
        '&:hover,&:active': {
          color: '$positive800',
          backgroundColor: '$positive300',
        },
      },
    },
    {
      variant: 'outline',
      tone: 'positive',
      css: {
        color: '$positive600',
        borderColor: '$positive400',
        boxShadow: '$sm',
        '&:focus': {
          borderColor: '$positive500',
          boxShadow: `0 0 0 3px $colors$outline_positive`,
        },
        '&:focus:not(:focus-visible)': {
          borderColor: '$positive600',
          boxShadow: '$sm',
        },
        '&:hover,&:active': {
          color: '$positive700',
          borderColor: '$positive600',
          backgroundColor: '$positive50',
        },
      },
    },
    {
      variant: 'text',
      tone: 'positive',
      css: {
        color: '$positive600',
        '&:focus': {
          boxShadow: `0 0 0 3px $colors$outline_positive`,
        },
        '&:focus:not(:focus-visible)': {
          boxShadow: 'none',
        },
        '&:hover,&:active': {
          color: '$positive700',
          backgroundColor: '$positive50',
        },
      },
    },

    // Info
    {
      variant: 'base',
      tone: 'info',
      css: {
        color: '$info50',
        backgroundColor: '$info600',
        boxShadow: '$md',
        '&:focus:focus-visible': {
          boxShadow: '0 0 0 3px $colors$outline_info',
          borderColor: '$info700',
        },
        '&:hover,&:active': {
          backgroundColor: '$info700',
        },
      },
    },
    {
      variant: 'secondary',
      tone: 'info',
      css: {
        color: '$info700',
        backgroundColor: '$info200',
        '&:focus': {
          borderColor: '$info400',
          boxShadow: '0 0 0 3px $colors$outline_info',
        },
        '&:focus:not(:focus-visible)': {
          borderColor: '$info300',
          boxShadow: 'none',
        },
        '&:hover,&:active': {
          color: '$info800',
          backgroundColor: '$info300',
        },
      },
    },
    {
      variant: 'outline',
      tone: 'info',
      css: {
        color: '$info600',
        borderColor: '$info400',
        boxShadow: '$sm',
        '&:focus': {
          borderColor: '$info500',
          boxShadow: `0 0 0 3px $colors$outline_info`,
        },
        '&:focus:not(:focus-visible)': {
          borderColor: '$info600',
          boxShadow: '$sm',
        },
        '&:hover,&:active': {
          color: '$info700',
          borderColor: '$info600',
          backgroundColor: '$info50',
        },
      },
    },
    {
      variant: 'text',
      tone: 'info',
      css: {
        color: '$info600',
        '&:focus': {
          boxShadow: `0 0 0 3px $colors$outline_info`,
        },
        '&:focus:not(:focus-visible)': {
          boxShadow: 'none',
        },
        '&:hover,&:active': {
          color: '$info700',
          backgroundColor: '$info50',
        },
      },
    },
  ],
});

const Ripple = styled('span', {
  position: 'absolute',
  square: '100%',
  overflow: 'clip',
  borderRadius: '$md',
  top: 0,
  left: 0,
  boxSizing: 'content-box',
  pointerEvents: 'none',
  zIndex: 0,
  '&::after': {
    content: `""`,
    position: 'absolute',
    borderRadius: '50%',
    opacity: 0,
    backgroundColor: '$black',
    top: 0,
    left: 0,
    transformOrigin: 'center center',
    square: 'var(--ripple-size, 100%)',
    transition: 'opacity 75ms linear',
    willChange: 'transform,opacity',
    // transform: 'scale(1)',
    animation: `${fgOpacityOut} ${DEACTIVATION_MS}ms`,
    transform: 'translate(var(--ripple-translate-end, 0)) scale(var(--ripple-scale, 1))',
  },
  '&.pressed::after': {
    animation: `${fgRadiusIn} ${RIPPLE_DURATION_MS}ms forwards,${fgOpacityIn} 75ms forwards`,
  },
  variants: {
    size: {
      xs: {},
      sm: {},
      base: {},
      lg: {},
      xl: {},
    },
    tone: {
      primary: {},
      neutral: {},
      critical: {},
      caution: {},
      positive: {},
      info: {},
    },
    variant: {
      base: {
        '&::after': {
          backgroundColor: '$white',
        },
      },
      secondary: {},
      outline: {
        borderColor: 'transparent',
      },
      text: {},
    },
    rounding: {
      normal: {},
      icon: {
        borderRadius: '$full',
      },
    },
  },
  compoundVariants: [
    { rounding: 'normal', size: 'xs', css: { borderRadius: '$rounded' } },
    // Primary
    { variant: 'base', tone: 'primary', css: { '&::after': { backgroundColor: '$primary800' } } },
    { variant: 'secondary', tone: 'primary', css: { '&::after': { backgroundColor: '$primary400' } } },
    { variant: 'outline', tone: 'primary', css: { '&::after': { backgroundColor: '$primary100' } } },
    { variant: 'text', tone: 'primary', css: { '&::after': { backgroundColor: '$primary100' } } },
    // Neutral
    { variant: 'base', tone: 'neutral', css: { '&::after': { backgroundColor: '$neutral800' } } },
    { variant: 'secondary', tone: 'neutral', css: { '&::after': { backgroundColor: '$neutral400' } } },
    { variant: 'outline', tone: 'neutral', css: { '&::after': { backgroundColor: '$neutral100' } } },
    { variant: 'text', tone: 'neutral', css: { '&::after': { backgroundColor: '$neutral100' } } },
    // Critical
    { variant: 'base', tone: 'critical', css: { '&::after': { backgroundColor: '$critical800' } } },
    { variant: 'secondary', tone: 'critical', css: { '&::after': { backgroundColor: '$critical400' } } },
    { variant: 'outline', tone: 'critical', css: { '&::after': { backgroundColor: '$critical100' } } },
    { variant: 'text', tone: 'critical', css: { '&::after': { backgroundColor: '$critical100' } } },
    // Caution
    { variant: 'base', tone: 'caution', css: { '&::after': { backgroundColor: '$caution800' } } },
    { variant: 'secondary', tone: 'caution', css: { '&::after': { backgroundColor: '$caution400' } } },
    { variant: 'outline', tone: 'caution', css: { '&::after': { backgroundColor: '$caution100' } } },
    { variant: 'text', tone: 'caution', css: { '&::after': { backgroundColor: '$caution100' } } },
    // Positive
    { variant: 'base', tone: 'positive', css: { '&::after': { backgroundColor: '$positive800' } } },
    { variant: 'secondary', tone: 'positive', css: { '&::after': { backgroundColor: '$positive400' } } },
    { variant: 'outline', tone: 'positive', css: { '&::after': { backgroundColor: '$positive100' } } },
    { variant: 'text', tone: 'positive', css: { '&::after': { backgroundColor: '$positive100' } } },
    // Info
    { variant: 'base', tone: 'info', css: { '&::after': { backgroundColor: '$info800' } } },
    { variant: 'secondary', tone: 'info', css: { '&::after': { backgroundColor: '$info400' } } },
    { variant: 'outline', tone: 'info', css: { '&::after': { backgroundColor: '$info100' } } },
    { variant: 'text', tone: 'info', css: { '&::after': { backgroundColor: '$info100' } } },
  ],
});

function getBoundedRadius(frame: DOMRect): number {
  return Math.sqrt(Math.pow(frame.width, 2) + Math.pow(frame.height, 2)) + 10;
}

function getNormalizedEventCoords(e: React.PointerEvent, frame: DOMRect): Coordinates {
  const x = window.pageXOffset;
  const y = window.pageYOffset;
  const documentX = x + frame.left;
  const documentY = y + frame.top;

  let normalizedX = e.nativeEvent.pageX - documentX;
  let normalizedY = e.nativeEvent.pageY - documentY;

  return { x: normalizedX, y: normalizedY };
}

function getTranslationCoordinates(
  e: React.PointerEvent | React.KeyboardEvent,
  frame: DOMRect,
  initialSize: number
): Translation {
  const halfSize = initialSize / 2;
  const start: Coordinates =
    e.type === 'pointerdown'
      ? getNormalizedEventCoords(e as React.PointerEvent, frame)
      : {
          x: frame.width / 2,
          y: frame.height / 2,
        };

  // Center the element around the start point.
  start.x -= halfSize;
  start.y -= halfSize;

  const end = {
    x: frame.width / 2 - halfSize,
    y: frame.height / 2 - halfSize,
  };

  return {
    start,
    end,
  };
}

const ButtonLabel = styled('span', {
  position: 'relative',
});

// type ButtonHTMLProps = JSX.IntrinsicElements['button'];
// type AnchorHTMLProps = JSX.IntrinsicElements['a'];
// type ButtonVariants = VariantProps<typeof ButtonCss>;
// type ButtonProps = ButtonHTMLProps & ButtonStyledVariants;

const ButtonStyled = styled('button', ButtonCss);
const AnchorStyled = styled('a', ButtonCss);
const LinkStyled = styled(Link, ButtonCss);

type ButtonStyledProps = React.ComponentProps<typeof ButtonStyled>;
type AnchorStyledProps = React.ComponentProps<typeof AnchorStyled>;
type LinkStyledProps = React.ComponentProps<typeof LinkStyled>;

function initTransition(
  e: React.PointerEvent | React.KeyboardEvent,
  element: HTMLElement,
  rounding?: ButtonStyledProps['rounding']
) {
  const isUnbounded = rounding === 'icon';
  const frame = element.getBoundingClientRect();
  const maxDim = Math.max(frame.height, frame.width);
  const maxRadius = isUnbounded ? maxDim : getBoundedRadius(frame);

  // Ripple is sized as a fraction of the largest dimension of the surface, then scales up using a CSS scale transform
  let initialSize = Math.floor(maxDim * INITIAL_ORIGIN_SCALE);

  // Unbounded ripple size should always be even number to equally center align.
  if (isUnbounded && initialSize % 2 !== 0) {
    initialSize -= 1;
  }

  const { start, end } = getTranslationCoordinates(e, frame, initialSize);
  const translateStart = `${start.x}px, ${start.y}px`;
  const translateEnd = `${end.x}px, ${end.y}px`;

  // Update Custom Properties
  element.style.setProperty('--ripple-size', `${initialSize}px`);
  element.style.setProperty('--ripple-scale', (maxRadius / initialSize).toString(10));
  element.style.setProperty('--ripple-translate-start', translateStart);
  element.style.setProperty('--ripple-translate-end', translateEnd);
}

function useMaterialButton(
  ref: React.RefObject<HTMLButtonElement | HTMLAnchorElement>,
  rippleRef: React.RefObject<HTMLSpanElement>,
  rounding: ButtonStyledProps['rounding'],
  props: any
) {
  // Use timeout to allow for the ripple animation to complete even when we release the button
  const animationTimeout = useRef(0);
  // Keep a reference to the current state so we can read it in our timeout handler
  const currentState = useRef(ButtonState.Idle);
  // Simple state machine, we initially use the Idle state to avoid unecessary DOM mutations
  const [state, setState] = useState<ButtonState>(ButtonState.Idle);
  const { onKeyDown, onKeyUp, onPointerDown, onPointerUp, onClick, ...otherProps } = props;

  useEffect(() => {
    function activate() {
      if (rippleRef.current !== null) {
        // Adding the class fires the ripple animation
        rippleRef.current.classList.add('pressed');
        animationTimeout.current = window.setTimeout(reset, RIPPLE_DURATION_MS);
      }
    }

    function deactivate() {
      if (rippleRef.current !== null) {
        // Removing the class fires the fade-out animation
        rippleRef.current.classList.remove('pressed');
      }
    }

    function reset() {
      clearTimeout(animationTimeout.current);
      animationTimeout.current = 0;

      // If we released the button during the animation
      // we should now revert the pressed state on the DOM
      // ! Warning: we do not always call deactivate because we may hold the pointerdown,
      // in this case the .pressed class should be preserved on the button
      if (currentState.current === ButtonState.Released) {
        deactivate();
      }
    }

    currentState.current = state;

    switch (state) {
      case ButtonState.Pressed: {
        if (animationTimeout.current) {
          reset();
          deactivate();
          requestAnimationFrame(activate);
        } else {
          activate();
        }
        break;
      }
      case ButtonState.Released: {
        if (animationTimeout.current === 0) {
          deactivate();
        }
        break;
      }
    }
  }, [state, rippleRef]);

  const eventHandlers = useMemo(
    () => ({
      onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => {
        if (ref.current === null) {
          return;
        }
        if (onPointerDown) {
          onPointerDown.call(ref.current, e);
        }
        e.currentTarget.setPointerCapture(e.nativeEvent.pointerId);
        initTransition(e, ref.current, rounding);
        setState(ButtonState.Pressed);
      },
      // onPointerUp: (e: React.SyntheticEvent<HTMLButtonElement, PointerEvent>) => {
      onPointerUp: (e: React.PointerEvent<HTMLButtonElement>) => {
        if (ref.current === null) {
          return;
        }
        if (onPointerUp) {
          onPointerUp.call(ref.current, e);
        }
        e.currentTarget.releasePointerCapture(e.nativeEvent.pointerId);
        setState(ButtonState.Released);
      },
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        // Because we've enabled pointer capturing, click is always fired
        // Make sure pointer is released inside Button's bounding box, otherwise abort click
        const { detail, clientX, clientY } = e.nativeEvent;
        // Detail will be 0 if we pressed Enter key, use this to distinguish between pointer and simulated clicks (see onKeyUp)
        if (detail > 0) {
          const { x, y, width, height } = e.currentTarget.getBoundingClientRect();

          if (clientX < x || clientX > x + width || clientY < y || clientY > y + height) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
        }

        if (onClick && ref.current !== null) {
          onClick.call(ref.current, e);
        }
      },
      onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (ref.current === null) {
          return;
        }
        if (onKeyDown) {
          onKeyDown.call(ref.current, e);
        }
        if (e.nativeEvent.key === 'Enter' || e.nativeEvent.key === ' ') {
          e.preventDefault();
          // Check if we are in a Pressed state already to avoid key repeat
          // TODO: This behavior should be customizable
          if (currentState.current !== ButtonState.Pressed) {
            initTransition(e, ref.current, rounding);
            setState(ButtonState.Pressed);
          }
        }
      },
      onKeyUp: (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (ref.current === null) {
          return;
        }
        if (onKeyUp) {
          onKeyUp.call(ref.current, e);
        }
        if (currentState.current !== ButtonState.Released) {
          if (e.nativeEvent.key === 'Enter' || e.nativeEvent.key === ' ') {
            setState(ButtonState.Released);
            ref.current.click();
          }
        }
      },
    }),
    [ref, onPointerDown, onPointerUp, onKeyDown, onKeyUp, onClick, rounding]
  );

  return [eventHandlers, otherProps];
}

export const Button = forwardRef<HTMLButtonElement, ButtonStyledProps>(
  ({ size = 'base', variant = 'base', tone = 'primary', rounding = 'normal', children, ...rest }, forwardedRef) => {
    const ref = useShareForwardedRef<HTMLButtonElement>(forwardedRef);
    const rippleRef = useRef<HTMLSpanElement>(null);
    const [eventHandlers, otherProps] = useMaterialButton(ref, rippleRef, rounding, rest);

    if (rest.type === undefined) {
      rest.type = 'button';
    }

    return (
      <ButtonStyled
        ref={ref}
        className={ButtonCss({ size, variant, tone, rounding })}
        {...eventHandlers}
        {...otherProps}
      >
        <Ripple ref={rippleRef} size={size} variant={variant} tone={tone} rounding={rounding} />
        <ButtonLabel>{children}</ButtonLabel>
      </ButtonStyled>
    );
  }
);

export const AnchorButton = forwardRef<HTMLAnchorElement, AnchorStyledProps>(
  ({ size = 'base', variant = 'base', tone = 'primary', rounding = 'normal', children, ...rest }, forwardedRef) => {
    const ref = useShareForwardedRef<HTMLAnchorElement>(forwardedRef);
    const rippleRef = useRef<HTMLSpanElement>(null);
    const [eventHandlers, otherProps] = useMaterialButton(ref, rippleRef, rounding, rest);

    return (
      <AnchorStyled
        ref={ref}
        className={ButtonCss({ size, variant, tone, rounding })}
        draggable="false"
        {...eventHandlers}
        {...otherProps}
      >
        <Ripple ref={rippleRef} size={size} variant={variant} tone={tone} rounding={rounding} />
        <ButtonLabel>{children}</ButtonLabel>
      </AnchorStyled>
    );
  }
);

export const LinkButton = forwardRef<HTMLAnchorElement, LinkStyledProps>(
  ({ size = 'base', variant = 'base', tone = 'primary', rounding = 'normal', children, ...rest }, forwardedRef) => {
    const ref = useShareForwardedRef<HTMLAnchorElement>(forwardedRef);
    const rippleRef = useRef<HTMLSpanElement>(null);
    const [eventHandlers, otherProps] = useMaterialButton(ref, rippleRef, rounding, rest);

    return (
      <LinkStyled
        ref={ref}
        className={ButtonCss({ size, variant, tone, rounding })}
        draggable="false"
        {...eventHandlers}
        {...otherProps}
      >
        <Ripple ref={rippleRef} size={size} variant={variant} tone={tone} rounding={rounding} />
        <ButtonLabel>{children}</ButtonLabel>
      </LinkStyled>
    );
  }
);
