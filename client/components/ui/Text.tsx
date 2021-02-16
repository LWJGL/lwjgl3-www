import { styled } from '~/theme/stitches.config';

export const Text = styled('p', {
  // '--text-size': '1rem',
  fontSize: 'var(--text-size, inherit)',
  // fontSize: 'var(--text-size, 1rem)',
  variants: {
    as: {
      h1: {
        '--text-size': '2.25em',
        fontWeight: '$light',
        '> b,> strong': {
          fontWeight: '$bold',
        },
      },
      h2: {
        '--text-size': '1.75em',
        fontWeight: '$bold',
      },
      h3: {
        '--text-size': '1.25em',
        fontWeight: '$bold',
      },
      span: {},
      // h4: {
      //   '--text-size': '1rem',
      // },
      // h5: {
      //   '--text-size': '1rem',
      // },
    },
    size: {
      auto: {
        fontSize: 'calc(var(--text-size, 1rem) * var(--scale-sm, 1))',
      },
      xs: {
        fontSize: 'calc(var(--text-size, 1rem) * 0.75)',
      },
      sm: {
        fontSize: 'calc(var(--text-size, 1rem) * 0.875)',
      },
      base: {
        fontSize: 'var(--text-size, 1rem)',
      },
      lg: {
        fontSize: 'calc(var(--text-size, 1rem) * 1.125)',
      },
      xl: {
        fontSize: 'calc(var(--text-size, 1rem) * 1.25)',
      },
      xxl: {
        fontSize: 'calc(var(--text-size, 1rem) * 1.5)',
      },
    },
    margin: {
      true: {
        mb: '$paragraph',
      },
    },
  },
});
