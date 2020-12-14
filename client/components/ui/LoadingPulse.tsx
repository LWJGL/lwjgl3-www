import { styled } from '~/theme/stitches.config';
import { grow } from '~/theme/animations';

export const LoadingPulse = styled('div', {
  display: 'inline-block',
  opacity: 0,
  width: '1em',
  height: '1em',
  // verticalAlign: 'text-bottom',
  backgroundColor: 'currentColor',
  borderRadius: '$full',
  animation: `${grow} .75s linear infinite`,

  variants: {
    size: {
      xs: {
        width: '0.5em',
        height: '0.5em',
      },
      sm: {
        width: '0.75em',
        height: '0.75em',
      },
      lg: {
        width: '1.5em',
        height: '1.5em',
      },
      xl: {
        width: '2em',
        height: '2em',
      },
    },
  },
});
