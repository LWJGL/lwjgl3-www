import { styled } from '~/theme/stitches.config';
import { grow } from '~/theme/animations';

export const LoadingPulse = styled('div', {
  display: 'inline-block',
  opacity: 0,
  square: '1em',
  // verticalAlign: 'text-bottom',
  backgroundColor: 'currentColor',
  borderRadius: '$full',
  animation: `${grow} .75s linear infinite`,

  variants: {
    size: {
      xs: {
        square: '0.5em',
      },
      sm: {
        square: '0.75em',
      },
      lg: {
        square: '1.5em',
      },
      xl: {
        square: '2em',
      },
    },
  },
});
