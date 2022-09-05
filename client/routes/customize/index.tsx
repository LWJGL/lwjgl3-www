import { PageView } from '~/routes/PageView';
import { Container } from '~/components/ui/Container';
import { BuildConfigurator } from './BuildConfigurator';

const CustomizeRoute: React.FC = () => (
  <PageView title="Customize" description="Customize your LWJGL 3 build">
    <Container css={{ position: 'relative', pt: '$gutter' }}>
      <BuildConfigurator />
    </Container>
  </PageView>
);

export default CustomizeRoute;
