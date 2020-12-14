import { PageView } from '~/routes/PageView';
import { styled } from '~/theme/stitches.config';
import { Icon } from '~/components/ui/Icon';
import '~/theme/icons/fa/brands/github';
import { Container } from '~/components/layout/Container';
import { Grid } from '~/components/layout/Grid';
import { Stack } from '~/components/layout/FlexStack';
import { Box } from '~/components/layout/Box';
import { Text } from '~/components/ui/Text';
import { Hr } from '~/components/ui/Hr';
import { TextDivider } from '~/components/ui/TextDivider';
import { Title } from '~/components/lwjgl/Title';
import { AnchorButton } from '~/components/ui/LinkButton';
import { ImgLazy } from '~/components/ui/ImgLazy';
import { Anchor } from '~/components/lwjgl/Anchor';

interface BuildBadgeProps {
  title: string;
  href: string;
  src: string;
  width?: number;
  height?: number;
}

const BuildBadge: React.FC<BuildBadgeProps> = ({ title, href, src, width = 90, height = 20 }) => (
  <Stack width="full">
    <TextDivider
      align="start"
      as="span"
      size="base"
      css={{
        flexGrow: 1,
        color: '$neutral600',
      }}
    >
      {title}
    </TextDivider>

    <Anchor href={href} target="_blank" rel="external" css={{ justifySelf: 'end' }}>
      <ImgLazy width={width} height={height} src={src} alt={`${title} build status`} />
    </Anchor>
  </Stack>
);

interface BuildProps extends React.ComponentProps<typeof Box> {
  title: string;
}

const Build: React.FC<BuildProps> = ({ children, title, css }) => (
  <Box css={css}>
    <Text
      as="h3"
      css={{
        mb: '$xxsm',
        lineHeight: 1,
      }}
    >
      {title}
    </Text>
    {children}
  </Box>
);

const IFrameThemeAware = styled('iframe', {
  dark: {
    filter: 'invert(90%)',
  },
});

