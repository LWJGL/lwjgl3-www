import { PageView } from '~/routes/PageView';
import { Customize, Browse } from '~/routes';
import { Container } from '~/components/ui/Container';
import { Grid } from '~/components/layout/Grid';
import { Box } from '~/components/ui/Box';
import { Text, Heading } from '~/components/ui/Text';
import { LinkButton, AnchorButton } from '~/components/forms/Button';
import { Dark } from '~/components/lwjgl/Dark';
import { Anchor } from '~/components/lwjgl/Anchor';
import { Title } from '~/components/lwjgl/Title';

// Icons
import { Icon } from '~/components/ui/Icon';
import '~/theme/icons/fa/brands/github';
import '~/theme/icons/fa/solid/check-square';
import '~/theme/icons/fa/solid/folder';

const buttonSizes: React.ComponentProps<typeof LinkButton>['size'] = {
  '@initial': 'lg',
  '@xl': 'xl',
};

const DownloadRoute: React.FC = (): JSX.Element => {
  return (
    <PageView title="Download" description="Download LWJGL 3">
      <Container padding>
        <Title>
          Download LW
          <b>JGL</b>
        </Title>

        <Grid css={{ grid: 'auto-flow / 1fr', gap: '$paragraph', '@lg': { grid: 'auto-flow / repeat(3, 1fr)' } }}>
          <Text>All official are available for download from GitHub:</Text>
          <Box css={{ '@lg': { gridRow: 2 } }}>
            <AnchorButton
              fill="auto"
              tone="accent"
              size={buttonSizes}
              href="https://github.com/LWJGL/lwjgl3/releases"
              rel="noopener external"
              target="_blank"
            >
              <Icon name="fa/brands/github" css={{ mr: '$xsm' }} />
              Download from GitHub
            </AnchorButton>
          </Box>

          <Text>You can customize your LWJGL build or use the latest stable & nightly releases:</Text>
          <Box css={{ '@lg': { gridRow: 2 } }}>
            <LinkButton tone="accent" fill="auto" size={buttonSizes} to="/customize" onPointerDown={Customize.preload}>
              <Icon name="fa/solid/check-square" css={{ mr: '$xsm' }} />
              Customize LWJGL 3
            </LinkButton>
          </Box>

          <Text>Or you can browse and download individual LWJGL artifacts:</Text>
          <Box css={{ '@lg': { gridRow: 2 } }}>
            <LinkButton
              tone="accent"
              fill="auto"
              variant="outline"
              size={buttonSizes}
              to="/browse"
              onPointerDown={Browse.preload}
            >
              <Icon name="fa/solid/folder" css={{ mr: '$xsm' }} />
              Browse LWJGL files
            </LinkButton>
          </Box>
        </Grid>
      </Container>

      <Dark>
        <Container padding>
          <Heading level={2} css={{ mt: -4 }}>
            Build from source?
          </Heading>

          <Text margin>Click below if you prefer to build from source:</Text>
          <Grid css={{ gap: '$xsm', '@sm': { grid: 'auto-flow / repeat(2, max-content)' } }}>
            <LinkButton variant="outline" to="/source">
              Source
            </LinkButton>
            <LinkButton variant="outline" to="/guide#build-instructions">
              Build instructions
            </LinkButton>
          </Grid>
        </Container>
      </Dark>

      <Container padding>
        <Text margin>
          Broken download? Let us know in the{' '}
          <Anchor href="http://forum.lwjgl.org/" rel="noopener external">
            forum
          </Anchor>
          .
        </Text>

        <Heading level={2}>Looking for LWJGL 2?</Heading>

        <Text margin>
          LWJGL 2 has moved but is still available. Please follow the links below to find what you're looking for:
        </Text>

        <Grid css={{ gap: '$xsm', '@sm': { grid: 'auto-flow / repeat(2, max-content)' } }}>
          <AnchorButton variant="outline" href="http://legacy.lwjgl.org/" rel="noopener external">
            LWJGL 2 WEBSITE
          </AnchorButton>
          <AnchorButton variant="outline" href="http://wiki.lwjgl.org/" rel="noopener external">
            LWJGL 2 WIKI
          </AnchorButton>
        </Grid>
      </Container>
    </PageView>
  );
};

export default DownloadRoute;
