import { styled } from '~/theme/stitches.config';
import { PageView } from '~/routes/PageView';
import { Icon } from '~/components/ui/Icon';
import '~/theme/icons/fa/brands/github';
import { Box } from '~/components/ui/Box';
import { Container } from '~/components/ui/Container';
import { Grid } from '~/components/layout/Grid';
import { HStack } from '~/components/layout/FlexStack';
import { Text } from '~/components/ui/Text';
import { TextDivider } from '~/components/ui/TextDivider';
import { Title } from '~/components/lwjgl/Title';
import { AnchorButton } from '~/components/forms/Button';
import { ImgLazy } from '~/components/ui/ImgLazy';
import { Anchor } from '~/components/lwjgl/Anchor';

interface BuildBadgeProps {
  title: string;
  href: string;
  src: string;
  width?: number;
  height?: number;
}

const TextDividerSpan = styled('span', Text, TextDivider);
const GridSection = styled('section', Grid);

const BuildBadge: React.FC<BuildBadgeProps> = ({ title, href, src, width = 88, height = 20 }) => (
  <HStack width="full">
    <TextDividerSpan
      align="start"
      size="lg"
      css={{
        flexGrow: 1,
      }}
    >
      {title}
    </TextDividerSpan>

    <Anchor href={href} target="_blank" rel="noopener external" css={{ justifySelf: 'end' }}>
      <ImgLazy
        css={{ display: 'block' }}
        width={width * 1.35}
        height={height * 1.35}
        src={src}
        alt={`${title} build status`}
      />
    </Anchor>
  </HStack>
);

