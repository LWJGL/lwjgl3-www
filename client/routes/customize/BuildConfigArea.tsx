import { styled } from '~/theme/stitches.config';

export const BuildConfigArea = styled('div', {
  zIndex: 0,
  marginBottom: 100,
  px: '$gutter',
  h4: {
    fontSize: '$xl',
    fontWeight: '$medium',
    color: '$primary700',
  },
  md: {
    mx: '$gutter',
  },
  lg: {
    backgroundColor: '$primary100',
    border: '2px solid $dark',
    py: '$gutter',
    dark: {
      borderColor: '$darker',
    },
  },
});
