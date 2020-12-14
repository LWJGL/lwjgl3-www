import { useRef, useMemo } from 'react';
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
    // opacity: 0.24,
    opacity: 1,
  },
});

const fgOpacityOut = css.keyframes({
  from: {
    animationTimingFunction: 'linear',
    // opacity: 0.24,
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
  border: '1px solid transparent',
  willChange: 'transform,opacity,border,box-shadow',
  transition: 'box-shadow, border-color 150ms cubic-bezier(0.4, 0, 0.2, 1)', // Transition only box-shadow instead of all like Tailwind does, feels faster
  '-webkit-font-smoothing': 'antialiased',
  '-webkit-tap-highlight-color': 'rgba(0,0,0,0)',
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
    backgroundColor: '$white',
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

function generateVariants(tone: React.ComponentProps<typeof StyledButton>['tone'], color: any = tone) {
  // Base
  StyledButton.compoundVariant(
    { variant: 'base', tone },
    {
      color: `$${color}50`,
      backgroundColor: tone === 'primary' ? `$${color}700` : `$${color}600`,
      boxShadow: '$md',
      ':focus': {
        boxShadow: `0 0 0 3px $outline_${color}`,
        borderColor: `$${color}800`,
      },
      ':focus:not(:focus-visible)': {
        boxShadow: '$md',
      },
      ':focus:not(:-moz-focusring)': {
        boxShadow: '$md',
      },
      ':hover,:active': {
        backgroundColor: tone === 'primary' ? `$${color}800` : `$${color}500`,
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
  variant: React.ComponentProps<typeof StyledButton>['variant'],
  level: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
) {
  tones.forEach((tone) => {
    Ripple.compoundVariant({ variant, tone }, { '::after': { backgroundColor: `$${tone}${level}` } });
  });
}

const tones: Array<React.ComponentProps<typeof StyledButton>['tone']> = [
  'primary',
  'neutral',
  'critical',
  'caution',
  'positive',
  'info',
  'promote',
];

// Tone per variant
tones.forEach((tone) => {
  generateVariants(tone);
});

// Ripple tone variants
generateRippleVariants('base', 700);
generateRippleVariants('secondary', 200);
generateRippleVariants('outline', 100);
generateRippleVariants('text', 100);

//@ts-ignore
StyledButton.defaultProps = Ripple.defaultProps = {
  size: 'base',
  variant: 'base',
  tone: 'primary',
  rounding: 'normal',
};

function getBoundedRadius(frame: DOMRect) {
  return Math.sqrt(Math.pow(frame.width, 2) + Math.pow(frame.height, 2)) + 10;
}

function getNormalizedEventCoords(e: React.SyntheticEvent<HTMLButtonElement, PointerEvent>, frame: DOMRect) {
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
) {
  const halfSize = initialSize / 2;
  const startPoint =
    e.type === 'pointerdown'
      ? getNormalizedEventCoords(e as React.SyntheticEvent<HTMLButtonElement, PointerEvent>, frame)
      : {
          x: frame.width / 2,
          y: frame.height / 2,
        };

  // Center the element around the start point.
  startPoint.x -= halfSize;
  startPoint.y -= halfSize;

  const endPoint = {
    x: frame.width / 2 - halfSize,
    y: frame.height / 2 - halfSize,
  };

  return {
    startPoint,
    endPoint,
  };
}

type Props = React.RefAttributes<HTMLButtonElement> & React.ComponentProps<typeof StyledButton>;

export const Button: React.FC<Props> = ({
  type = 'button',
  onPointerDown,
  onPointerUp,
  onKeyDown,
  onKeyUp,
  children,
  ...rest
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const rippleRef = useRef<HTMLSpanElement>(null);
  const animationTimeout = useRef(0);
  const isPressed = useRef(false);

  // Register handlers
  const rippleHandlers = useMemo(() => {
    function init(e: React.SyntheticEvent<HTMLButtonElement, PointerEvent | KeyboardEvent>) {
      if (ref.current === null) {
        return;
      }
      const isUnbounded = rest.rounding === 'icon';
      const frame = ref.current.getBoundingClientRect();
      const maxDim = Math.max(frame.height, frame.width);
      const maxRadius = isUnbounded ? maxDim : getBoundedRadius(frame);

      // Ripple is sized as a fraction of the largest dimension of the surface, then scales up using a CSS scale transform
      let initialSize = Math.floor(maxDim * INITIAL_ORIGIN_SCALE);

      // Unbounded ripple size should always be even number to equally center align.
      if (isUnbounded && initialSize % 2 !== 0) {
        initialSize -= 1;
      }

      const { startPoint, endPoint } = getTranslationCoordinates(e, frame, initialSize);
      const translateStart = `${startPoint.x}px, ${startPoint.y}px`;
      const translateEnd = `${endPoint.x}px, ${endPoint.y}px`;

      // Update Custom Properties
      ref.current.style.setProperty('--ripple-size', `${initialSize}px`);
      ref.current.style.setProperty('--ripple-scale', (maxRadius / initialSize).toString(10));
      ref.current.style.setProperty('--ripple-translate-start', translateStart);
      ref.current.style.setProperty('--ripple-translate-end', translateEnd);

      if (animationTimeout.current) {
        clearTimeout(animationTimeout.current);
        animationTimeout.current = 0;
        deactivate();
        requestAnimationFrame(activate);
      } else {
        activate();
      }

      isPressed.current = true;
    }

    function activate() {
      if (rippleRef.current === null) {
        return;
      }

      animationTimeout.current = window.setTimeout(() => {
        animationTimeout.current = 0;
        deactivate();
      }, RIPPLE_DURATION_MS);

      rippleRef.current.classList.add('pressed');
    }

    function deactivate() {
      if (rippleRef.current === null) {
        return;
      }

      if (!animationTimeout.current && isPressed.current === false) {
        rippleRef.current.classList.remove('pressed');
      }
    }

    return {
      onPointerDown: (e: React.SyntheticEvent<HTMLButtonElement, PointerEvent>) => {
        if (onPointerDown) {
          //@ts-ignore
          onPointerDown.call(ref.current, e);
        }
        init(e);
      },
      onPointerUp: (e: React.SyntheticEvent<HTMLButtonElement, PointerEvent>) => {
        if (onPointerUp) {
          //@ts-ignore
          onPointerUp.call(ref.current, e);
        }
        if (isPressed.current) {
          isPressed.current = false;
          deactivate();
        }
      },
      onKeyDown: (e: React.SyntheticEvent<HTMLButtonElement, KeyboardEvent>) => {
        if (onKeyDown) {
          //@ts-ignore
          onKeyDown.call(ref.current, e);
        }
        if (e.nativeEvent.key === 'Enter' || e.nativeEvent.key === ' ') {
          init(e);
        }
      },
      onKeyUp: (e: React.SyntheticEvent<HTMLButtonElement, KeyboardEvent>) => {
        if (onKeyUp) {
          //@ts-ignore
          onKeyUp.call(ref.current, e);
        }
        if (isPressed.current) {
          isPressed.current = false;
          deactivate();
        }
      },
    };
  }, [rest.rounding, onPointerDown, onPointerUp, onKeyDown, onKeyUp]);

  return (
    <StyledButton type={type} ref={ref} {...rippleHandlers} {...rest}>
      <Ripple ref={rippleRef} variant={rest.variant} tone={rest.tone} size={rest.size} rounding={rest.rounding} />
      <ButtonLabel>{children}</ButtonLabel>
    </StyledButton>
  );
};
