import { styled } from '~/theme/stitches.config';
import { Text } from '~/components/ui/Text';

export const TitleSection = styled('h2', Text, {
  '--text-size': '2rem',
  lineHeight: 1,
  mt: 'calc(var(--scale-sm, 1) * -4px)', // adjust for internal & external leading
  fontWeight: '$light',
  '@sm': {
    textAlign: 'center',
  },
  // '> b,> strong': {
  //   fontWeight: '$bold',
  // },
  defaultVariants: {
    margin: true,
  },
});
