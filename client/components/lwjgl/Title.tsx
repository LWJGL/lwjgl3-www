import { styled } from '~/theme/stitches.config';
import { Text } from '~/components/ui/Text';

export const Title = styled(Text, {
  lineHeight: 1,
  mt: 'calc(var(--scale-sm, 1) * -6px)', // adjust for internal & external leading
});

//@ts-expect-error
Title.defaultProps = {
  as: 'h1',
  margin: true,
  size: {
    xl: 'xl',
  },
};
