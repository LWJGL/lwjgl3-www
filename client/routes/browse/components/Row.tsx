import { styled } from '~/theme/stitches.config';

export const Row = styled('div', {
  // backgroundColor: '$neutral800',
  // color: '$primary50',
  // userSelect: 'none',
  // padding: '$xsm $sm',
  // borderBottom: '1px solid $neutral700',

  // a: {
  //   display: 'block',
  //   color: '$primary200',
  // },
  // 'a[download]': {
  //   color: '$info400',
  // },

  ':last-child': {
    borderBottom: 'none',
  },

  variants: {
    type: {
      breadcrump: {
        padding: '$xsm $sm',
        backgroundColor: '$primary700',
        color: '$primary100',
        dark: {
          backgroundColor: '$dark',
          color: '$info700',
        },
        a: {
          ':hover': {
            textDecoration: 'underline',
          },
        },
      },
      folder: {
        color: '$primary800',
        backgroundColor: '$neutral200',
        borderBottom: '1px solid $neutral300',
        a: {
          padding: '$xsm $sm',
          display: 'block',
          ':hover': {
            backgroundColor: '$primary200',
            // color: '$neutral50',
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
          // ':hover': { color: '$caution700' },
        },
      },
    },
  },
});

//@ts-expect-error
Row.defaultProps = {
  type: 'default',
};
