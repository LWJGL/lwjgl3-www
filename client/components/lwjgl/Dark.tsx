import { styled } from '~/theme/stitches.config';

export const Dark = styled('div', {
  color: '$text',
  backgroundColor: '$dark',
  '.dark &': {
    color: 'white',
    backgroundColor: '$darker',
  },
});
