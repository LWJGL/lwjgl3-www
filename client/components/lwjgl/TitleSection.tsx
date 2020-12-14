import { Text } from '~/components/ui/Text';

export const TitleSection: React.FC<React.ComponentProps<typeof Text>> = ({ children, as = 'h2', css }) => (
  <Text
    as={as}
    margin
    css={{
      '--text-size': '2rem',
      lineHeight: 1,
      mt: 'calc(var(--scale-sm, 1) * -4px)', // adjust for internal & external leading
      fontWeight: '$light',
      sm: {
        textAlign: 'center',
      },
      '> b,> strong': {
        fontWeight: '$bold',
      },
      //@ts-expect-error
      ...css,
    }}
  >
    {children}
  </Text>
);
