import { styled } from '~/theme/stitches.config';
import { Breakpoint, boundaries } from '~/app/context/Breakpoint';

export const Container = styled('div', {
  maxWidth: '100vw',
  '@sm': {
    maxWidth: boundaries[Breakpoint.sm],
  },
  '@md': {
    maxWidth: boundaries[Breakpoint.md],
  },
  '@lg': {
    maxWidth: boundaries[Breakpoint.lg],
  },
  '@xl': {
    maxWidth: boundaries[Breakpoint.xl],
  },
  '@xxl': {
    maxWidth: boundaries[Breakpoint.xxl],
  },
  variants: {
    align: {
      center: {
        '@sm': {
          mx: 'auto',
        },
      },
      left: {
        '@sm': {
          mr: 'auto',
        },
      },
      right: {
        '@sm': {
          ml: 'auto',
        },
      },
    },
    padding: {
      true: {
        padding: '$safe',
      },
      x: {
        px: '$safe',
      },
    },
  },
  defaultVariants: {
    align: 'center',
  },
});
