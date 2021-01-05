import { useEffect, useState, useRef, useMemo } from 'react';
import { styled, css } from '~/theme/stitches.config';

// Button style is a mix of
// a) Material Buttons: https://material.io/components/buttons
// b) Tailwind UI Buttons: https://tailwindui.com/components/application-ui/elements/buttons

const RIPPLE_DURATION_MS = 225; // Corresponds to ripple translate duration (i.e. activation animation duration)
const DEACTIVATION_MS = 150; // Corresponds to ripple fade-out duration (i.e. deactivation animation duration)
const INITIAL_ORIGIN_SCALE = 0.6;

const fgRadiusIn = css.keyframes({
  from: {
    animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'translate(var(--ripple-translate-start, 0)) scale(1)',
  },
  to: {
    transform: 'translate(var(--ripple-translate-end, 0)) scale(var(--ripple-scale, 1))',
  },
});

const fgOpacityIn = css.keyframes({
  from: {
    animationTimingFunction: 'linear',
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

const fgOpacityOut = css.keyframes({
  from: {
    animationTimingFunction: 'linear',
    opacity: 1,
  },
  to: {
    opacity: 0,
  },
});

const ButtonLabel = styled('span', {
  position: 'relative',
});

export const StyledButton = styled('button', {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '$medium',
  userSelect: 'none',
  touchAction: 'none',
  border: '1px solid transparent',
  willChange: 'transform,opacity,border,box-shadow',
  transition: 'box-shadow, border-color 150ms cubic-bezier(0.4, 0, 0.2, 1)', // Transition only box-shadow instead of all like Tailwind does, feels faster
  '-webkit-font-smoothing': 'antialiased',
  '-webkit-user-drag': 'none',
  '--ripple-size': 0, // initial circle size
  '--ripple-scale': 1, // target scale
  '--ripple-left': 0,
  '--ripple-top': 0,
  '--ripple-translate-start': 0,
  '--ripple-translate-end': 0,

  ':active,:focus': {
    outline: 'none',
  },

  ':active': {
    transform: 'translateY(1px)',
  },

  // Ripple
  position: 'relative',

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
      promote: {},
    },
    rounding: {
      normal: {
        px: '$sm',
        py: '$xsm',
        borderRadius: '$md',
        lineHeight: '1.5rem',
      },
      icon: {
        borderRadius: '$full',
        width: '2em',
        height: '2em',
      },
    },
    fill: {
      auto: {
        display: 'flex',
        sm: {
          display: 'inline-flex',
        },
      },
      full: {
        display: 'flex',
      },
    },
  },
});

type StyledButtonType = typeof StyledButton;
export type ButtonProps = React.ComponentProps<StyledButtonType>;

const Ripple = styled('span', {
  position: 'absolute',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  borderRadius: '$md',
  top: 0,
  left: 0,
  boxSizing: 'content-box',
  pointerEvents: 'none',
  zIndex: 0,
  '::after': {
    content: `""`,
    position: 'absolute',
    borderRadius: '50%',
    opacity: 0,
    backgroundColor: '$black',
    top: 0,
    left: 0,
    transformOrigin: 'center center',
    width: 'var(--ripple-size, 100%)',
    height: 'var(--ripple-size, 100%)',
    transition: 'opacity 75ms linear',
    willChange: 'transform,opacity',
    // transform: 'scale(1)',
    animation: `${fgOpacityOut} ${DEACTIVATION_MS}ms`,
    transform: 'translate(var(--ripple-translate-end, 0)) scale(var(--ripple-scale, 1))',
  },
  '&.pressed': {
    '::after': {
      animation: `${fgRadiusIn} ${RIPPLE_DURATION_MS}ms forwards,${fgOpacityIn} 75ms forwards`,
    },
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
      promote: {},
    },
    variant: {
      base: {
        '::after': {
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
});

Ripple.compoundVariant({ rounding: 'normal', size: 'xs' }, { borderRadius: '$rounded' });
StyledButton.compoundVariant(
  { rounding: 'normal', size: 'xs' },
  { borderRadius: '$rounded', px: '$xsm', py: '$xxsm', lineHeight: '1rem' }
);
StyledButton.compoundVariant({ rounding: 'normal', size: 'sm' }, { lineHeight: '1rem' });
StyledButton.compoundVariant({ rounding: 'normal', size: 'xl' }, { px: '$gutter', py: '$sm' });
StyledButton.compoundVariant({ rounding: 'icon', size: 'xs' }, { width: '1.7rem', height: '1.7rem' });
StyledButton.compoundVariant({ rounding: 'icon', size: 'sm' }, { width: '2.1rem', height: '2.1rem' });
StyledButton.compoundVariant({ rounding: 'icon', size: 'base' }, { width: '2.5rem', height: '2.5rem' });
StyledButton.compoundVariant({ rounding: 'icon', size: 'lg' }, { width: '2.5rem', height: '2.5rem' });
StyledButton.compoundVariant({ rounding: 'icon', size: 'xl' }, { width: '3rem', height: '3rem' });

function generateVariants(tone: ButtonProps['tone'], color: any = tone) {
  // Base
  StyledButton.compoundVariant(
    { variant: 'base', tone },
    {
      color: `$${color}50`,
      backgroundColor: `$${color}600`,
      boxShadow: '$md',
      ':focus': {
        boxShadow: `0 0 0 3px $outline_${color}`,
        borderColor: `$${color}700`,
      },
      ':focus:not(:focus-visible)': {
        boxShadow: '$md',
      },
      ':focus:not(:-moz-focusring)': {
        boxShadow: '$md',
      },
      ':hover,:active': {
        backgroundColor: `$${color}700`,
      },
    }
  );

  // Secondary
  StyledButton.compoundVariant(
    { variant: 'secondary', tone },
    {
      color: `$${color}700`,
      backgroundColor: `$${color}200`,
      ':focus': {
        borderColor: `$${color}400`,
        boxShadow: `0 0 0 3px $outline_${color}`,
      },
      ':focus:not(:focus-visible)': {
        borderColor: `$${color}300`,
        boxShadow: 'none',
      },
      ':focus:not(:-moz-focusring)': {
        borderColor: `$${color}300`,
        boxShadow: 'none',
      },
      ':hover,:active': {
        color: `$${color}800`,
        backgroundColor: `$${color}300`,
      },
    }
  );

  // Outline
  StyledButton.compoundVariant(
    { variant: 'outline', tone },
    {
      color: `$${color}600`,
      borderColor: `$${color}400`,
      boxShadow: '$sm',
      ':focus': {
        borderColor: `$${color}500`,
        boxShadow: `0 0 0 3px $outline_${color}`,
      },
      ':focus:not(:focus-visible)': {
        borderColor: `$${color}600`,
        boxShadow: '$sm',
      },
      ':focus:not(:-moz-focusring)': {
        borderColor: `$${color}600`,
        boxShadow: '$sm',
      },
      ':hover,:active': {
        color: `$${color}700`,
        borderColor: `$${color}600`,
        backgroundColor: `$${color}50`,
      },
    }
  );

  // Text
  StyledButton.compoundVariant(
    { variant: 'text', tone },
    {
      color: `$${color}600`,
      ':focus': {
        boxShadow: `0 0 0 3px $outline_${color}`,
      },
      ':focus:not(:focus-visible)': {
        boxShadow: 'none',
      },
      ':focus:not(:-moz-focusring)': {
        boxShadow: 'none',
      },
      ':hover,:active': {
        color: `$${color}700`,
        backgroundColor: `$${color}50`,
      },
    }
  );
}

function generateRippleVariants(
  variant: ButtonProps['variant'],
  level: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
) {
  tones.forEach((tone) => {
    Ripple.compoundVariant({ variant, tone }, { '::after': { backgroundColor: `$${tone}${level}` } });
  });
}

const tones: Array<ButtonProps['tone']> = ['primary', 'neutral', 'critical', 'caution', 'positive', 'info', 'promote'];

// Tone per variant
tones.forEach((tone) => {
  generateVariants(tone);
});

// Ripple tone variants
generateRippleVariants('base', 800);
generateRippleVariants('secondary', 400);
generateRippleVariants('outline', 100);
generateRippleVariants('text', 100);

//@ts-ignore
StyledButton.defaultProps = Ripple.defaultProps = {
  size: 'base',
  variant: 'base',
  tone: 'primary',
  rounding: 'normal',
};

interface Coordinates {
  x: number;
  y: number;
}

interface Translation {
  start: Coordinates;
  end: Coordinates;
}

function getBoundedRadius(frame: DOMRect): number {
  return Math.sqrt(Math.pow(frame.width, 2) + Math.pow(frame.height, 2)) + 10;
}

function getNormalizedEventCoords(
  e: React.SyntheticEvent<HTMLButtonElement, PointerEvent>,
  frame: DOMRect
): Coordinates {
  const x = window.pageXOffset;
  const y = window.pageYOffset;
  const documentX = x + frame.left;
  const documentY = y + frame.top;

  let normalizedX = e.nativeEvent.pageX - documentX;
  let normalizedY = e.nativeEvent.pageY - documentY;

  return { x: normalizedX, y: normalizedY };
}

function getTranslationCoordinates(
  e: React.SyntheticEvent<HTMLButtonElement, PointerEvent | KeyboardEvent>,
  frame: DOMRect,
  initialSize: number
): Translation {
  const halfSize = initialSize / 2;
  const start: Coordinates =
    e.type === 'pointerdown'
      ? getNormalizedEventCoords(e as React.SyntheticEvent<HTMLButtonElement, PointerEvent>, frame)
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

function initTransition(
  e: React.SyntheticEvent<HTMLButtonElement, PointerEvent | KeyboardEvent>,
  btn: HTMLButtonElement,
  rounding?: ButtonProps['rounding']
) {
  const isUnbounded = rounding === 'icon';
  const frame = btn.getBoundingClientRect();
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
  btn.style.setProperty('--ripple-size', `${initialSize}px`);
  btn.style.setProperty('--ripple-scale', (maxRadius / initialSize).toString(10));
  btn.style.setProperty('--ripple-translate-start', translateStart);
  btn.style.setProperty('--ripple-translate-end', translateEnd);
}

enum ButtonState {
  Idle,
  Pressed,
  Released,
}

export const Button: React.FC<ButtonProps> = ({
  //@ts-expect-error
  as,
  type,
  onKeyDown,
  onKeyUp,
  onPointerDown,
  onPointerUp,
  onClick,
  children,
  ...rest
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const rippleRef = useRef<HTMLSpanElement>(null);
  // Use timeout to allow for the ripple animation to complete even when we release the button
  const animationTimeout = useRef(0);
  // Keep a reference to the current state so we can read it in our timeout handler
  const currentState = useRef(ButtonState.Idle);
  // Simple state machine, we initially use the Idle state to avoid unecessary DOM mutations
  const [state, setState] = useState<ButtonState>(ButtonState.Idle);

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
  }, [state]);

  const eventHandlers = useMemo(
    () => ({
      onPointerDown: (e: React.SyntheticEvent<HTMLButtonElement, PointerEvent>) => {
        if (ref.current === null) {
          return;
        }
        if (onPointerDown) {
          //@ts-ignore
          onPointerDown.call(ref.current, e);
        }
        e.currentTarget.setPointerCapture(e.nativeEvent.pointerId);
        initTransition(e, ref.current, rest.rounding);
        setState(ButtonState.Pressed);
      },
      onPointerUp: (e: React.SyntheticEvent<HTMLButtonElement, PointerEvent>) => {
        if (ref.current === null) {
          return;
        }
        if (onPointerUp) {
          //@ts-ignore
          onPointerUp.call(ref.current, e);
        }
        e.currentTarget.releasePointerCapture(e.nativeEvent.pointerId);
        setState(ButtonState.Released);
      },
      onClick: (e: React.SyntheticEvent<HTMLButtonElement, MouseEvent>) => {
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
          //@ts-ignore
          onClick.call(ref.current, e);
        }
      },
      onKeyDown: (e: React.SyntheticEvent<HTMLButtonElement, KeyboardEvent>) => {
        if (ref.current === null) {
          return;
        }
        if (onKeyDown) {
          //@ts-ignore
          onKeyDown.call(ref.current, e);
        }
        if (e.nativeEvent.key === 'Enter' || e.nativeEvent.key === ' ') {
          e.preventDefault();
          // Check if we are in a Pressed state already to avoid key repeat
          // TODO: This behavior should be customizable
          if (currentState.current !== ButtonState.Pressed) {
            initTransition(e, ref.current, rest.rounding);
            setState(ButtonState.Pressed);
          }
        }
      },
      onKeyUp: (e: React.SyntheticEvent<HTMLButtonElement, KeyboardEvent>) => {
        if (ref.current === null) {
          return;
        }
        if (onKeyUp) {
          //@ts-ignore
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
    [onPointerDown, onPointerUp, onKeyDown, onKeyUp, onClick, rest.rounding]
  );

  return (
    <StyledButton
      as={as}
      type={type === undefined && as === undefined ? 'button' : type}
      ref={ref}
      {...eventHandlers}
      {...rest}
    >
      <Ripple ref={rippleRef} variant={rest.variant} tone={rest.tone} size={rest.size} rounding={rest.rounding} />
      <ButtonLabel>{children}</ButtonLabel>
    </StyledButton>
  );
};
