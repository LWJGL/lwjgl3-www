<?ob_start()?>
<script src="//cdnjs.cloudflare.com/ajax/libs/SyntaxHighlighter/3.0.83/scripts/shCore.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/SyntaxHighlighter/3.0.83/scripts/shBrushJava.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/SyntaxHighlighter/3.0.83/scripts/shBrushXml.js"></script>
<script>
SyntaxHighlighter.config.tagName = "code";
SyntaxHighlighter.all();
</script>
<?
$pageScript = ob_get_contents();
ob_end_clean();
ob_start();
?>
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/SyntaxHighlighter/3.0.83/styles/shCore.css">
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/SyntaxHighlighter/3.0.83/styles/shThemeRDark.css">
<style>
section.codehlt { background: #1b2426 url(//d2g0ezo1t7nqa0.cloudfront.net/img/pattern.png); margin-bottom: 20px; vertical-align: top }
.syntaxhighlighter { margin: 0 !important; padding: 12px 0; }
.syntaxhighlighter .container:before, .syntaxhighlighter .container:after { display: none; }
pre { background-color: #1b2426; }
</style>
<?
$pageStyle = ob_get_contents();
ob_end_clean();

$pageTitle = "Getting started guide for LWJGL 3";
$pageDesc = "This guide will help you get started with LWJGL 3";
include "header.php"
?>

<section class="container">
	<br>
	<h1>LW<b>JGL</b> 3 Guide</h1>

	<p>This guide will help you get started with LWJGL.</p>

	<h3>Getting Started</h3>

	<p>Please use our <a href="http://www.lwjgl.org/download">download page</a> to download an LWJGL release. You will also need a <a href="http://www.oracle.com/technetwork/java/javase/downloads/index.html">Java SE Development Kit</a> (JDK), LWJGL will work on version 6 or newer. Then proceed by setting up a project in your favorite IDE and configuring it like so:
	<ul>
		<li>Add the LWJGL jars to the classpath. This is usually done by setting up a library dependency for your project and attaching jars to it.</li>
		<li>Set the <strong>-Djava.library.path</strong> system property (as a JVM launch argument) to the appropriate path for the target OS/architecture</li>
		<li>Attach the LWJGL javadoc and source archives to the LWJGL library (optional, but hightly recommended)</li>
	</ul>
	</p>
	
	<p>You should now be ready to develop and launch an LWJGL application. Following is a simple example that utilizes GLFW to create a window and clear the background color to red, using OpenGL:</p>
</section>
<section class="codehlt">
<div class="container">
<pre style=";margin:0;border:0;border-radius:0"><code class="brush: java; tab-size: 4; toolbar: false">import org.lwjgl.Sys;
import org.lwjgl.glfw.*;
import org.lwjgl.opengl.*;

import java.nio.ByteBuffer;

import static org.lwjgl.glfw.Callbacks.*;
import static org.lwjgl.glfw.GLFW.*;
import static org.lwjgl.opengl.GL11.*;
import static org.lwjgl.system.MemoryUtil.*;

public class HelloWorld {

	// We need to strongly reference callback instances.
	private GLFWErrorCallback errorCallback;
	private GLFWKeyCallback   keyCallback;

	// The window handle
	private long window;

	public void run() {
		System.out.println("Hello LWJGL " + Sys.getVersion() + "!");

		try {
			init();
			loop();

			// Release window and window callbacks
			glfwDestroyWindow(window);
			keyCallback.release();
		} finally {
			// Terminate GLFW and release the GLFWerrorfun
			glfwTerminate();
			errorCallback.release();
		}
	}

	private void init() {
		// Setup an error callback. The default implementation
		// will print the error message in System.err.
		glfwSetErrorCallback(errorCallback = errorCallbackPrint(System.err));

		// Initialize GLFW. Most GLFW functions will not work before doing this.
		if ( glfwInit() != GL11.GL_TRUE )
			throw new IllegalStateException("Unable to initialize GLFW");

		// Configure our window
		glfwDefaultWindowHints(); // optional, the current window hints are already the default
		glfwWindowHint(GLFW_VISIBLE, GL_FALSE); // the window will stay hidden after creation
		glfwWindowHint(GLFW_RESIZABLE, GL_TRUE); // the window will be resizable

		int WIDTH = 300;
		int HEIGHT = 300;

		// Create the window
		window = glfwCreateWindow(WIDTH, HEIGHT, "Hello World!", NULL, NULL);
		if ( window == NULL )
			throw new RuntimeException("Failed to create the GLFW window");

		// Setup a key callback. It will be called every time a key is pressed, repeated or released.
		glfwSetKeyCallback(window, keyCallback = new GLFWKeyCallback() {
			@Override
			public void invoke(long window, int key, int scancode, int action, int mods) {
				if ( key == GLFW_KEY_ESCAPE && action == GLFW_RELEASE )
					glfwSetWindowShouldClose(window, GL_TRUE); // We will detect this in our rendering loop
			}
		});

		// Get the resolution of the primary monitor
		ByteBuffer vidmode = glfwGetVideoMode(glfwGetPrimaryMonitor());
		// Center our window
		glfwSetWindowPos(
			window,
			(GLFWvidmode.width(vidmode) - WIDTH) / 2,
			(GLFWvidmode.height(vidmode) - HEIGHT) / 2
		);

		// Make the OpenGL context current
		glfwMakeContextCurrent(window);
		// Enable v-sync
		glfwSwapInterval(1);

		// Make the window visible
		glfwShowWindow(window);
	}

	private void loop() {
		// This line is critical for LWJGL's interoperation with GLFW's
		// OpenGL context, or any context that is managed externally.
		// LWJGL detects the context that is current in the current thread,
		// creates the ContextCapabilities instance and makes the OpenGL
		// bindings available for use.
		GLContext.createFromCurrent();

		// Set the clear color
		glClearColor(1.0f, 0.0f, 0.0f, 0.0f);

		// Run the rendering loop until the user has attempted to close
		// the window or has pressed the ESCAPE key.
		while ( glfwWindowShouldClose(window) == GL_FALSE ) {
			glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT); // clear the framebuffer

			glfwSwapBuffers(window); // swap the color buffers

			// Poll for window events. The key callback above will only be
			// invoked during this call.
			glfwPollEvents();
		}
	}

	public static void main(String[] args) {
		new HelloWorld().run();
	}

}</code></pre>
</div>
</section>
<section class="container">
	<p>LWJGL is fully documented, you can explore the javadoc documentation online <a href="http://javadoc.lwjgl.org/">starting here</a>. For more information about LWJGL's design choices and overall architecture, visit the <a href="https://github.com/LWJGL/lwjgl3-wiki/wiki">wiki</a>. The <a href="https://github.com/LWJGL/lwjgl3-wiki/wiki/1.5.-Bindings-FAQ">bindings FAQ</a> page is especially useful. For more code examples, see the <a href="https://github.com/LWJGL/lwjgl3/tree/master/src/tests/org/lwjgl">tests module</a> in the LWJGL repository</p>

	<h3>Building from source</h3>

	<p>Clone the <a href="https://github.com/LWJGL/lwjgl3.git">Git repository</a> locally, install a JDK and <a href="http://ant.apache.org/">Apache Ant</a>, optionally set the JAVA6_HOME environment variable to point to a JDK 6 installation, then you should be ready to build. Use the following targets:
	<ul>
		<li><em>ant</em> &ndash; Builds everything and runs the tests</li>
		
		<li><em>ant compile-templates</em> &ndash; Compiles the binding generator templates</li>
		<li><em>ant compile</em> &ndash; Compiles the Java code (including generated)</li>
		<li><em>ant compile-native</em> &ndash; Compiles and links the native library</li>
		<li><em>ant tests</em> &ndash; Runs the test suite</li>
		<li><em>ant demo -Dclass=&lt;demo class&gt;</em> &ndash; Runs one of the LWJGL demos in the test module</li>
		
		<li><em>ant clean</em> &ndash; Deletes all files and folders generated by the build script.</li>
		<li><em>and -f update_dependencies.xml</em> &ndash; Forces all dependencies to be downloaded again.</li>
	</ul></p>
	
	<p>Note that the target native architecture is determined by <em>os.arch</em> of the JVM that runs Ant. For cross-compiling, use the LWJGL_BUILD_ARCH environment variable to override it (set it to <em>x86</em> or <em>x64</em>).</p>
	
	<p>Binary dependencies are downloaded from the stable download branch. Use the LWJGL_BUILD_TYPE environment variable to override this:
	<ul>
		<li><em>nightly</em> &ndash; the latest successful build, possibly broken. Dependency repositories can be found <a href="https://github.com/LWJGL-CI">here</a></li>
		<li><em>stable</em> &ndash; the latest build that has been verified to work with LWJGL, the default</li>
		<li><em>release/latest</em> &ndash; the latest stable build that has been promoted to an official LWJGL release</li>
		<li><em>release/{build.version}</em> &ndash; a specific previously released build</li>
	</ul></p>
	
	<p>If you are using custom binaries, or simply need to work offline, set the LWJGL_BUILD_OFFLINE environment variable to one of <em>true/on/yes</em>.</p>
	
	<p>The LWJGL build process creates thousands of tiny files. If you wish to redirect output to another directory or storage device, you may set the LWJGL_BUILD_OUTPUT environment variable.</p>
</section>

<br><br>

<div class="area-dark">
	<section class="container">
		<h1>Is LW<b>JGL</b> for me?</h1>

		<p>LWJGL is simple but powerful. It is not for everyone.</p>
		<p>If you're into OpenGL, you'll feel right at home.</p>
		<p>If you're just getting started, please familiarize yourself with each API first.</p>
		<br>
	</section>
</div>

<br><br>

<section class="container">
	<h2>GLFW</h2>
	<p><a href="http://www.glfw.org/">GLFW</a> is an Open Source, multi-platform library for creating windows with OpenGL contexts and receiving input and events. It is easy to integrate into existing applications and does not lay claim to the main loop.</p>
	
	<p>GLFW is the preferred windowing system for LWJGL 3 applications. If you're familiar with LWJGL 2, GLFW is a replacement for the Display class and everything in the input package.</p>
	
	<p>Learning GLFW is easy. It has a simple, yet powerful, API and comprehensive <a href="http://www.glfw.org/docs/latest/">documentation</a>.</p>
</section>
<hr>
<section class="container">
	<h2>OpenGL</h2>
	<p><a href="https://www.opengl.org/about/">OpenGL</a> is the premier environment for developing portable, interactive 2D and 3D graphics applications.</p>
	
	<p>OpenGL is a massive API with long history and hundreds of extensions. Learning it from scratch is no easy undertaking, but you can start from its <a href="https://www.opengl.org/documentation/">documentation</a>. The <a href="https://www.opengl.org/registry/">OpenGL registry</a> is also quite useful.</p>
</section>
<hr>
<section class="container">
	<h2>OpenCL</h2>
	<p><a href="https://www.khronos.org/opencl/">OpenCL</a> is the first open, royalty-free standard for cross-platform, parallel programming of modern processors found in personal computers, servers and handheld/embedded devices. OpenCL (Open Computing Language) greatly improves speed and responsiveness for a wide spectrum of applications in numerous market categories from gaming and entertainment to scientific and medical software.</p>
	
	<p>Specifications for OpenCL and its extensions can be found at the <a href="https://www.khronos.org/registry/cl/">Khronos OpenCL registry</a>.</p>
</section>
<hr>
<section class="container">
	<h2>OpenAL</h2>
	<p><a href="http://www.openal.org/">OpenAL</a> (for "Open Audio Library") is a software interface to audio hardware. The interface consists of a number of functions that allow a programmer to specify the objects and operations in producing high-quality audio output, specifically multichannel output of 3D arrangements of sound sources around a listener.</p>
	
	<p>LWJGL is bundled with <a href="http://kcat.strangesoft.net/openal.html">OpenAL Soft</a>, an LGPL-licensed, cross-platform, software implementation of the OpenAL 3D audio API.</p>
</section>

<? include "footer.php" ?>
