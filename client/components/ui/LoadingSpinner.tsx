import { styled } from '~/theme/stitches.config';
import { spin } from '~/theme/animations';

const Svg = styled('svg', {
  animation: `${spin} 1s linear infinite`,
  circle: {
    opacity: 0.25,
  },
  path: {
    opacity: 0.75,
  },
});

interface Props extends React.ComponentProps<typeof Svg> {
  size?: number;
}

export const LoadingSpinner: React.FC<Props> = ({ size = 24, ...rest }) => {
  return (
    <Svg
      role="status"
      aria-hidden={true}
      focusable="false"
      fill="none"
      width={size}
      height={size}
      viewBox={`0 0 24 24`}
      {...rest}
    >
      <title>Loading</title>
      <circle cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4}></circle>
      <path
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </Svg>
  );
};
