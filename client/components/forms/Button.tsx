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
const INITIAL_ORIGIN_SCALE = 0.2;

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
  touchAction: 'pan-y',
  border: '1px solid transparent',
  // willChange: 'transform,background-color,border-color,opacity,box-shadow',
  // transition: 'border-color 150ms cubic-bezier(0.4, 0, 0.2, 1)', // Transition only box-shadow instead of all like Tailwind does, feels faster
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

  '&:active,&.pressed': {
    transform: 'translateY(1px)',
  },

  '&[disabled]': {
    pointerEvents: 'none',
    filter: 'grayscale(50%)',
    boxShadow: 'none',
    opacity: 0.45,
  },

  // Tones
  $$buttonShadow: 'none',
  $$buttonFocusVisible: 'transparent',
  boxShadow: '$$buttonShadow',

  // Don't do this since it's not supported in recent browsers
  // Use the double fallback trick, see below:
  // '&:focus-visible': {
  //   boxShadow: `0 0 0 3px $$buttonFocusVisible`,
  // },
  '&:focus': {
    boxShadow: '0 0 0 3px $$buttonFocusVisible',
  },
  '&:focus:not(:focus-visible)': {
    boxShadow: '$$buttonShadow',
  },
  '&:focus-visible': {
    boxShadow: '0 0 0 3px $$buttonFocusVisible',
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
      contained: {
        $$buttonShadow: '$shadows$sm',
        // '.light &:not([disabled])': {
        //   textShadow: '1px 1px 1px rgba(0,0,0,.2)',
        // },
        // '.dark &:not([disabled])': {
        //   textShadow: '1px 1px 1px rgba(0,0,0,.1)',
        // },
      },
      outline: {
        backgroundColor: 'transparent',
        // $$buttonShadow: '$shadows$sm',
      },
      text: {
        backgroundColor: 'transparent',
      },
    },
    tone: {
      accent: {
        $$buttonFocusVisible: '$colors$accent7',
      },
      neutral: {
        $$buttonFocusVisible: '$colors$neutral7',
      },
      // positive: {
      //   $$buttonFocusVisible: '$colors$positive7',
      // },
      // info: {
      //   $$buttonFocusVisible: '$colors$info7',
      // },
      caution: {
        $$buttonFocusVisible: '$colors$caution6',
      },
      critical: {
        $$buttonFocusVisible: '$colors$critical7',
      },
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

    // Accent
    {
      variant: 'contained',
      tone: 'accent',
      css: {
        color: '$accent2',
        backgroundColor: '$accent9',
        // '&:focus,&:hover,&:active': { backgroundColor: '$accent10' },
        '.light &': {
          borderColor: '$accent10',
        },
        '.dark &': {
          backgroundColor: '$accent10',
          borderColor: '$accent9',
        },
      },
    },
    {
      variant: 'outline',
      tone: 'accent',
      css: {
        color: '$accent11',
        borderColor: '$accent8',
        // '&:focus,&:hover,&:active': { backgroundColor: '$accent4', borderColor: '$accent8' },
      },
    },
    {
      variant: 'text',
      tone: 'accent',
      css: {
        color: '$accent11',
        '&:focus,&:hover,&:active': { backgroundColor: '$accent3' },
      },
    },

    // Neutral
    {
      variant: 'contained',
      tone: 'neutral',
      css: {
        color: '$neutral2',
        backgroundColor: '$neutral12',
        borderColor: '$neutral12',
      },
    },
    {
      variant: 'outline',
      tone: 'neutral',
      css: {
        color: '$neutral11',
        borderColor: '$neutral8',
      },
    },
    {
      variant: 'text',
      tone: 'neutral',
      css: {
        color: '$neutral11',
        '&:focus,&:hover,&:active': { backgroundColor: '$neutral4' },
      },
    },

    // Caution
    {
      variant: 'contained',
      tone: 'caution',
      css: {
        color: '$caution11',
        backgroundColor: '$caution9',
        borderColor: '$caution10',
        '.dark &': {
          color: '$caution2',
        },
      },
    },
    {
      variant: 'outline',
      tone: 'caution',
      css: {
        color: '$caution11',
        borderColor: '$caution8',
      },
    },
    {
      variant: 'text',
      tone: 'caution',
      css: {
        color: '$caution11',
        '&:focus,&:hover,&:active': { backgroundColor: '$caution3' },
      },
    },

    // Critical
    {
      variant: 'contained',
      tone: 'critical',
      css: {
        color: '$critical2',
        backgroundColor: '$critical9',
        borderColor: '$critical10',
        '.dark &': {
          borderColor: '$critical9',
        },
      },
    },
    {
      variant: 'outline',
      tone: 'critical',
      css: {
        color: '$critical11',
        borderColor: '$critical9',
      },
    },
    {
      variant: 'text',
      tone: 'critical',
      css: {
        color: '$critical11',
        '&:focus,&:hover,&:active': { backgroundColor: '$critical3' },
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

  $$bgColor: 'rgba(0,0,0,.2)',
  $$bgColorDark: 'rgba(255,255,255,.2)',

  '&::after': {
    content: `""`,
    position: 'absolute',
    borderRadius: '50%',
    opacity: 0,
    backgroundColor: '$$bgColor',
    top: 0,
    left: 0,
    transformOrigin: 'center center',
    square: 'var(--ripple-size, 100%)',
    transition: 'opacity 75ms linear',
    // willChange: 'transform,opacity',
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
      accent: {},
      neutral: {},
      // positive: {},
      // info: {},
      caution: {},
      critical: {},
    },
    variant: {
      contained: {},
      outline: {},
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
    { variant: 'outline', tone: 'accent', css: { $$bgColor: '$colors$accent5' } },
    { variant: 'text', tone: 'accent', css: { $$bgColor: '$colors$accent5' } },
    // Neutral
    { variant: 'contained', tone: 'neutral', css: { '.light &': { $$bgColor: '$$bgColorDark' } } },
    { variant: 'outline', tone: 'neutral', css: { $$bgColor: '$colors$neutral5' } },
    { variant: 'text', tone: 'neutral', css: { $$bgColor: '$colors$neutral5' } },
    // // Positive
    // { variant: 'outline', tone: 'positive', css: { $$bgColor: '$colors$positive4' } },
    // { variant: 'text', tone: 'positive', css: { $$bgColor: '$colors$positive4' } },
    // // Info
    // { variant: 'outline', tone: 'info', css: { $$bgColor: '$colors$info4' } },
    // { variant: 'text', tone: 'info', css: { $$bgColor: '$colors$info4' } },
    // Caution
    // { variant: 'contained', tone: 'caution', css: { '.light &': { $$bgColor: '$$bgColorDark' } } },
    { variant: 'outline', tone: 'caution', css: { $$bgColor: '$colors$caution5' } },
    { variant: 'text', tone: 'caution', css: { $$bgColor: '$colors$caution5' } },
    // Critical
    { variant: 'outline', tone: 'critical', css: { $$bgColor: '$colors$critical5' } },
    { variant: 'text', tone: 'critical', css: { $$bgColor: '$colors$critical5' } },
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
  initialSize: number,
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
  rounding?: ButtonStyledProps['rounding'],
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
  props: any,
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
            ref.current.classList.add('pressed');
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
            ref.current.classList.remove('pressed');
            setState(ButtonState.Released);
            ref.current.click();
          }
        }
      },
    }),
    [ref, onPointerDown, onPointerUp, onKeyDown, onKeyUp, onClick, rounding],
  );

  return [eventHandlers, otherProps];
}

export const Button = forwardRef<HTMLButtonElement, ButtonStyledProps>(
  (
    { variant = 'contained', tone = 'neutral', size = 'base', rounding = 'normal', children, ...rest },
    forwardedRef,
  ) => {
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
  },
);

export const AnchorButton = forwardRef<HTMLAnchorElement, AnchorStyledProps>(
  (
    { variant = 'contained', tone = 'neutral', size = 'base', rounding = 'normal', children, ...rest },
    forwardedRef,
  ) => {
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
  },
);

export const LinkButton = forwardRef<HTMLAnchorElement, LinkStyledProps>(
  (
    { variant = 'contained', tone = 'neutral', size = 'base', rounding = 'normal', children, ...rest },
    forwardedRef,
  ) => {
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
  },
);
