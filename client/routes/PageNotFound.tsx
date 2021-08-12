import { styled } from '~/theme/stitches.config';
import { useDocumentTitle } from '~/hooks/useDocumentTitle';
import { Container } from '~/components/ui/Container';
import { Text } from '~/components/ui/Text';
import { Title } from '~/components/lwjgl/Title';

const TitleSection = styled('section', Container, { textAlign: 'center' });

export const PageNotFound: React.FC<{ children?: never }> = () => {
  useDocumentTitle('Page not Found');
  return (
    <TitleSection padding>
      <Title css={{ fontWeight: '$semibold', color: '$caution600' }}>404</Title>
      <Text>Page not found</Text>
    </TitleSection>
  );
};
