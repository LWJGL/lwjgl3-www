import { PageView } from '~/routes/PageView';
import { Container } from '~/components/ui/Container';
import { ButtonVariations } from '~/components/forms/test/Button';
// import { Colors } from '~/theme/test/Colors';

const DevRoute: React.FC<{ children?: never }> = (): JSX.Element => {
  return (
    <PageView title="Dev" description="Developer page">
      <Container css={{ padding: '$safe' }}>
        <h2>Buttons</h2>
        <hr />
        <br />
        <ButtonVariations />
        {/* <br />
        <br />
        <h2>Colors</h2>
        <hr />
        <br />
        <Colors /> */}
      </Container>
    </PageView>
  );
};

export default DevRoute;
