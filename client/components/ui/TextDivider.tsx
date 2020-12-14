import { styled } from '~/theme/stitches.config';
import { Text } from '~/components/ui/Text';

export const TextDivider = styled(Text, {
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
  '--text-divider-gap': 'var(--space-xsm)',
  '--text-divider-color': 'var(--colors-neutral300)',

  '::after,::before': {
    content: `''`,
    flexGrow: 1,
    // backgroundColor: 'var(--text-divider-color, $neutral200)',
    backgroundImage:
      'linear-gradient(to right, transparent 1%, var(--text-divider-color, silver) 15%, var(--text-divider-color, silver) 85%, transparent 99%)',
    height: 1,
    minWidth: '1rem',
  },

  // '::after': {
  //   marginLeft: 'var(--text-divider-gap, 1rem)',
  // },

  // '::before': {
  //   marginRight: 'var(--text-divider-gap, 1rem)',
  // },

  variants: {
    align: {
      start: {
        textAlign: 'left',
        '::before': {
          display: 'none',
        },
      },
      end: {
        textAlign: 'right',
        '::after': {
          display: 'none',
        },
      },
    },
  },
});
