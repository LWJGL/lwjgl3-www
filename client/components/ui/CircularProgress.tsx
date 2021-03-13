import { styled, keyframes } from '~/theme/stitches.config';
import { easeInQuad as easeIn, easeOutCubic } from '~/theme/easing';

const SIZE = 44;

function getRelativeValue(value: number, min: number, max: number) {
  const clampedValue = Math.min(Math.max(min, value), max);
  return (clampedValue - min) / (max - min);
}

function easeOut(t: number) {
  return easeOutCubic(getRelativeValue(t, 0, 1));
}

const indeterminateAnimation = keyframes({
  to: {
    transform: 'rotate(360deg)',
  },
});

const indeterminateStrokeAnimation = keyframes({
  '0%': {
    strokeDasharray: '1px, 200px',
    strokeDashoffset: 0,
  },
  '50%': {
    strokeDasharray: '100px, 200px',
    strokeDashoffset: '-15px',
  },
  '100%': {
    strokeDasharray: '100px, 200px',
    strokeDashoffset: '-120px',
  },
});

const ProgressSvg = styled('svg', {
  display: 'inline-block',
  lineHeight: 1,
  color: '$primary500',
  circle: {
    stroke: 'currentcolor',
  },
  variants: {
    variant: {
      determinate: {},
      static: {
        transition: 'transform 0.3s cubic-bezier(0, 0, 0.2, 1)',
        circle: {
          transition: 'stroke-dashoffset 0.3s cubic-bezier(0, 0, 0.2, 1)',
        },
      },
      indeterminate: {
        animation: `${indeterminateAnimation} 1.8s linear infinite`,
        circle: {
          animation: `${indeterminateStrokeAnimation} 1.8s ease-in-out infinite`,
          strokeDasharray: '80px, 200px',
          strokeDashoffset: 0,
        },
      },
    },
  },
});

interface Props extends React.HTMLAttributes<any> {
  size?: number;
  style?: React.CSSProperties;
  thickness?: number;
  value?: number;
  variant?: 'determinate' | 'indeterminate' | 'static';
}

export const CircularProgress: React.FC<Props> = ({
  size = 40,
  thickness = 3.6,
  value = 0,
  variant = 'indeterminate',
  style,
  ...other
}) => {
  const circleStyle: React.CSSProperties = {};
  const rootStyle: React.CSSProperties = {};
  const rootProps: React.HTMLAttributes<any> = {};

  if (variant === 'determinate' || variant === 'static') {
    const circumference = 2 * Math.PI * ((SIZE - thickness) / 2);
    circleStyle.strokeDasharray = circumference.toFixed(3);
    rootProps['aria-valuenow'] = Math.round(value);

    if (variant === 'static') {
      circleStyle.strokeDashoffset = `${(((100 - value) / 100) * circumference).toFixed(3)}px`;
      rootStyle.transform = 'rotate(-90deg)';
    } else {
      circleStyle.strokeDashoffset = `${(easeIn((100 - value) / 100) * circumference).toFixed(3)}px`;
      rootStyle.transform = `rotate(${(easeOut(value / 70) * 270).toFixed(3)}deg)`;
    }
  }

  return (
    <ProgressSvg
      role="progressbar"
      variant={variant}
      style={{ width: size, height: size, ...rootStyle, ...style }}
      {...rootProps}
      {...other}
      viewBox={`${SIZE / 2} ${SIZE / 2} ${SIZE} ${SIZE}`}
    >
      <circle style={circleStyle} cx={SIZE} cy={SIZE} r={(SIZE - thickness) / 2} fill="none" strokeWidth={thickness} />
    </ProgressSvg>
  );
};
