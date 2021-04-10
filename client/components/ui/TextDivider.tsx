import { styled } from '~/theme/stitches.config';
import { Text } from '~/components/ui/Text';

export const TextDivider = styled(Text, {
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
  // '--text-divider-gap': '$space$xsm',
  '--text-divider-color': '$colors$neutral300',

  '&::after,&::before': {
    content: `''`,
    flexGrow: 1,
    backgroundImage:
      'linear-gradient(to right, transparent 1%, var(--text-divider-color) 15%, var(--text-divider-color) 85%, transparent 99%)',
    height: 1,
    minWidth: '1rem',
  },

  // '&::after': {
  //   ml: 'var(--text-divider-gap)',
  // },

  // '&::before': {
  //   mr: 'var(--text-divider-gap)',
  // },

  variants: {
    align: {
      start: {
        textAlign: 'left',
        '&::before': {
          display: 'none',
        },
      },
      end: {
        textAlign: 'right',
        '&::after': {
          display: 'none',
        },
      },
    },
  },
});
