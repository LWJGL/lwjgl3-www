import { styled } from '~/theme/stitches.config';
import { Breakpoint, boundaries } from '~/app/context/Breakpoint';

export const Container = styled('div', {
  maxWidth: '100vw',
  when: {
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
  },
  variants: {
    align: {
      center: {
        when: {
          sm: {
            mx: 'auto',
          },
        },
      },
      left: {
        when: {
          sm: {
            mr: 'auto',
          },
        },
      },
      right: {
        when: {
          sm: {
            ml: 'auto',
          },
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

type ContainerType = typeof Container;
export type ContainerProps = React.ComponentProps<ContainerType>;
