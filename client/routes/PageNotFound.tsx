import { useDocumentTitle } from '~/hooks/useDocumentTitle';
import { Container } from '~/components/layout/Container';
import { Text } from '~/components/ui/Text';
import { Title } from '~/components/lwjgl/Title';

export const PageNotFound: React.FC<{ children?: never }> = () => {
  useDocumentTitle('Page not Found');
  return (
    <Container as="section" padding css={{ textAlign: 'center' }}>
      <Title css={{ fontWeight: '$semibold', color: '$caution600' }}>404</Title>
      <Text>Page not found</Text>
    </Container>
  );
};
