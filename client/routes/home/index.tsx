import { styled } from '~/theme/stitches.config';
import { Link } from '~/components/router/client';
import { Frameworks, License, Download, Guide, Source } from '~/routes';
import { PageView } from '~/routes/PageView';
import { HomeHero } from './Hero';
import { GoldSponsors } from '~/routes/contributors/Gold';
import { HowToSupport } from '~/routes/contributors/HowToSupport';
import { Grid } from '~/components/layout/Grid';
import { Prose } from '~/components/ui/Prose';
import { LinkButton, AnchorButton } from '~/components/forms/Button';
import { ImgLazy } from '~/components/ui/ImgLazy';
import { Text } from '~/components/ui/Text';
import { Hr } from '~/components/ui/Hr';
import { Anchor } from '~/components/lwjgl/Anchor';
import { TitleSection } from '~/components/lwjgl/TitleSection';
import { Dark } from '~/components/lwjgl/Dark';
import { SectionContentVisibility } from '~/components/ui/Section';
import { Icon } from '~/components/ui/Icon';

import '~/theme/icons/fa/brands/apple';
import '~/theme/icons/fa/brands/github';
import '~/theme/icons/fa/brands/linux';
import '~/theme/icons/fa/duotone/book';
import '~/theme/icons/fa/duotone/comments';
import '~/theme/icons/fa/duotone/gamepad';
import '~/theme/icons/fa/duotone/microchip';
import '~/theme/icons/fa/duotone/phone-laptop';
import '~/theme/icons/fa/duotone/project-diagram';
import '~/theme/icons/fa/duotone/brackets-curly';

const FeatureImage = styled('div', {
  display: 'flex',
  alignItems: 'center',
  mb: '$paragraph',
  height: 30,
  fontSize: '2rem',
  '& img': {
    width: 'auto',
    height: 30,
  },
  '@sm': {
    height: 45,
    fontSize: '3rem',
    justifyContent: 'center',
    '& img': {
      height: 45,
    },
  },
  '@lg': {
    fontSize: '4rem',
  },
});

FeatureImage.defaultProps = {
  'aria-hidden': true,
};

const Feature = styled('div', {
  // fontSize: 'calc(1rem * var(--scale-sm, 1))',
  h3: {
    color: '$neutral11',
    // fontSize: '1.5rem',
    // fontSize: 'calc(1.25rem * var(--scale-sm, 1))',
    fontSize: '$2xl',
    // fontWeight: '$thin',
    mb: '$xxsm',
  },
  '@sm': {
    textAlign: 'center',
  },
});