const SourceRoute: React.FC<{ children?: never }> = () => (
  <PageView title="Source & Build Status" description="Links to LWJGL Github repository and build status matrix">
    <Container padding>
      <Title>
        LW
        <b>JGL</b> Source
      </Title>

      <Grid as="section" css={{ gap: '$paragraph' }}>
        <IFrameThemeAware
          src="https://ghbtns.com/github-btn.html?user=LWJGL&repo=lwjgl3&type=star&count=true&size=large"
          sandbox="allow-scripts allow-popups"
          //@ts-ignore https://www.chromestatus.com/feature/5273474901737472
          importance="low"
          loading="lazy"
          referrerPolicy="no-referrer"
          width="150"
          height="38"
          title="Star LWJGL/lwjgl3 on GitHub"
          allowTransparency
          seamless
        />

        <Text>LWJGL 3 is hosted on Github. Fork, star and contribute to our project!</Text>

        <Grid css={{ gap: '$xsm', md: { grid: 'auto-flow / repeat(4,max-content)' } }}>
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
      </Grid>

      <Hr margin="xl" />

      <Title margin>Build Status</Title>

      <Grid
        as="section"
        css={{
          gap: '$gap',
          lg: {
            grid: 'auto-flow / repeat(3, 1fr)',
          },
        }}
      >
        <Build title="LWJGL" css={{ lg: { gridRow: '1/7' } }}>
          <BuildBadge
            title="Linux/macOS"
            href="https://travis-ci.org/LWJGL-CI/lwjgl3"
            src="https://api.travis-ci.org/LWJGL-CI/lwjgl3.svg"
          />
          <BuildBadge
            width={106}
            title="Windows"
            href="https://ci.appveyor.com/project/LWJGL-CI/lwjgl3"
            src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/lwjgl3?svg=true"
          />
        </Build>

        <Build title="Assimp">
          <BuildBadge
            title="Linux/macOS"
            href="https://travis-ci.org/LWJGL-CI/assimp"
            src="https://api.travis-ci.org/LWJGL-CI/assimp.svg"
          />
          <BuildBadge
            width={106}
            title="Windows"
            href="https://ci.appveyor.com/project/LWJGL-CI/assimp"
            src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/assimp?svg=true"
          />
        </Build>

        <Build title="bgfx">
          <BuildBadge
            title="Linux/macOS"
            href="https://travis-ci.org/LWJGL-CI/bgfx"
            src="https://travis-ci.org/LWJGL-CI/bgfx.svg"
          />
          <BuildBadge
            width={106}
            title="Windows"
            href="https://ci.appveyor.com/project/LWJGL-CI/bgfx"
            src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/bgfx?svg=true"
          />
        </Build>

        <Build title="dyncall">
          <BuildBadge
            title="Linux/macOS"
            href="https://travis-ci.org/LWJGL-CI/dyncall"
            src="https://travis-ci.org/LWJGL-CI/dyncall.svg"
          />
          <BuildBadge
            width={106}
            title="Windows"
            href="https://ci.appveyor.com/project/LWJGL-CI/dyncall"
            src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/dyncall?svg=true"
          />
        </Build>

        <Build title="GLFW">
          <BuildBadge
            title="Linux/macOS"
            href="https://travis-ci.org/LWJGL-CI/glfw"
            src="https://travis-ci.org/LWJGL-CI/glfw.svg"
          />
          <BuildBadge
            width={106}
            title="Windows"
            href="https://ci.appveyor.com/project/LWJGL-CI/glfw"
            src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/glfw?svg=true"
          />
        </Build>

        <Build title="jemalloc">
          <BuildBadge
            title="Linux/macOS"
            href="https://travis-ci.org/LWJGL-CI/jemalloc"
            src="https://travis-ci.org/LWJGL-CI/jemalloc.svg"
          />
          <BuildBadge
            title="Windows"
            width={106}
            href="https://ci.appveyor.com/project/LWJGL-CI/jemalloc"
            src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/jemalloc?svg=true"
          />
        </Build>

        <Build title="MoltenVK">
          <BuildBadge
            title="macOS"
            href="https://travis-ci.org/LWJGL-CI/MoltenVK"
            src="https://travis-ci.org/LWJGL-CI/MoltenVK.svg"
          />
        </Build>

        <Build title="OpenAL Soft">
          <BuildBadge
            title="Linux/macOS"
            href="https://travis-ci.org/LWJGL-CI/openal-soft"
            src="https://travis-ci.org/LWJGL-CI/openal-soft.svg"
          />
          <BuildBadge
            title="Windows"
            width={106}
            href="https://ci.appveyor.com/project/LWJGL-CI/openal-soft"
            src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/openal-soft?svg=true"
          />
        </Build>

        <Build title="Opus">
          <BuildBadge
            title="Linux/macOS"
            href="https://travis-ci.org/LWJGL-CI/opus"
            src="https://travis-ci.org/LWJGL-CI/opus.svg"
          />
          <BuildBadge
            title="Windows"
            width={106}
            href="https://ci.appveyor.com/project/LWJGL-CI/opus"
            src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/opus?svg=true"
          />
        </Build>

        <Build title="Shaderc">
          <BuildBadge
            title="Linux/macOS"
            href="https://travis-ci.org/LWJGL-CI/shaderc"
            src="https://travis-ci.org/LWJGL-CI/shaderc.svg"
          />
          <BuildBadge
            title="Windows"
            width={106}
            href="https://ci.appveyor.com/project/LWJGL-CI/shaderc"
            src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/shaderc?svg=true"
          />
        </Build>

        <Build title="SPIRV-Cross">
          <BuildBadge
            title="Linux/macOS"
            href="https://travis-ci.org/LWJGL-CI/SPIRV-Cross"
            src="https://travis-ci.org/LWJGL-CI/SPIRV-Cross.svg"
          />
          <BuildBadge
            title="Windows"
            width={106}
            href="https://ci.appveyor.com/project/LWJGL-CI/SPIRV-Cross"
            src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/SPIRV-Cross?svg=true"
          />
        </Build>

        <Build title="TinyCC">
          <BuildBadge
            title="Linux/macOS"
            href="https://travis-ci.org/LWJGL-CI/tinycc"
            src="https://travis-ci.org/LWJGL-CI/tinycc.svg"
          />
          <BuildBadge
            title="Windows"
            width={106}
            href="https://ci.appveyor.com/project/LWJGL-CI/tinycc"
            src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/tinycc?svg=true"
          />
        </Build>
      </Grid>
    </Container>
  </PageView>
);

export default SourceRoute;
