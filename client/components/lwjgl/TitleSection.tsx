import { styled } from '~/theme/stitches.config';
import { Text } from '~/components/ui/Text';

export const TitleSection = styled(Text, {
  '--text-size': '2rem',
  lineHeight: 1,
  mt: 'calc(var(--scale-sm, 1) * -4px)', // adjust for internal & external leading
  fontWeight: '$light',
  when: {
    sm: {
      textAlign: 'center',
    },
  },
  // '> b,> strong': {
  //   fontWeight: '$bold',
  // },
  defaultVariants: {
    margin: true,
  },
});

TitleSection.defaultProps = {
  as: 'h2',
};
