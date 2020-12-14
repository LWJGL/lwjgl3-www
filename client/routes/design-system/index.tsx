import { PageView } from '~/routes/PageView';
import { Container } from '~/components/layout/Container';
import { Grid } from '~/components/layout/Grid';
import { Text } from '~/components/ui/Text';
import { Button } from '~/components/forms/Button';
import { Dark } from '~/components/lwjgl/Dark';
import { Title } from '~/components/lwjgl/Title';

// Color Test
import { styled } from '~/theme/stitches.config';
const ColorBox = styled('div', {
  width: 100,
  height: 60,
  display: 'flex',
  justifyContent: 'center',
  textAlign: 'center',
  alignItems: 'center',
  fontSize: '$xs',

  variants: {
    type: {
      color: {
        color: 'transparent',
        ':hover': {
          color: 'white',
          textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
        },
      },
    },
  },
});
function renderPalette(color: string) {
  return (
    <>
      <ColorBox>{color}</ColorBox>
      <Hex color={`${color}50`} />
      <Hex color={`${color}100`} />
      <Hex color={`${color}200`} />
      <Hex color={`${color}300`} />
      <Hex color={`${color}400`} />
      <Hex color={`${color}500`} />
      <Hex color={`${color}600`} />
      <Hex color={`${color}700`} />
      <Hex color={`${color}800`} />
      <Hex color={`${color}900`} />
    </>
  );
}
const Hex: React.FC<{ color: string }> = ({ children, color }) => {
  return (
    <ColorBox type="color" css={{ backgroundColor: `var(--colors-${color})` }}>
      {color}
    </ColorBox>
  );
};

const DesignSystemRoute: React.FC<{ children?: never }> = () => {
  return (
    <PageView title="LWJGL Design System">
      <Grid css={{ gap: '$6', lg: { gap: '$12' } }}>
        <Container padding>
          <Title>
            LW
            <b>JGL</b> Design System
          </Title>

          <Grid
            css={{
              grid: `auto-flow / 1.5fr 2fr`,
              // gap: '$4',
              // mt: '$24',
              lg: {
                // gap: '$6',
              },
            }}
          >
            <div>
              <Button size="xl">Primary</Button>{' '}
              <Button variant="secondary" size="xl">
                Secondary
              </Button>{' '}
              <Button variant="outline" size="xl">
                Outline
              </Button>{' '}
              <Button variant="text" size="xl">
                Text
              </Button>
              <br />
              <br />
              <Button size="lg">Primary</Button>{' '}
              <Button variant="secondary" size="lg">
                Secondary
              </Button>{' '}
              <Button variant="outline" size="lg">
                Outline
              </Button>{' '}
              <Button variant="text" size="lg">
                Text
              </Button>
              <br />
              <br />
              <Button>Primary</Button> <Button variant="secondary">Secondary</Button>{' '}
              <Button variant="outline">Outline</Button> <Button variant="text">Text</Button>
              <br />
              <br />
              <Button size="sm">Primary</Button>{' '}
              <Button variant="secondary" size="sm">
                Secondary
              </Button>{' '}
              <Button variant="outline" size="sm">
                Outline
              </Button>{' '}
              <Button variant="text" size="sm">
                Text
              </Button>
            </div>
            <div>
              <Button tone="neutral">Neutral</Button>{' '}
              <Button variant="secondary" tone="neutral">
                Neutral
              </Button>{' '}
              <Button variant="outline" tone="neutral">
                Neutral
              </Button>{' '}
              <Button variant="text" tone="neutral">
                Neutral
              </Button>
              <br />
              <br />
              <Button tone="critical">Critical</Button>{' '}
              <Button variant="secondary" tone="critical">
                Critical
              </Button>{' '}
              <Button variant="outline" tone="critical">
                Critical
              </Button>{' '}
              <Button variant="text" tone="critical">
                Critical
              </Button>
              <br />
              <br />
              <Button tone="caution">Caution</Button>{' '}
              <Button variant="secondary" tone="caution">
                Caution
              </Button>{' '}
              <Button variant="outline" tone="caution">
                Caution
              </Button>{' '}
              <Button variant="text" tone="caution">
                Caution
              </Button>
              <br />
              <br />
              <Button tone="positive">Positive</Button>{' '}
              <Button variant="secondary" tone="positive">
                Positive
              </Button>{' '}
              <Button variant="outline" tone="positive">
                Positive
              </Button>{' '}
              <Button variant="text" tone="positive">
                Positive
              </Button>
              <br />
              <br />
              <Button tone="info">Info</Button>{' '}
              <Button variant="secondary" tone="info">
                Info
              </Button>{' '}
              <Button variant="outline" tone="info">
                Info
              </Button>{' '}
              <Button variant="text" tone="info">
                Info
              </Button>
            </div>
          </Grid>

          <Grid
            css={{
              grid: `repeat(11, 1fr) / auto-flow min-content`,
              // gap: '$1',
              // mt: '$12',
            }}
          >
            {renderPalette('primary')}
            {renderPalette('neutral')}
            {renderPalette('critical')}
            {renderPalette('caution')}
            {renderPalette('positive')}
            {renderPalette('info')}
          </Grid>
        </Container>

        <Dark
          css={{
            // py: '$6',
            lg: {
              // py: '$12',
            },
          }}
        >
          <Container padding>
            <Text as="h3" size={{ initial: 'xl', xl: 'xxl' }}>
              Dark Surface
            </Text>

            <Text>A simple paragraph</Text>
            <Grid css={{ gap: '$xsm', sm: { grid: 'auto-flow / repeat(2, max-content)' } }}>
              <Button variant="outline">Button 1</Button>
              <Button variant="outline">Button 2</Button>
            </Grid>
          </Container>
        </Dark>
      </Grid>
    </PageView>
  );
};

export default DesignSystemRoute;
