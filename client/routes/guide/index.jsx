import * as React from 'react';
import PageView from '~/containers/PageView';
import type { ContextRouter } from 'react-router-dom';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import codeSample from './sample';
import loadJS from 'fg-loadjs';
import { loadCSS } from 'fg-loadcss';
import HashLinkTarget from '~/components/HashLinkTarget';

type State = {
  sample: string,
};

class GuideRoute extends React.Component<ContextRouter, State> {
  static init = true;
  static sample = codeSample;
  mounted = false;

  state = {
    sample: GuideRoute.sample,
  };

  componentDidMount() {
    this.mounted = true;

    if (GuideRoute.init) {
      GuideRoute.init = false;
      loadCSS('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/dracula.min.css');
      loadJS('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js', () => {
        if (window.hljs != null) {
          GuideRoute.sample = (window.hljs: any).highlight('java', codeSample).value;
        }
        if (!this.mounted) {
          return;
        }
        this.setState({ sample: GuideRoute.sample });
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    return (
      <PageView {...this.props}>
        <Helmet>
          <title>Get started with LWJGL 3</title>
          <meta name="description" content="This guide will help you get started with LWJGL 3" />
        </Helmet>
        <main>
          <section className="container">
            <h1>
              LW<b>JGL</b> 3 Guide
            </h1>

            <p>This guide will help you get started with LWJGL.</p>

            <h3>Getting Started</h3>

            <p>
              Please use the build configurator in our <Link to="/download">download page</Link> to configure and
              download an LWJGL release. You will also need a{' '}
              <a href="http://www.oracle.com/technetwork/java/javase/downloads/index.html">
                Java SE Development Kit
              </a>{' '}
              (JDK), LWJGL requires version 8 or higher. Then proceed by setting up a project in your favorite IDE and
              configuring it as described in the{' '}
              <a href="https://github.com/LWJGL/lwjgl3-wiki/wiki/1.2.-Install">Installation Guide</a>
              .
            </p>

            <p>
              You should now be ready to develop and launch an LWJGL application. Following is a simple example that
              utilizes GLFW to create a window and clear the background color to red, using OpenGL.
            </p>
          </section>

          <section className="py-3" style={{ backgroundColor: '#2b2b2b' }}>
            <pre className="container" style={{ color: 'white' }}>
              <code dangerouslySetInnerHTML={{ __html: this.state.sample }} />
            </pre>
          </section>

          <section className="container pt-4">
            <p>
              LWJGL comes with rich documentation, you can browse the javadoc online{' '}
              <a href="http://javadoc.lwjgl.org/">starting here</a>
              . For more information, FAQ, guides and tutorials visit the{' '}
              <a href="https://github.com/LWJGL/lwjgl3-wiki/wiki">wiki</a>
              . The <a href="https://github.com/LWJGL/lwjgl3-wiki/wiki/1.3.-Memory-FAQ">Memory FAQ</a>,{' '}
              <a href="https://github.com/LWJGL/lwjgl3-wiki/wiki/1.4.-Bindings-FAQ">Bindings FAQ</a> and{' '}
              <a href="https://github.com/LWJGL/lwjgl3-wiki/wiki/2.5.-Troubleshooting">Troubleshooting</a> pages are
              especially useful. For more code examples, see the{' '}
              <a href="https://github.com/LWJGL/lwjgl3/tree/master/modules/core/src/test">LWJGL tests suite</a> and the{' '}
              <a href="https://github.com/LWJGL/lwjgl3-demos">lwjgl3-demos</a> repository (nightly build required). For
              porting existing LWJGL 2 code to LWJGL 3, see the{' '}
              <a href="https://github.com/LWJGL/lwjgl3-wiki/wiki/2.6.6-LWJGL3-migration">migration guide</a>
              .
            </p>

            <HashLinkTarget id="build-instructions" />
            <h3>Building from source</h3>

            <p>
              Clone the <a href="https://github.com/LWJGL/lwjgl3.git">Git repository</a> locally, install a JDK and{' '}
              <a href="http://ant.apache.org/">Apache Ant</a>, then you should be ready to build. Use the following
              targets:
            </p>
            <ul>
              <li>
                <em>ant</em> – Builds everything and runs the tests
              </li>

              <li>
                <em>ant compile-templates</em> – Compiles the binding generator templates
              </li>
              <li>
                <em>ant compile</em> – Compiles the Java code (including generated)
              </li>
              <li>
                <em>ant compile-native</em> – Compiles and links the native library
              </li>
              <li>
                <em>ant tests</em> – Runs the test suite
              </li>
              <li>
                <em>ant demo -Dclass=&lt;demo class&gt;</em> – Runs one of the LWJGL demos in the test module
              </li>

              <li>
                <em>ant clean</em> – Deletes all files and folders generated by the build script.
              </li>
              <li>
                <em>and -f update_dependencies.xml</em> – Forces all dependencies to be downloaded again.
              </li>
            </ul>

            <p>
              Note that the target native architecture is determined by <em>os.arch</em> of the JVM that runs Ant. For
              cross-compiling, use the LWJGL_BUILD_ARCH environment variable to override it (set it to <em>x86</em> or{' '}
              <em>x64</em>
              ).
            </p>

            <p>
              Binary dependencies are downloaded from the stable download branch. Use the LWJGL_BUILD_TYPE environment
              variable to override this:
            </p>
            <ul>
              <li>
                <em>nightly</em> – the latest successful build, possibly broken. Dependency repositories can be found{' '}
                <a href="https://github.com/LWJGL-CI">here</a>
              </li>
              <li>
                <em>stable</em> – the latest build that has been verified to work with LWJGL, the default
              </li>
              <li>
                <em>release/latest</em> – the latest stable build that has been promoted to an official LWJGL $
              </li>
              <li>
                <em>
                  release/{'{'}build.version{'}'}
                </em>{' '}
                – a specific previously released build
              </li>
            </ul>

            <p>
              If you are using custom binaries, or simply need to work offline, set the LWJGL_BUILD_OFFLINE environment
              variable to one of <em>true/on/yes</em>
              .
            </p>

            <p>
              The LWJGL build process creates thousands of tiny files. If you wish to redirect output to another
              directory or storage device, you may set the LWJGL_BUILD_OUTPUT environment variable.
            </p>
          </section>

          <div className="area-dark py-4">
            <section className="container">
              <h1>
                Is LW<b>JGL</b> for me?
              </h1>

              <p>LWJGL is simple but powerful. It is not for everyone.</p>
              <p>If you're into OpenGL, you'll feel right at home.</p>
              <p>If you're just getting started, please familiarize yourself with each API first.</p>
            </section>
          </div>

          <section className="container pt-4">
            <h2>GLFW</h2>
            <p>
              <a href="http://www.glfw.org/">GLFW</a> is an Open Source, multi-platform library for creating windows
              with OpenGL contexts and receiving input and events. It is easy to integrate into existing applications
              and does not lay claim to the main loop.
            </p>
            <p>
              GLFW is the preferred windowing system for LWJGL 3 applications. If you're familiar with LWJGL 2, GLFW is
              a replacement for the Display class and everything in the input package.
            </p>
            <p>
              Learning GLFW is easy. It has a simple, yet powerful, API and comprehensive{' '}
              <a href="http://www.glfw.org/docs/latest/">documentation</a>
              .
            </p>

            <h2>OpenGL</h2>
            <p>
              <a href="https://www.opengl.org/about/">OpenGL</a> is the premier environment for developing portable,
              interactive 2D and 3D graphics applications.
            </p>
            <p>
              OpenGL is a massive API with long history and hundreds of extensions. Learning it from scratch is no easy
              undertaking, but you can start from its <a href="https://www.opengl.org/documentation/">documentation</a>
              . The
              <a href="https://www.opengl.org/registry/">OpenGL registry</a> is also quite useful.
            </p>

            <h2>OpenCL</h2>
            <p>
              <a href="https://www.khronos.org/opencl/">OpenCL</a> is the first open, royalty-free standard for
              cross-platform, parallel programming of modern processors found in personal computers, servers and
              handheld/embedded devices. OpenCL (Open Computing Language) greatly improves speed and responsiveness for
              a wide spectrum of applications in numerous market categories from gaming and entertainment to scientific
              and medical software.
            </p>
            <p>
              Specifications for OpenCL and its extensions can be found at the{' '}
              <a href="https://www.khronos.org/registry/cl/">Khronos OpenCL registry</a>
              .
            </p>

            <h2>OpenAL</h2>
            <p>
              <a href="http://www.openal.org/">OpenAL</a> (for "Open Audio Library") is a software interface to audio
              hardware. The interface consists of a number of functions that allow a programmer to specify the objects
              and operations in producing high-quality audio output, specifically multichannel output of 3D arrangements
              of sound sources around a listener.
            </p>
            <p>
              LWJGL is bundled with <a href="http://kcat.strangesoft.net/openal.html">OpenAL Soft</a>
              , an LGPL-licensed, cross-platform, software implementation of the OpenAL 3D audio API.
            </p>
          </section>
        </main>
      </PageView>
    );
  }
}

export default GuideRoute;
