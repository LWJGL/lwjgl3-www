import { styled } from '~/theme/stitches.config';
import { PageView } from '~/components/routes/PageView';
import { Link } from 'react-router-dom';
import { LinkButton } from '~/components/LinkButton';
import { HashLinkTarget } from '~/components/HashLinkTarget';
import { LazyImg } from '~/components/LazyImg';
import { HomeHero } from './Hero';
import { GoldSponsors } from '../sponsors/Gold';
import { HowToSupport } from '../sponsors/HowToSupport';
import { Icon } from '~/components/Icon';
import '~/components/icons/fa/brands/apple';
import '~/components/icons/fa/brands/github';
import '~/components/icons/fa/brands/linux';
import '~/components/icons/fa/duotone/book';
import '~/components/icons/fa/duotone/comments';
import '~/components/icons/fa/duotone/gamepad';
import '~/components/icons/fa/duotone/microchip';
import '~/components/icons/fa/duotone/phone-laptop';
import '~/components/icons/fa/duotone/project-diagram';
import '~/components/icons/fa/duotone/brackets-curly';

const FeatureImage = styled('div', {
  fontSize: '4rem',
  padding: '1rem 0 2rem 0',
});

const HomeRoute: React.FC<{ children?: never }> = () => (
  <PageView description="LWJGL is a Java library that enables cross-platform access to popular native APIs such as OpenGL, OpenAL, and OpenCL.">
    <HomeHero />
    <HashLinkTarget id="learn-more" />
    <section className="container py-5">
      <h1 className="text-center">
        What is LW
        <b>JGL</b> 3?
      </h1>
      <div className="row justify-content-center">
        <div className="col-md-10">
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
            ) applications. This access is direct and high-performance, yet also wrapped in a type-safe and
            user-friendly layer, appropriate for the Java ecosystem.
          </p>

          <p>
            LW
            <b>JGL</b> is an enabling technology and provides low-level access. It is not a framework and does not
            provide higher-level utilities than what the native libraries expose. As such, novice programmers are
            encouraged to try one of the <Link to="/frameworks">frameworks</Link> or{' '}
            <Link to="/frameworks">game engines</Link> that make use of LWJGL, before working directly with the library.
          </p>

          <p>
            LW
            <b>JGL</b> is open source software and freely available at no charge.
          </p>

          <p className="text-center pt-1">
            <LinkButton className="btn-lg btn-outline-dark" to="/download">
              DOWNLOAD
            </LinkButton>
            <LinkButton className="btn-lg btn-outline-success" to="/guide">
              GET STARTED
            </LinkButton>
            <LinkButton className="btn-lg btn-outline-info" to="/source">
              SOURCE
            </LinkButton>
          </p>
        </div>
      </div>
    </section>

    <div className="area-dark">
      <section className="container py-5 text-center features">
        <h1>Main Features</h1>

        <div className="row">
          <div className="col-md py-3">
            <FeatureImage>
              <Icon name="fa/duotone/microchip" />
            </FeatureImage>
            <h2>Low-level Bindings</h2>
            <p>
              Direct access to OpenGL, OpenCL, OpenAL, GLFW and other native APIs with uncompromised performance and a
              Java-friendly binding layer.
            </p>
          </div>
          <div className="col-md py-3">
            <FeatureImage>
              <Icon name="fa/brands/github" />
            </FeatureImage>
            <h2>Open Source</h2>
            <p>
              LWJGL is available under a <Link to="/license">BSD license</Link>. Visit our{' '}
              <a href="https://github.com/LWJGL/lwjgl3" rel="noopener external">
                GitHub repository
              </a>{' '}
              to monitor progress, report issues and even contribute with your own code!
            </p>
          </div>
          <div className="col-md py-3">
            <FeatureImage>
              <Icon name="fa/duotone/book" />
            </FeatureImage>
            <h2>Built-in Documentation</h2>
            <p>Get great auto-complete and inline documentation without leaving the comfort of your favorite IDE.</p>
          </div>
        </div>

        <div className="row">
          <div className="col-md py-3">
            <FeatureImage>
              <Icon name="fa/duotone/phone-laptop" />
            </FeatureImage>
            <h2>Cross-platform</h2>
            <p>Write your game or application once, deploy on Windows, Mac, Linux.</p>
          </div>
          <div className="col-md py-3">
            <FeatureImage>
              <Icon name="fa/duotone/comments" />
            </FeatureImage>
            <h2>Community</h2>
            <p>
              Need help? Our{' '}
              <a href="http://forum.lwjgl.org/" rel="noopener external">
                forum
              </a>{' '}
              is a great place to seek a solution. Up for a chat? Join our{' '}
              <a href="http://slack.lwjgl.org/" rel="noopener external">
                Slack team
              </a>
            </p>
          </div>
          <div className="col-md py-3">
            <FeatureImage>
              <Icon name="fa/duotone/gamepad" />
            </FeatureImage>
            <h2>GLFW Bindings</h2>
            <p>
              Create multiple windows, handle user input (keyboard, mouse, gaming peripherals) and manage contexts. Also
              features multi-monitor support, clipboard access, file drag-n-drop, and{' '}
              <a href="http://www.glfw.org/docs/latest/news.html" rel="noopener external">
                much more
              </a>
              .
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-md py-3">
            <FeatureImage>
              <LazyImg width={226} height={60} src="/svg/Vulkan_RGB_June16.svg" alt="Vulkan" />
            </FeatureImage>
            <h2>
              Vulkan
              <sup>
                <small>TM</small>
              </sup>{' '}
              Bindings
            </h2>
            <p>
              A new generation graphics and compute API that provides high-efficiency, cross-platform access to modern
              GPUs used in a wide variety of devices from PCs and consoles to mobile phones and embedded platforms.
            </p>
          </div>
          <div className="col-md py-3">
            <FeatureImage>
              <LazyImg
                width={60}
                height={60}
                src="/img/opencl@x1.png"
                srcSet="/img/opencl@x1.png 1x,/img/opencl@x2.png 2x,/img/opencl@x4.png 4x"
                alt="OpenCL"
              />
            </FeatureImage>
            <h2>
              OpenCL
              <sup>
                <small>TM</small>
              </sup>{' '}
              Bindings
            </h2>
            <p>
              The ultimate standard for cross-platform parallel programming on any hardware. LWJGL supports all OpenCL
              versions (including the latest 2.1 specification) and many useful extensions.
            </p>
          </div>
          <div className="col-md py-3">
            <FeatureImage>
              <LazyImg width={112} height={60} src="/svg/OpenAL_Logo.svg" alt="OpenAL" />
            </FeatureImage>
            <h2>OpenAL Bindings</h2>
            <p>
              Cross-platform multichannel three-dimensional positional audio. A powerful API for music playback and
              audio effects. ALC and many extensions are also supported.
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-md py-3">
            <FeatureImage>
              <LazyImg width={144} height={60} src="/svg/OpenGL_RGB_June16.svg" alt="OpenGL" />
            </FeatureImage>
            <h2>
              OpenGL
              <sup>
                <small>®</small>
              </sup>{' '}
              Bindings
            </h2>
            <p>
              Everything you need to create exciting 2D and 3D graphics. LWJGL supports all OpenGL versions (including
              the latest 4.6 specification), all ARB, Khronos, and OS-specific extensions ever released and dozens of
              popular vendor-specific extensions. If your favorite extension is missing,{' '}
              <a href="https://github.com/LWJGL/lwjgl3/issues" rel="noopener external">
                ask for it
              </a>{' '}
              and it will be added in no time!
            </p>
          </div>
          <div className="col-md py-3">
            <FeatureImage>
              <LazyImg width={180} height={60} src="/svg/OpenGL_ES_RGB_June16.svg" alt="OpenGL|ES" />
            </FeatureImage>
            <h2>
              OpenGL
              <sup>
                <small>®</small>
              </sup>{' '}
              ES Bindings
            </h2>
            <p>
              A royalty-free, cross-platform API for full-function 2D and 3D graphics on embedded systems - including
              consoles, phones, appliances and vehicles. It consists of well-defined subsets of desktop OpenGL, creating
              a flexible and powerful low-level interface between software and graphics acceleration.
            </p>
          </div>
          <div className="col-md py-3">
            <FeatureImage>
              <LazyImg width={180} height={60} src="/svg/EGL_RGB_June16.svg" alt="EGL" />
            </FeatureImage>
            <h2>
              EGL
              <sup>
                <small>TM</small>
              </sup>{' '}
              Bindings
            </h2>
            <p>
              An interface between Khronos rendering APIs such as OpenGL ES or OpenVG and the underlying native platform
              window system. It handles graphics context management, surface/buffer binding and rendering
              synchronization and enables high-performance, accelerated, mixed-mode 2D and 3D rendering using other
              Khronos APIs.
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-md py-3">
            <FeatureImage>
              <LazyImg width={183} height={150} style={{ margin: -15 }} src="/svg/oculus.svg" alt="Oculus VR SDK" />
            </FeatureImage>
            <h2>LibOVR Bindings</h2>
            <p>Create exciting virtual reality experiences with LibOVR, the API of the Oculus VR SDK.</p>
          </div>
          <div className="col-md py-3">
            <FeatureImage>
              <Icon name="fa/brands/apple" />
            </FeatureImage>
            <h2>Objective-C Bindings</h2>
            <p>Use the Objective-C Runtime to interface your JVM application with Cocoa APIs on macOS.</p>
          </div>
          <div className="col-md py-3">
            <FeatureImage>
              <Icon name="fa/duotone/project-diagram" />
            </FeatureImage>
            <h2>Customization & Utilities</h2>
            <p>
              Use{' '}
              <a href="http://www.dyncall.org/" rel="noopener external">
                dyncall
              </a>{' '}
              to call functions from any native library, use{' '}
              <a href="http://jemalloc.net/" rel="noopener external">
                jemalloc
              </a>{' '}
              for efficient and tunable memory management, use the{' '}
              <a href="https://github.com/nothings/stb" rel="noopener external">
                stb
              </a>{' '}
              collection of libraries for texture loading, font rendering and much more.
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col pt-3">
            <div className="mb-3">
              <Icon name="fa/duotone/brackets-curly" style={{ fontSize: '6rem', color: 'yellow' }} />
            </div>
            <h2>Your favorite API here!</h2>
            <p>
              Think LWJGL should have bindings to your favorite API? Let us know or{' '}
              <a href="https://github.com/LWJGL/lwjgl3-wiki/wiki/4.3.-The-Generator" rel="noopener external">
                contribute it
              </a>{' '}
              yourself!
            </p>

            <hr />

            <p className="text-center" style={{ lineHeight: '1.5rem' }}>
              <small>
                OpenGL® and the oval logo are trademarks or registered trademarks of Silicon Graphics, Inc. in the
                United States and/or other countries worldwide.
              </small>
              <br />
              <small>OpenCL and the OpenCL logo are trademarks of Apple Inc. used by permission by Khronos.</small>
              <br />
              <small>OpenGL ES logo is a trademark of Silicon Graphics Inc. used by permission by Khronos.</small>
              <br />
              <small>EGL, the EGL logo, Vulkan and the Vulkan logo are trademarks of the Khronos Group Inc.</small>
              <br />
              <small>
                Oculus, Oculus VR, Oculus Rift, and the Oculus eye logo are trademarks or registered trademarks of
                Oculus VR, LLC.
              </small>
            </p>
          </div>
        </div>
      </section>
    </div>

    <HashLinkTarget id="credits" />

    <HowToSupport />
    <GoldSponsors />

    <section className="container pt-5 pb-3">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <h1>Looking for LWJGL 2?</h1>
          <p>
            LW
            <b>JGL</b> 3 is a fresh start and LWJGL 2 is its predecessor. LWJGL 2 has been used in the creation of
            dozens of games, including titles like{' '}
            <a href="https://minecraft.net/" rel="noopener external">
              Minecraft
            </a>{' '}
            by Mojang and{' '}
            <a href="http://www.puppygames.net/revenge-of-the-titans/" rel="noopener external">
              Revenge of the Titans
            </a>{' '}
            by Puppygames. It is also used in popular game engines, like{' '}
            <a href="http://libgdx.badlogicgames.com/" rel="noopener external">
              libGDX
            </a>{' '}
            and{' '}
            <a href="http://jmonkeyengine.org/" rel="noopener external">
              jMonkeyEngine
            </a>
            .
          </p>

          <p>
            <a
              className="btn d-block d-sm-inline-block mb-2 mb-sm-0 mr-sm-2 btn-outline-dark"
              href="http://legacy.lwjgl.org/"
              target="_blank"
              rel="noopener external"
            >
              LWJGL 2 WEBSITE
            </a>
            <a
              className="btn d-block d-sm-inline-block mb-2 mb-sm-0 mr-sm-2 btn-outline-dark"
              href="http://wiki.lwjgl.org/"
              target="_blank"
              rel="noopener external"
            >
              LWJGL 2 WIKI
            </a>
          </p>

          <p>
            <a href="https://github.com/LWJGL/lwjgl3-wiki/wiki/2.6.6-LWJGL3-migration" rel="noopener external">
              Migration Guide
            </a>
          </p>
        </div>
      </div>
    </section>
  </PageView>
);

export default HomeRoute;
