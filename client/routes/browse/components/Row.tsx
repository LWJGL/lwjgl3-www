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
        backgroundColor: '$accent11',
        color: '$accent1',
        '.dark &': {
          backgroundColor: '$body',
          color: '$accent12',
        },
        a: {
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
      folder: {
        color: '$accent11',
        backgroundColor: '$neutral3',
        borderBottom: '1px solid $neutral6',
        a: {
          transition: 'filter 0.15s ease-in-out',
          padding: '$xsm $sm',
          display: 'block',
          '&:hover': {
            backgroundColor: '$accent4',
          },
          '&:active': {
            filter: 'brightness(.9)',
          },
        },
      },
      default: {
        padding: '$xsm $sm',
        color: '$neutral12',
        backgroundColor: '$neutral4',
        borderBottom: '1px solid $neutral6',
        a: {
          color: '$info11',
          textDecoration: 'underline',
        },
      },
    },
  },
  defaultVariants: {
    type: 'default',
  },
});
