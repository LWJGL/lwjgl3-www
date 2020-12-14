import { Text } from '~/components/ui/Text';

export const Title: React.FC<React.ComponentProps<typeof Text>> = ({
  children,
  as = 'h1',
  size = {
    xl: 'xl',
  },
  css,
}) => (
  <Text
    as={as}
    size={size}
    margin
    css={{
      lineHeight: 1,
      mt: 'calc(var(--scale-sm, 1) * -6px)', // adjust for internal & external leading
      //@ts-expect-error
      ...css,
    }}
  >
    {children}
  </Text>
);
