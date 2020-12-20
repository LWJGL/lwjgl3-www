import { PageView } from '~/routes/PageView';
import { CustomizePreload, BrowsePreload } from '../';
import { Container } from '~/components/layout/Container';
import { Grid } from '~/components/layout/Grid';
import { Box } from '~/components/layout/Box';
import { Text } from '~/components/ui/Text';
import { LinkButton, AnchorButton } from '~/components/ui/LinkButton';
import type { LinkButtonProps } from '~/components/ui/LinkButton';
import { Dark } from '~/components/lwjgl/Dark';
import { Anchor } from '~/components/lwjgl/Anchor';
import { Title } from '~/components/lwjgl/Title';
// import { ScreenLock } from '~/components/layout/ScreenLock';

// Icons
import { Icon } from '~/components/ui/Icon';
import '~/theme/icons/fa/brands/github';
import '~/theme/icons/fa/solid/check-square';
import '~/theme/icons/fa/solid/folder';

const buttonSizes: LinkButtonProps['size'] = {
  initial: 'lg',
  xl: 'xl',
};

const DownloadRoute: React.FC<{ children?: never }> = (): JSX.Element => {
  return (
    <PageView title="Download" description="Download LWJGL 3">
      <Container padding>
        <Title>
          Download LW
          <b>JGL</b> 3
        </Title>

        <Grid
          css={{
            grid: 'auto-flow / 1fr',
            gap: '$paragraph',
            lg: {
              grid: 'auto-flow / repeat(3, 1fr)',
            },
          }}
        >
          <Text>All official are available for download from GitHub:</Text>
          <Box css={{ lg: { gridRow: 2 } }}>
            <AnchorButton
              fill="auto"
              size={buttonSizes}
              href="https://github.com/LWJGL/lwjgl3/releases"
              rel="noopener external"
              target="_blank"
            >
              <Icon name="fa/brands/github" css={{ mr: '$xsm' }} />
              Download from Git
            </AnchorButton>
          </Box>

          <Text>You can customize your LWJGL build or use the latest stable & nightly releases:</Text>
          <Box css={{ lg: { gridRow: 2 } }} onMouseOver={CustomizePreload}>
            <LinkButton fill="auto" size={buttonSizes} to="/customize">
              <Icon name="fa/solid/check-square" css={{ mr: '$xsm' }} />
              Customize LWJGL 3
            </LinkButton>
          </Box>

          <Text>Or you can browse and download individual LWJGL artifacts:</Text>
          <Box css={{ lg: { gridRow: 2 } }} onMouseOver={BrowsePreload}>
            <LinkButton fill="auto" variant="outline" size={buttonSizes} to="/browse">
              <Icon name="fa/solid/folder" css={{ mr: '$xsm' }} />
              Browse LWJGL files
            </LinkButton>
          </Box>
        </Grid>
      </Container>

      <Dark>
        <Container padding>
          <Text as="h2" css={{ mt: -4 }}>
            Build from source?
          </Text>

          <Text margin>Click below if you prefer to build from source:</Text>
          <Grid css={{ gap: '$xsm', sm: { grid: 'auto-flow / repeat(2, max-content)' } }}>
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

        <Text as="h2">Looking for LWJGL 2?</Text>

        <Text margin>
          LWJGL 2 has moved but is still available. Please follow the links below to find what you're looking for:
        </Text>

        <Grid css={{ gap: '$xsm', sm: { grid: 'auto-flow / repeat(2, max-content)' } }}>
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
