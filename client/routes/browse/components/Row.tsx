import { styled } from '~/theme/stitches.config';

export const Row = styled('div', {
  wordBreak: 'break-all',

  '&:last-child': {
    borderBottom: 'none',
  },

  variants: {
    type: {
      breadcrump: {
        padding: '$xsm $sm',
        backgroundColor: '$primary700',
        color: '$primary100',
        '.dark &': {
          backgroundColor: '$dark',
          color: '$info700',
        },
        a: {
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
      folder: {
        color: '$primary900',
        backgroundColor: '$neutral200',
        borderBottom: '1px solid $neutral300',
        a: {
          transition: 'filter 0.15s ease-in-out',
          padding: '$xsm $sm',
          display: 'block',
          '&:hover': {
            backgroundColor: '$primary300',
          },
          '&:active': {
            filter: 'brightness(.9)',
          },
        },
      },
      default: {
        padding: '$xsm $sm',
        color: '$neutral900',
        backgroundColor: '$neutral200',
        borderBottom: '1px solid $neutral300',
        a: {
          color: '$info800',
          textDecoration: 'underline',
        },
      },
    },
  },
  defaultVariants: {
    type: 'default',
  },
});