const HomeRoute: React.FC = () => (
  <PageView description="LWJGL is a Java library that enables cross-platform access to popular native APIs such as OpenGL, OpenAL, and OpenCL.">
    <HomeHero />

    <SectionContentVisibility padding id="learn-more">
      <TitleSection>
        What is LW
        <b>JGL</b>?
      </TitleSection>
      <Prose align="center">
        <p>
          LW
          <b>JGL</b> is a Java library that enables cross-platform access to popular native APIs useful in the
          development of graphics (
          <a href="https://www.opengl.org/" rel="noopener external">
            OpenGL
          </a>
          ,{' '}
          <a href="https://www.khronos.org/vulkan/" rel="noopener external">
            Vulkan
          </a>
          ), audio (
          <a href="http://www.openal.org/" rel="noopener external">
            OpenAL
          </a>
          ) and parallel computing (
          <a href="https://www.khronos.org/opencl/" rel="noopener external">
            OpenCL
          </a>
          ) applications. This access is direct and high-performance, yet also wrapped in a type-safe and user-friendly
          layer, appropriate for the Java ecosystem.
        </p>

        <p>
          LW
          <b>JGL</b> is an enabling technology and provides low-level access. It is not a framework and does not provide
          higher-level utilities than what the native libraries expose. As such, novice programmers are encouraged to
          try one of the{' '}
          <Link to="/frameworks" onPointerDown={Frameworks.preload}>
            frameworks
          </Link>{' '}
          or{' '}
          <Link to="/frameworks" onPointerDown={Frameworks.preload}>
            game engines
          </Link>{' '}
          that make use of LWJGL, before working directly with the library.
        </p>

        <p>
          LW
          <b>JGL</b> is open source software and freely available at no charge.
        </p>
      </Prose>

      <Grid
        css={{
          mt: '$safe',
          justifyContent: 'center',
          gap: '$xsm',
          grid: 'auto-flow / 1fr',
          '@sm': {
            grid: 'auto-flow / repeat(3, max-content)',
          },
        }}
      >
        <LinkButton size="xl" tone="accent" to="/download" onPointerDown={Download.preload}>
          DOWNLOAD
        </LinkButton>
        <LinkButton size="xl" tone="accent" variant="outline" to="/guide" onPointerDown={Guide.preload}>
          GET STARTED
        </LinkButton>
        <LinkButton size="xl" tone="accent" variant="outline" to="/source" onPointerDown={Source.preload}>
          SOURCE
        </LinkButton>
      </Grid>
    </SectionContentVisibility>

    <Dark>
      <SectionContentVisibility padding>
        <TitleSection css={{ mb: '$safe' }}>Main Features</TitleSection>

        <Grid
          css={{
            gap: '$lg',
            '@md': {
              grid: 'auto-flow / repeat(2, 1fr)',
            },
            '@xl': {
              gap: '$xl',
              grid: 'auto-flow / repeat(3, 1fr)',
            },
          }}
        >
          <Feature>
            <FeatureImage>
              <Icon display="block" name="fa/duotone/microchip" />
            </FeatureImage>
            <h3>Low-level Bindings</h3>
            <p>
              Direct access to OpenGL, OpenCL, OpenAL, GLFW and other native APIs with uncompromised performance and a
              Java-friendly binding layer.
            </p>
          </Feature>

          <Feature>
            <FeatureImage>
              <Icon display="block" name="fa/brands/github" />
            </FeatureImage>
            <h3>Open Source</h3>
            <p>
              LWJGL is available under a{' '}
              <Link to="/license" onPointerDown={License.preload}>
                BSD license
              </Link>
              . Visit our{' '}
              <Anchor href="https://github.com/LWJGL/lwjgl3" rel="noopener external">
                GitHub repository
              </Anchor>{' '}
              to monitor progress, report issues and even contribute with your own code!
            </p>
          </Feature>

          <Feature>
            <FeatureImage>
              <Icon display="block" name="fa/duotone/book" />
            </FeatureImage>
            <h3>Built-in Documentation</h3>
            <p>Get great auto-complete and inline documentation without leaving the comfort of your favorite IDE.</p>
          </Feature>

          <Feature>
            <FeatureImage>
              <Icon display="block" name="fa/duotone/phone-laptop" />
            </FeatureImage>
            <h3>Cross-platform</h3>
            <p>Write your game or application once, deploy on Windows, Mac, Linux.</p>
          </Feature>

          <Feature>
            <FeatureImage>
              <Icon display="block" name="fa/duotone/comments" />
            </FeatureImage>
            <h3>Community</h3>
            <p>
              Need help? Our{' '}
              <Anchor href="http://forum.lwjgl.org/" rel="noopener external">
                forum
              </Anchor>{' '}
              is a great place to seek a solution. Up for a chat? Join our{' '}
              <a href="https://slack.lwjgl.org/" rel="noopener external">
                Slack team
              </a>
            </p>
          </Feature>

          <Feature>
            <FeatureImage>
              <Icon display="block" name="fa/duotone/gamepad" />
            </FeatureImage>
            <h3>GLFW Bindings</h3>
            <p>
              Create multiple windows, handle user input (keyboard, mouse, gaming peripherals) and manage contexts. Also
              features multi-monitor support, clipboard access, file drag-n-drop, and{' '}
              <Anchor href="https://www.glfw.org/docs/latest/news.html" rel="noopener external">
                much more
              </Anchor>
              .
            </p>
          </Feature>

          <Feature>
            <FeatureImage>
              <ImgLazy width={226} height={60} src="/svg/Vulkan_RGB_June16.svg" alt="Vulkan" />
            </FeatureImage>
            <h3>
              Vulkan
              <sup>
                <small>TM</small>
              </sup>{' '}
              Bindings
            </h3>
            <p>
              A new generation graphics and compute API that provides high-efficiency, cross-platform access to modern
              GPUs used in a wide variety of devices from PCs and consoles to mobile phones and embedded platforms.
            </p>
          </Feature>

          <Feature>
            <FeatureImage>
              <ImgLazy
                width={60}
                height={60}
                src="/img/opencl@x1.png"
                srcSet="/img/opencl@x1.png 1x,/img/opencl@x2.png 2x,/img/opencl@x4.png 4x"
                alt="OpenCL"
              />
            </FeatureImage>
            <h3>
              OpenCL
              <sup>
                <small>TM</small>
              </sup>{' '}
              Bindings
            </h3>
            <p>
              The ultimate standard for cross-platform parallel programming on any hardware. LWJGL supports all OpenCL
              versions (including the latest 2.1 specification) and many useful extensions.
            </p>
          </Feature>

          <Feature>
            <FeatureImage>
              <ImgLazy width={112} height={60} src="/svg/OpenAL_Logo.svg" alt="OpenAL" />
            </FeatureImage>
            <h3>OpenAL Bindings</h3>
            <p>
              Cross-platform multichannel three-dimensional positional audio. A powerful API for music playback and
              audio effects. ALC and many extensions are also supported.
            </p>
          </Feature>

          <Feature>
            <FeatureImage>
              <ImgLazy width={144} height={60} src="/svg/OpenGL_RGB_June16.svg" alt="OpenGL" />
            </FeatureImage>
            <h3>
              OpenGL
              <sup>
                <small>®</small>
              </sup>{' '}
              Bindings
            </h3>
            <p>
              Everything you need to create exciting 2D and 3D graphics. LWJGL supports all OpenGL versions (including
              the latest 4.6 specification), all ARB, Khronos, and OS-specific extensions ever released and dozens of
              popular vendor-specific extensions. If your favorite extension is missing,{' '}
              <Anchor href="https://github.com/LWJGL/lwjgl3/issues" rel="noopener external">
                ask for it
              </Anchor>{' '}
              and it will be added in no time!
            </p>
          </Feature>

          <Feature>
            <FeatureImage>
              <ImgLazy width={180} height={60} src="/svg/OpenGL_ES_RGB_June16.svg" alt="OpenGL|ES" />
            </FeatureImage>
            <h3>
              OpenGL
              <sup>
                <small>®</small>
              </sup>{' '}
              ES Bindings
            </h3>
            <p>
              A royalty-free, cross-platform API for full-function 2D and 3D graphics on embedded systems - including
              consoles, phones, appliances and vehicles. It consists of well-defined subsets of desktop OpenGL, creating
              a flexible and powerful low-level interface between software and graphics acceleration.
            </p>
          </Feature>

          <Feature>
            <FeatureImage>
              <ImgLazy width={180} height={60} src="/svg/EGL_RGB_June16.svg" alt="EGL" />
            </FeatureImage>
            <h3>
              EGL
              <sup>
                <small>TM</small>
              </sup>{' '}
              Bindings
            </h3>
            <p>
              An interface between Khronos rendering APIs such as OpenGL ES or OpenVG and the underlying native platform
              window system. It handles graphics context management, surface/buffer binding and rendering
              synchronization and enables high-performance, accelerated, mixed-mode 2D and 3D rendering using other
              Khronos APIs.
            </p>
          </Feature>

          <Feature>
            <FeatureImage>
              <ImgLazy width={1576.2 * 0.15} height={340.9 * 0.15} src="/svg/oculus-logo-white.svg" alt="" />
            </FeatureImage>
            <h3>LibOVR Bindings</h3>
            <p>Create exciting virtual reality experiences with LibOVR, the API of the Oculus VR SDK.</p>
          </Feature>

          <Feature>
            <FeatureImage>
              <Icon display="block" name="fa/brands/apple" />
            </FeatureImage>
            <h3>Objective-C Bindings</h3>
            <p>Use the Objective-C Runtime to interface your JVM application with Cocoa APIs on macOS.</p>
          </Feature>

          <Feature>
            <FeatureImage>
              <Icon name="fa/duotone/project-diagram" />
            </FeatureImage>
            <h3>Customization & Utilities</h3>
            <p>
              Use{' '}
              <Anchor href="https://sourceware.org/libffi/" rel="noopener external">
                libffi
              </Anchor>{' '}
              to call functions from any native library, use{' '}
              <Anchor href="http://jemalloc.net/" rel="noopener external">
                jemalloc
              </Anchor>{' '}
              for efficient and tunable memory management, use the{' '}
              <Anchor href="https://github.com/nothings/stb" rel="noopener external">
                stb
              </Anchor>{' '}
              collection of libraries for texture loading, font rendering and much more.
            </p>
          </Feature>

          <Feature css={{ '@xl': { gridColumn: '1/-1' } }}>
            <FeatureImage>
              <Icon display="block" name="fa/duotone/brackets-curly" css={{ color: '$caution700' }} />
            </FeatureImage>
            <h3>Your favorite API here!</h3>
            <p>
              Think LWJGL should have bindings to your favorite API? Let us know or{' '}
              <Anchor href="https://github.com/LWJGL/lwjgl3-wiki/wiki/4.3.-The-Generator" rel="noopener external">
                contribute it
              </Anchor>{' '}
              yourself!
            </p>
          </Feature>
        </Grid>

        <Hr margin="lg" />

        <Text css={{ '@sm': { textAlign: 'center' } }}>
          <small>
            OpenGL® and the oval logo are trademarks or registered trademarks of Silicon Graphics, Inc. in the United
            States and/or other countries worldwide.
          </small>
          <br />
          <small>OpenCL and the OpenCL logo are trademarks of Apple Inc. used by permission by Khronos.</small>
          <br />
          <small>OpenGL ES logo is a trademark of Silicon Graphics Inc. used by permission by Khronos.</small>
          <br />
          <small>EGL, the EGL logo, Vulkan and the Vulkan logo are trademarks of the Khronos Group Inc.</small>
          <br />
          <small>
            Oculus, Oculus VR, Oculus Rift, and the Oculus eye logo are trademarks or registered trademarks of Oculus
            VR, LLC.
          </small>
        </Text>
      </SectionContentVisibility>
    </Dark>

    <HowToSupport id="credits" />
    <GoldSponsors />

    <SectionContentVisibility padding>
      <TitleSection>Looking for LWJGL 2?</TitleSection>
      <Prose width="safe" align="center">
        <p>
          LW
          <b>JGL</b> 3 is a fresh start and LWJGL 2 is its predecessor. LWJGL 2 has been used in the creation of dozens
          of games, including titles like{' '}
          <a href="https://minecraft.net/" rel="noopener external">
            Minecraft
          </a>{' '}
          by Mojang and{' '}
          <a href="http://www.puppygames.net/revenge-of-the-titans/" rel="noopener external">
            Revenge of the Titans
          </a>{' '}
          by Puppygames. It was also used in popular game engines, like{' '}
          <a href="https://libgdx.com/" rel="noopener external">
            libGDX
          </a>{' '}
          and{' '}
          <a href="http://jmonkeyengine.org/" rel="noopener external">
            jMonkeyEngine
          </a>
          .
        </p>
      </Prose>
      <Grid
        css={{
          mt: '$gutter',
          justifyContent: 'center',
          gap: '$xsm',
          grid: 'auto-flow / 1fr',
          '@sm': {
            grid: 'auto-flow / repeat(2, max-content)',
          },
        }}
      >
        <AnchorButton
          size="xl"
          variant="outline"
          href="http://legacy.lwjgl.org/"
          rel="noopener external"
          target="_blank"
        >
          LWJGL 2 WEBSITE{' '}
        </AnchorButton>
        <AnchorButton
          size="xl"
          variant="outline"
          href="https://github.com/LWJGL/lwjgl3-wiki/wiki/2.6.6-LWJGL3-migration"
          rel="noopener external"
        >
          MIGRATION GUIDE
        </AnchorButton>
      </Grid>
    </SectionContentVisibility>
  </PageView>
);

export default HomeRoute;
