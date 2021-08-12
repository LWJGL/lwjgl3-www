import { useParams } from '~/components/router/client';
import { PageView } from '~/routes/PageView';
import { Browser } from './components/Browser';
import { Container } from '~/components/ui/Container';

const BrowseRoute: React.FC<{ children?: never }> = () => {
  const params = useParams();
  const path = params['*'] !== undefined ? params['*'] : '';

  return (
    <PageView title={path.length > 0 ? `/${path}` : 'Browser'} description="Browse LWJGL files">
      <Container padding={{ '@initial': false, '@md': true }}>
        <Browser path={path} />
      </Container>
    </PageView>
  );
};

export default BrowseRoute;
