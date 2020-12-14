import { PageView } from '~/routes/PageView';
import { BuildConfigurator } from './BuildConfigurator';
import { Container } from '~/components/layout/Container';
import { Provider } from './Store';

const CustomizeRoute: React.FC<{ children?: never }> = () => (
  <PageView title="Customize" description="Customize your LWJGL 3 build">
    <Container css={{ position: 'relative', pt: '$gutter' }}>
      <Provider>
        <BuildConfigurator />
      </Provider>
    </Container>
  </PageView>
);

export default CustomizeRoute;
