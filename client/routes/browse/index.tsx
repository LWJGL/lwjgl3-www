import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PageView } from '~/routes/PageView';
import { Browser } from './components/Browser';
import { PathResource } from './PathResource';
import { Container } from '~/components/layout/Container';

const BrowseRoute: React.FC<{ children?: never }> = () => {
  const params = useParams();
  const path = params['*'] !== undefined ? params['*'] : '';

  useEffect(() => {
    PathResource.load(path);
  }, [path]);

  return (
    <PageView title="Browse" description="Browse LWJGL files">
      <Container padding>
        <Browser path={path} />
      </Container>
    </PageView>
  );
};

export default BrowseRoute;
