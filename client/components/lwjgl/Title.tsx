import { styled } from '~/theme/stitches.config';
import { H1, Text } from '~/components/ui/Text';

export const Title = styled(H1, Text, {
  lineHeight: 1,
  mt: 'calc(var(--scale-sm, 1) * -6px)', // adjust for internal & external leading
  defaultVariants: {
    margin: true,
    size: 'auto',
  },
});
