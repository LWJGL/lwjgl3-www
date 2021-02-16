import { styled } from '~/theme/stitches.config';

export const BuildConfigArea = styled('div', {
  zIndex: 0,
  mb: 100,
  pl: '$gutter',
  pr: '$gutter',
  h4: {
    fontSize: '$xl',
    fontWeight: '$medium',
    color: '$primary700',
  },
  when: {
    md: {
      ml: '$gutter',
      mr: '$gutter',
    },
    lg: {
      backgroundColor: '$primary100',
      border: '2px solid $dark',
      py: '$gutter',
      dark: {
        borderColor: '$darker',
      },
    },
  },
});
