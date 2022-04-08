import { styled } from '~/theme/stitches.config';
import { PageView } from '~/routes/PageView';
import { Grid } from '~/components/layout/Grid';
import { SectionContainer } from '~/components/ui/Section';
import { Prose } from '~/components/ui/Prose';
import { ImgDark } from '~/components/ui/ImgDark';
import { ImgLazy } from '~/components/ui/ImgLazy';
import { Hr } from '~/components/ui/Hr';
import { Title } from '~/components/lwjgl/Title';

const ProseSection = styled('section', Prose);

const FrameworksRoute: React.FC = () => (
  <PageView title="Frameworks" description="Engines & frameworks that use LWJGL">
    <SectionContainer padding>
      <Title>
        Frameworks & Game Engines using LW
        <b>JGL</b>
      </Title>

      <Hr margin="lg" />

      <Grid
        css={{
          gap: '$safe',
          '@lg': {
            grid: 'auto-flow / repeat(3, 1fr)',
          },
        }}
      >
        <ProseSection>
          <ImgDark
            loading="lazy"
            src="/img/showcase/libGDX.png"
            darkSrc="/img/showcase/libGDX-dark.png"
            alt="libGDX"
            width="300"
            height="50"
          />
          <p>
            <a href="https://libgdx.com/" rel="noopener external" target="_blank" title="libGDX">
              https://libgdx.com/
            </a>
          </p>
          <p>
            libGDX is a cross-platform Java game development framework based on OpenGL (ES) that works on Windows,
            Linux, Mac OS X, Android, your WebGL enabled browser and iOS.
          </p>
        </ProseSection>
        <ProseSection>
          <ImgLazy src="/img/showcase/jmonkeyengine.png" alt="jMonkeyEngine" width="283" height="50" />
          <p>
            <a href="https://jmonkeyengine.org/" rel="noopener external" target="_blank" title="jMonkeyEngine">
              https://jmonkeyengine.org/
            </a>
          </p>
          <p>
            jMonkeyEngine is a 3D game engine for adventurous Java developers. It’s open-source, cross-platform, and
            cutting-edge.
          </p>
          <p>The engine is used by several commercial game studios and computer-science courses.</p>
        </ProseSection>
      </Grid>
    </SectionContainer>
  </PageView>
);

export default FrameworksRoute;
