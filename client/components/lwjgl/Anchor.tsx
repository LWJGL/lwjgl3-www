import { styled } from '~/theme/stitches.config';

export const Anchor = styled('a', {
  textDecoration: 'underline',
  textDecorationThickness: '1.5px',
  textUnderlineOffset: '1px',
  color: '$primary800',
  fontWeight: '$medium',
  '.dark &': {
    color: '$primary600',
  },
});
