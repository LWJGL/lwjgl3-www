import { PageView } from '~/routes/PageView';
import { Grid } from '~/components/layout/Grid';
import { Container } from '~/components/layout/Container';
import { Prose } from '~/components/ui/Prose';
import { ImgDark } from '~/components/ui/ImgDark';
import { ImgLazy } from '~/components/ui/ImgLazy';
import { Hr } from '~/components/ui/Hr';
import { Title } from '~/components/lwjgl/Title';

const FrameworksRoute: React.FC<{ children?: never }> = () => (
  <PageView title="Frameworks" description="Engines & frameworks that use LWJGL">
    <Container as="section" padding>
      <Title>
        Frameworks & Game Engines using LW
        <b>JGL</b>
      </Title>

      <Hr margin="lg" />

      <Grid
        css={{
          gap: '$safe',
          when: {
            lg: {
              grid: 'auto-flow / repeat(3, 1fr)',
            },
          },
        }}
      >
        <Prose as="section">
          <ImgDark
            loading="lazy"
            src="/img/showcase/libGDX.png"
            darkSrc="/img/showcase/libGDX-dark.png"
            alt="libGDX"
            width="300"
            height="50"
          />
          <p>
            <a href="https://libgdx.badlogicgames.com/" rel="noopener external" target="_blank" title="libGDX">
              https://libgdx.badlogicgames.com/
            </a>
          </p>
          <p>
            libGDX is a cross-platform Java game development framework based on OpenGL (ES) that works on Windows,
            Linux, Mac OS X, Android, your WebGL enabled browser and iOS.
          </p>
        </Prose>
        <Prose as="section">
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
        </Prose>
      </Grid>
    </Container>
  </PageView>
);

export default FrameworksRoute;
