import React from 'react'
import Helmet from 'react-helmet'
import {StyleSheet, css} from 'aphrodite'
import stylesDefinition from './styles'
import { Link } from 'react-router/es6'

const styles = StyleSheet.create(stylesDefinition);

export default React.createClass({
  render() {
    return (
      <div>
        <Helmet
          meta={[
            {
              "name": "description",
              "content": "LWJGL is a Java library that enables cross-platform access to popular native APIs such as OpenGL, OpenAL, and OpenCL."
            }
          ]}
        />

        <section className={css(styles.videoContainer)}>
          <video className={css(styles.video)} poster="https://d2g0ezo1t7nqa0.cloudfront.net/video/manfps.jpg" preload="auto" muted={true} loop={true} autoPlay={true}>
            <source type="video/webm" src="https://d2g0ezo1t7nqa0.cloudfront.net/video/manfps.webm" />
            <source type="video/mp4" src="https://d2g0ezo1t7nqa0.cloudfront.net/video/manfps.mp4" />
          </video>
          <div className={css(styles.videoOverlay)}></div>
          <img className={css(styles.logo)} src="//d2g0ezo1t7nqa0.cloudfront.net/logo/lwjgl3-light.png" alt="LWJGL" />
          <div className={css(styles.intro)}>
            <h1 className={css(styles.introTitle)}>Lightweight Java Game Library 3</h1>
            <p className={css(styles.introText)}>LEARN MORE<br /><i className="fa fa-angle-down" /></p>
          </div>
        </section>

        <section className="container p-y-2">
          <h2 className="text-xs-center">What is LW<b>JGL</b> 3?</h2>
          <div className="line-sep"></div>
          <article>
            <p>LW<b>JGL</b> is a Java library that enables cross-platform access to popular native APIs useful in the
              development of graphics (<a href="https://www.opengl.org/">OpenGL</a>), audio
              (<a href="http://www.openal.org/">OpenAL</a>) and parallel computing
              (<a href="https://www.khronos.org/opencl/">OpenCL</a>) applications. This access is direct and high-performance,
              yet also wrapped in a type-safe and user-friendly layer, appropriate for the Java ecosystem.</p>

            <p>LW<b>JGL</b> is an enabling technology and provides low-level access. It is not a framework and does not provide
              higher-level utilities than what the native libraries expose. As such, novice programmers are encouraged to try
              one of the frameworks or game engines that make use of LWJGL, before working directly with the library.</p>

            <p>LW<b>JGL</b> is open source software and freely available at no charge.</p>
          </article>

          <div className="row text-xs-center">
            <div className="col-md-6 col-xs-12 p-y-1 text-md-right">
              <Link className="btn btn-lg btn-primary" to="/download"><i className="fa fa-cloud-download" /> DOWNLOAD</Link>
            </div>
            <div className="col-md-6 col-xs-12 p-y-1 text-md-left">
              <Link className="btn btn-lg btn-outline-primary" to="/source"><i className="fa fa-code" /> SOURCE</Link>
            </div>
          </div>

          <div className="text-xs-center">
            For more information, see the LW<b>JGL</b> 3 <a href="https://github.com/LWJGL/lwjgl3-wiki/wiki/1.3.-Roadmap">Roadmap</a>.
          </div>
        </section>

        <div className="area-dark">
          <section className="container p-y-2 text-xs-center features">
            <h2>Main Features</h2>
            <div className="line-sep"></div>

            <div className="row">
              <div className="col-md-4 col-xs-12 p-t-1">
                <p><i className="fa fa-4x fa-puzzle-piece" /></p>
                <h3>Low-level Bindings</h3>
                <p>Direct access to OpenGL, OpenCL, OpenAL, GLFW and other native APIs with uncompromised performance
                  and a Java-friendly binding layer.</p>
              </div>
              <div className="col-md-4 col-xs-12 p-t-1">
                <p><i className="fa fa-4x fa-github" /></p>
                <h3>Open Source</h3>
                <p>LWJGL is available under a <a href="http://www.lwjgl.org/license">BSD license</a>. Visit
                  our <a href="https://github.com/LWJGL/lwjgl3">GitHub repository</a> to monitor progress, report issues
                  and even contribute with your own code!</p>
              </div>
              <div className="col-md-4 col-xs-12 p-t-1">
                <p><i className="fa fa-4x fa-book" /></p>
                <h3>Built-in Documentation</h3>
                <p>Get great auto-complete and inline documentation without leaving the comfort of your favorite IDE.</p>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 col-xs-12 p-t-1">
                <p><i className="fa fa-4x fa-desktop" /></p>
                <h3>Cross-platform</h3>
                <p>Write your game or application once, deploy on Windows, Mac, Linux.</p>
              </div>
              <div className="col-md-4 col-xs-12 p-t-1">
                <p><i className="fa fa-4x fa-comments" /></p>
                <h3>Community</h3>
                <p>Need help? Our <a href="http://forum.lwjgl.org/">forum</a> is a great place to seek a solution. Up
                  for a chat? Drop by our <a href="irc://irc.freenode.net/lwjgl">IRC channel</a><br />(#LWJGL on freenode).</p>
              </div>
              <div className="col-md-4 col-xs-12 p-t-1">
                <p><i className="fa fa-4x fa-gamepad" /></p>
                <h3>GLFW Bindings</h3>
                <p>Create multiple windows, handle user input (keyboard, mouse, gaming peripherals) and manage contexts.
                  Also features multi-monitor support, clipboard access, file drag-n-drop,
                  and <a href="http://www.glfw.org/docs/latest/news.html">much more</a>.</p>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 col-xs-12 p-t-1">
                <p><img height={60} src="//d2g0ezo1t7nqa0.cloudfront.net/img/vulkan.png" title="Vulkan" /></p>
                <h3>Vulkan<sup>TM</sup> Bindings</h3>
                <p>A new generation graphics and compute API that provides high-efficiency, cross-platform access to modern
                  GPUs used in a wide variety of devices from PCs and consoles to mobile phones and embedded platforms.</p>
              </div>
              <div className="col-md-4 col-xs-12 p-t-1">
                <p><img height={60} src="//d2g0ezo1t7nqa0.cloudfront.net/img/opencl.png" title="OpenCL" /></p>
                <h3>OpenCL<sup>TM</sup> Bindings</h3>
                <p>The ultimate standard for cross-platform parallel programming on any hardware. LWJGL supports all
                  OpenCL versions (including the latest 2.1 specification) and many useful extensions.</p>
              </div>
              <div className="col-md-4 col-xs-12 p-t-1">
                <p><img height={60} src="//d2g0ezo1t7nqa0.cloudfront.net/img/openal.png" title="OpenAL" /></p>
                <h3>OpenAL Bindings</h3>
                <p>Cross-platform multichannel three-dimensional positional audio. A powerful API for music playback
                  and audio effects. ALC and many extensions are also supported.</p>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 col-xs-12 p-t-1">
                <p><img height={60} src="//d2g0ezo1t7nqa0.cloudfront.net/img/opengl.png" title="OpenGL" /></p>
                <h3>OpenGL<sup>&reg;</sup> Bindings</h3>
                <p>Everything you need to create exciting 2D and 3D graphics. LWJGL supports all OpenGL versions
                  (including the latest 4.5 specification), all ARB, Khronos, and OS-specific extensions ever released
                  and dozens of popular vendor-specific extensions. If your favorite extension is
                  missing, <a href="https://github.com/LWJGL/lwjgl3/issues">ask for it</a> and it will be added in no time!</p>
              </div>
              <div className="col-md-4 col-xs-12 p-t-1">
                <p><img height={60} src="//d2g0ezo1t7nqa0.cloudfront.net/img/opengl-es.png" title="OpenGL|ES" /></p>
                <h3>OpenGL<sup>&reg;</sup> ES Bindings</h3>
                <p>A royalty-free, cross-platform API for full-function 2D and 3D graphics on embedded systems - including
                  consoles, phones, appliances and vehicles. It consists of well-defined subsets of desktop OpenGL, creating
                  a flexible and powerful low-level interface between software and graphics acceleration.</p>
              </div>
              <div className="col-md-4 col-xs-12 p-t-1">
                <p><img height={60} src="//d2g0ezo1t7nqa0.cloudfront.net/img/egl.png" title="EGL" /></p>
                <h3>EGL<sup>TM</sup> Bindings</h3>
                <p>An interface between Khronos rendering APIs such as OpenGL ES or OpenVG and the underlying native
                  platform window system. It handles graphics context management, surface/buffer binding and rendering
                  synchronization and enables high-performance, accelerated, mixed-mode 2D and 3D rendering using other
                  Khronos APIs.</p>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 col-xs-12 p-t-1">
                <p><img height={60} src="//d2g0ezo1t7nqa0.cloudfront.net/img/oculus.png" title="Oculus VR SDK" /></p>
                <h3>LibOVR Bindings <small>(beta)</small></h3>
                <p>Create exciting virtual reality experiences with LibOVR, the API of the Oculus VR SDK.</p>
              </div>
              <div className="col-md-4 col-xs-12 p-t-1">
                <p><img height={60} src="//d2g0ezo1t7nqa0.cloudfront.net/img/xcode.png" title="Objective-C" /></p>
                <h3>Objective-C Bindings</h3>
                <p>Use the Objective-C Runtime to interface your JVM application with Cocoa APIs on Mac OS X.</p>
              </div>
              <div className="col-md-4 col-xs-12 p-t-1">
                <p><i className="fa fa-4x fa-gears" /></p>
                <h3>Customization &amp; Utilities</h3>
                <p>Use <a href="https://sourceware.org/libffi/">libffi</a> to call functions from any native library,
                  use <a href="http://www.canonware.com/jemalloc">jemalloc</a> for efficient and tunable memory management,
                  use the <a href="https://github.com/nothings/stb">stb</a> collection of libraries for texture loading, font
                  rendering and much more.</p>
              </div>
            </div>

            <div className="row">
              <div className="col-xs-12 p-t-1">
                <p><i className="fa fa-4x fa-question-circle" style={{color:"yellow"}} /></p>
                <h3>Your favorite API here!</h3>
                <p>Think LWJGL should have bindings to your favorite API? Let us know
                  or <a href="https://github.com/LWJGL/lwjgl3-wiki/wiki/4.5.-The-Generator">contribute it</a> yourself!</p>

                <hr />

                <p className="text-xs-center" style={{}}>
                  <small>OpenGL® and the oval logo are trademarks or registered trademarks of Silicon Graphics, Inc. in the United States and/or other countries worldwide.</small>
                  <br /><small>OpenCL and the OpenCL logo are trademarks of Apple Inc. used by permission by Khronos.</small>
                  <br /><small>OpenGL ES logo is a trademark of Silicon Graphics Inc. used by permission by Khronos.</small>
                  <br /><small>EGL, the EGL logo, Vulkan and the Vulkan logo are trademarks of the Khronos Group Inc.</small>
                  <br /><small>Oculus, Oculus VR, Oculus Rift, and the Oculus eye logo are trademarks or registered trademarks of Oculus VR, LLC.</small>
                </p>
              </div>
            </div>
          </section>
        </div>

        <section className="container p-y-2">
          <h2 className="text-xs-center">Looking for LWJGL 2?</h2>
          <div className="line-sep"></div>
          <article>
            <p>LW<b>JGL</b> 3 is a fresh start and LWJGL 2 is its predecessor. LWJGL 2 has been used in the creation
              of dozens of games, including titles like <a href="https://minecraft.net/">Minecraft</a> by Mojang
              and <a href="http://www.puppygames.net/revenge-of-the-titans/">Revenge of the Titans</a> by Puppygames.
              It is also used in popular game engines,
              like <a href="http://libgdx.badlogicgames.com/">libGDX</a> and <a href="http://jmonkeyengine.org/">jMonkeyEngine</a>.</p>
          </article>
          <br />
          <div className="text-xs-center">
            <a className="btn btn-primary" href="http://legacy.lwjgl.org/">LWJGL 2 WEBSITE</a>
            &nbsp;
            <a className="btn btn-outline-primary" href="http://wiki.lwjgl.org/">LWJGL 2 WIKI</a>
          </div>
          <br />
          <div className="text-xs-center">
            <a href="https://github.com/LWJGL/lwjgl3-wiki/wiki/1.2.-Why-a-new-version">Why replace LWJGL 2?</a><br />
            <a href="https://github.com/LWJGL/lwjgl3-wiki/wiki/2.6.6-LWJGL3-migration">Migration Guide</a>
          </div>
        </section>
      </div>
    )
  }
});