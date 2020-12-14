import { styled } from '~/theme/stitches.config';

const round = (num: number) => num.toFixed(7).replace(/[.]?0+$/, '');
// const rem = (px: number) => `${round(px / 16)}rem`;
const em = (px: number, base: number = 16) => `${round(px / base)}em`;

// Adapted from tailwindcss-typography@src/styles.js
export const Prose = styled('div', {
  lineHeight: 1.75,
  'p,ul,ol,blockquote,h1,h2,h3,h4,h5,img': {
    mb: '$paragraph',
  },
  a: {
    color: '$primary800',
    textDecoration: 'underline',
    textDecorationThickness: '1.5px',
    textUnderlineOffset: '1px',
    fontWeight: '$medium',
    dark: {
      color: '$primary600',
    },
  },
  strong: {
    fontWeight: '$semibold',
  },
  ol: {
    counterReset: 'list-counter',
  },
  'ol > li': {
    counterIncrement: 'list-counter',
  },
  'ol > li::before': {
    content: 'counter(list-counter) "."',
    fontWeight: '$normal',
    color: '$neutral500',
    left: 0,
  },
  'ul > li::before': {
    content: '""',
    backgroundColor: '$neutral300',
    borderRadius: '50%',
    width: em(6, 16),
    height: em(6, 16),
    top: `calc(${em(28 / 2, 16)} - ${em(3, 16)})`,
    left: em(4, 16),
  },
  'li::before': {
    position: 'absolute',
  },
  li: {
    position: 'relative',
    pl: em(28, 16),
    mb: '$xsm',
    ':last-child': {
      mb: 0,
    },
  },
  blockquote: {
    fontWeight: '$medium',
    fontStyle: 'italic',
    color: '$caution700',
    borderLeft: '0.25rem solid $caution200',
    quotes: `"“" "”" "‘" "’"`,
    pl: em(20, 20),
  },
  'blockquote p:first-of-type::before': {
    content: 'open-quote',
  },
  'blockquote p:last-of-type::after': {
    content: 'close-quote',
  },
  h1: {
    fontWeight: '$light',
    fontSize: em(36, 16),
    lineHeight: round(40 / 36),
    b: {
      fontWeight: '$bold',
    },
  },
  h2: {
    fontWeight: '$bold',
    fontSize: em(24, 16),
    lineHeight: round(32 / 24),
  },
  h3: {
    fontWeight: '$semibold',
    fontSize: em(20, 16),
    lineHeight: round(32 / 20),
  },
  h4: {
    fontWeight: '$semibold',
    lineHeight: round(24 / 16),
  },
  pre: {
    color: '$neutral200',
    backgroundColor: '$neutral800',
    overflowX: 'auto',
  },
  '> :last-child': {
    mb: 0,
  },
  variants: {
    align: {
      center: {
        mx: 'auto',
      },
    },
    width: {
      safe: {
        maxWidth: '65ch',
        lg: {
          maxWidth: '80ch',
        },
      },
    },
    size: {
      base: {},
      auto: {
        fontSize: 'calc(1rem * var(--scale-sm, 1))',
      },
    },
  },
});

// //@ts-expect-error
// Prose.defaultProps = {
//   size: 'auto',
// };
