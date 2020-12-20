import { styled } from '~/theme/stitches.config';
import { Breakpoint, boundaries } from '~/theme/breakpoints';

export const Container = styled('div', {
  maxWidth: '100vw',
  sm: {
    maxWidth: boundaries[Breakpoint.sm],
  },
  md: {
    maxWidth: boundaries[Breakpoint.md],
  },
  lg: {
    maxWidth: boundaries[Breakpoint.lg],
  },
  xl: {
    maxWidth: boundaries[Breakpoint.xl],
  },
  xxl: {
    maxWidth: boundaries[Breakpoint.xxl],
  },
  variants: {
    align: {
      center: {
        sm: {
          mx: 'auto',
        },
      },
      left: {
        sm: {
          mr: 'auto',
        },
      },
      right: {
        sm: {
          ml: 'auto',
        },
      },
    },
    padding: {
      true: {
        padding: '$safe',
        // 'md-down': {
        //   py: '$xl',
        // },
      },
      x: {
        px: '$safe',
      },
    },
  },
});

type ContainerType = typeof Container;
export type ContainerProps = React.ComponentProps<ContainerType>;

//@ts-expect-error
Container.defaultProps = {
  align: 'center',
};