const SourceRoute: React.FC = () => (
  <PageView title="Source & Build Status" description="Links to LWJGL Github repository and build status matrix">
    <Container padding>
      <Title>
        LW
        <b>JGL</b> Source
      </Title>

      <GridSection css={{ gap: '$paragraph', mb: '$xl' }}>
        <a href="https://github.com/LWJGL/lwjgl3" rel="external">
          <img
            width={90 * 1.77}
            height={20 * 1.77}
            alt="GitHub Repo stars"
            src="https://img.shields.io/github/stars/LWJGL/lwjgl3?style=social"
          />
        </a>

        <Text>LWJGL 3 is hosted on Github. Fork, star and contribute to our project!</Text>

        <Grid css={{ gap: '$xsm', '@md': { grid: 'auto-flow / repeat(4,max-content)' } }}>
          <AnchorButton href="https://github.com/LWJGL/lwjgl3" rel="noopener external">
            <Icon name="fa/brands/github" /> Github Repository
          </AnchorButton>
          <AnchorButton variant="outline" href="https://github.com/LWJGL/lwjgl3/issues" rel="noopener external">
            Issue Tracker
          </AnchorButton>
          <AnchorButton variant="outline" href="https://github.com/LWJGL/lwjgl3/releases" rel="noopener external">
            Release notes
          </AnchorButton>
          <AnchorButton variant="outline" href="https://github.com/LWJGL/lwjgl3/commits/master" rel="noopener external">
            Changelog
          </AnchorButton>
        </Grid>
      </GridSection>

      <Title>Build Status</Title>

      <GridSection
        css={{
          gap: '$gap',
          '@lg': { grid: 'auto-flow / repeat(3, 1fr)' },
        }}
      >
        <Box css={{ '@lg': { gridRow: '1/9' } }}>
          <BuildBadge
            title="LWJGL"
            href="https://github.com/LWJGL-CI/lwjgl3/actions/workflows/CI.yml"
            src="https://img.shields.io/github/actions/workflow/status/LWJGL-CI/lwjgl3/CI.yml?branch=master"
          />
        </Box>

        <Box>
          <BuildBadge
            title="Assimp"
            href="https://github.com/LWJGL-CI/assimp/actions/workflows/lwjgl.yml"
            src="https://img.shields.io/github/actions/workflow/status/LWJGL-CI/assimp/lwjgl.yml?branch=master"
          />
        </Box>

        <Box>
          <BuildBadge
            title="bgfx"
            href="https://github.com/LWJGL-CI/bgfx/actions/workflows/lwjgl.yml"
            src="https://img.shields.io/github/actions/workflow/status/LWJGL-CI/bgfx/lwjgl.yml?branch=master"
          />
        </Box>

        <Box>
          <BuildBadge
            title="libffi"
            href="https://github.com/LWJGL-CI/libffi/actions/workflows/lwjgl.yml"
            src="https://img.shields.io/github/actions/workflow/status/LWJGL-CI/libffi/lwjgl.yml?branch=master"
          />
        </Box>

        <Box>
          <BuildBadge
              title="FreeType"
              href="https://github.com/LWJGL-CI/freetype/actions/workflows/lwjgl.yml"
              src="https://img.shields.io/github/actions/workflow/status/LWJGL-CI/freetype/lwjgl.yml?branch=master"
          />
        </Box>

        <Box>
          <BuildBadge
              title="HarfBuzz"
              href="https://github.com/LWJGL-CI/harfbuzz/actions/workflows/lwjgl.yml"
              src="https://img.shields.io/github/actions/workflow/status/LWJGL-CI/harfbuzz/lwjgl.yml?branch=main"
          />
        </Box>

        <Box>
          <BuildBadge
            title="GLFW"
            href="https://github.com/LWJGL-CI/glfw/actions/workflows/lwjgl.yml"
            src="https://img.shields.io/github/actions/workflow/status/LWJGL-CI/glfw/lwjgl.yml?branch=master"
          />
        </Box>

        <Box>
          <BuildBadge
              title="hwloc"
              href="https://github.com/LWJGL-CI/hwloc/actions/workflows/lwjgl.yml"
              src="https://img.shields.io/github/actions/workflow/status/LWJGL-CI/hwloc/lwjgl.yml?branch=master"
          />
        </Box>

        <Box>
          <BuildBadge
            title="jemalloc"
            href="https://github.com/LWJGL-CI/jemalloc/actions/workflows/lwjgl.yml"
            src="https://img.shields.io/github/actions/workflow/status/LWJGL-CI/jemalloc/lwjgl.yml?branch=master"
          />
        </Box>

        <Box>
          <BuildBadge
              title="KTX"
              href="https://github.com/LWJGL-CI/KTX-Software/actions/workflows/lwjgl.yml"
              src="https://img.shields.io/github/actions/workflow/status/LWJGL-CI/KTX-Software/lwjgl.yml?branch=main"
          />
        </Box>

        <Box>
          <BuildBadge
            title="MoltenVK"
            href="https://github.com/LWJGL-CI/MoltenVK/actions/workflows/lwjgl.yml"
            src="https://img.shields.io/github/actions/workflow/status/LWJGL-CI/MoltenVK/lwjgl.yml?branch=master"
          />
        </Box>

        <Box>
          <BuildBadge
            title="OpenAL Soft"
            href="https://github.com/LWJGL-CI/openal-soft/actions/workflows/lwjgl.yml"
            src="https://img.shields.io/github/actions/workflow/status/LWJGL-CI/openal-soft/lwjgl.yml?branch=master"
          />
        </Box>

        <Box>
          <BuildBadge
              title="OpenXR Loader"
              href="https://github.com/LWJGL-CI/OpenXR-SDK/actions/workflows/lwjgl.yml"
              src="https://img.shields.io/github/actions/workflow/status/LWJGL-CI/OpenXR-SDK/lwjgl.yml?branch=main"
          />
        </Box>

        <Box>
          <BuildBadge
            title="Opus"
            href="https://github.com/LWJGL-CI/opus/actions/workflows/lwjgl.yml"
            src="https://img.shields.io/github/actions/workflow/status/LWJGL-CI/opus/lwjgl.yml?branch=master"
          />
        </Box>

        <Box>
          <BuildBadge
            title="Shaderc"
            href="https://github.com/LWJGL-CI/shaderc/actions/workflows/lwjgl.yml"
            src="https://img.shields.io/github/actions/workflow/status/LWJGL-CI/shaderc/lwjgl.yml?branch=main"
          />
        </Box>

        <Box>
          <BuildBadge
            title="SPIRV-Cross"
            href="https://github.com/LWJGL-CI/SPIRV-Cross/actions/workflows/lwjgl.yml"
            src="https://img.shields.io/github/actions/workflow/status/LWJGL-CI/SPIRV-Cross/lwjgl.yml?branch=master"
          />
        </Box>
      </GridSection>
    </Container>
  </PageView>
);

export default SourceRoute;
