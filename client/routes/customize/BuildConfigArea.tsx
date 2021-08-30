import { styled } from '~/theme/stitches.config';

export const BuildConfigArea = styled('div', {
  zIndex: 0,
  mb: 100,
  pl: '$gutter',
  pr: '$gutter',
  h4: {
    fontSize: '$xl',
    fontWeight: '$medium',
  },
  '@md': {
    ml: '$gutter',
    mr: '$gutter',
  },
  '@lg': {
    backgroundColor: '$accent3',
    border: '2px solid $accent12',
    '.dark &': {
      borderColor: '$accent1',
    },
    py: '$gutter',
  },
});
