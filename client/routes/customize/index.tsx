import { PageView } from '~/routes/PageView';
import { Container } from '~/components/layout/Container';
import { Provider } from './Store';
import { BuildConfigurator } from './BuildConfigurator';

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
