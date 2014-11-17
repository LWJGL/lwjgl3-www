<?
$pageDesc = "LWJGL is a Java library that enables cross-platform access to popular native APIs such as OpenGL, OpenAL, and OpenCL.";

require_once "inc/Mobile_Detect.php";
$detect = new Mobile_Detect;

ob_start();
?>
<style>
body {
	padding: 0;
}

.navbar-default {
	background: transparent;
	position: absolute;
}

.navbar-collapse.in {
	background: black;
}

#video-container {
	position: relative;
	background-color: black;
	max-height: 100vh;
	overflow: hidden;
}

#home-video {
	display: block;
	width: 100%;
}

#lwjgl-logo {
	position: absolute;
	top: 0;
	left: 0;
	background: url(//d2g0ezo1t7nqa0.cloudfront.net/img/pattern.png);
	background-color: rgba(0, 0, 0, .5);
	width: 100%;
}

#lwjgl-logo img {
	position: absolute;
	width: 50%;
	left: 50%;
	margin-left: -25%;
	top: 200px;
	top: 30vh;
}

.index-start {
	position: absolute;
	width: 100%;
	bottom: 0;
	left: 0;
	text-align: center;
	color: white;
	line-height: 1em;
	font-weight: 300;
}

@media (max-width: 767px) {
	.index-start h1 {
		font-size: 14px;
	}
}

section.home {
	padding-top: 10px;
	padding-bottom: 50px;
}

article {
	margin: 0 auto;
	color: #555;
}

.features .row div {
	text-align: center;
	padding-bottom: 20px;
}
.features .fa {
	font-size: 32px;
	line-height: 60px;
}

.area-dark sup {
	font-size: 14px;
	line-height:1;
}

.area-dark small {
	color: #6c8f91;
}
</style>
<?
$pageCss = ob_get_contents();
ob_end_clean();

// PAGE SCRIPTS ----------------------------------------------

ob_start();
?>
<script>
"use strict";
$(document).ready(function () {
	var container = $('#video-container');
	var logo = $('#lwjgl-logo');
	var img = logo.find('img');

	// Keep logo centered
	function repaint() {
		var newW = container.width();
		var newH = container.height();

		var logoW = newW / 2;
		var logoH = Math.round(logoW * 372 / 1592);

		logo.height(newH);
		img.css("top", (newH - logoH) / 2 + 'px');
	}

	// Learn more: animate scroll
	$('a[href="/#start"]').click(function () {
		$('body, html').animate({scrollTop: $('#start').offset().top}, 500);
	});

	$(window).resize(repaint);
	$(window).ready(repaint);
	repaint();
	setTimeout(repaint, 1000);
});
</script>
<?
$pageScript = ob_get_contents();
ob_end_clean();
?>

<? include "header.php" ?>

<section id="video-container">
<?
if (!$detect->isMobile() && !$detect->isTablet()) {
?>
	<video id="home-video" poster="//d2g0ezo1t7nqa0.cloudfront.net/video/manfps.jpg" preload="auto" muted loop autoplay>
		<source type="video/webm" src="//d2g0ezo1t7nqa0.cloudfront.net/video/manfps.webm">
		<source type="video/mp4" src="//d2g0ezo1t7nqa0.cloudfront.net/video/manfps.mp4">
	</video>
<?
} else {
?>
	<img id="home-video" src="//d2g0ezo1t7nqa0.cloudfront.net/video/manfps.jpg" alt="">
<?
}
?>
	<div id="lwjgl-logo"><img src="//d2g0ezo1t7nqa0.cloudfront.net/logo/lwjgl3-light.png" alt="LWJGL"></div>
	<div class=index-start>
		<h1>Lightweight Java Game Library 3</h1>
		<p><a href="/#start">LEARN MORE<br><i class="fa fa-angle-down"></i></a></p>
	</div>
</section>

<a id="start"></a>

<section class="container home">
	<h2 class=text-center>What is LW<b>JGL</b> 3?</h2>
	<div class=line-sep></div>
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
	<br>
	<div class=text-center>
		<a class="btn btn-lg btn-primary" href="/download"><i class="fa fa-cloud-download"></i> DOWNLOAD</a>
		<a class="btn btn-lg btn-default" href="/source"><i class="fa fa-code"></i> SOURCE</a>
	</div>
	<br>
	<div class=text-center>
		For more information, see the LW<b>JGL</b> 3 <a href="https://github.com/LWJGL/lwjgl3/wiki/1.3.-Roadmap">Roadmap</a>.
	</div>
</section>

<div class=area-dark>
	<section class="container features">
		<h2 class=text-center>Main Features</h2>
		<div class=line-sep></div>

		<div class=row>
			<div class=col-md-4>
				<p><i class="fa fa-puzzle-piece"></i></p>
				<h3>Low-level Bindings</h3>
				<p>Direct access to OpenGL, OpenCL, OpenAL, GLFW and other native APIs with uncompromised performance
				and a Java-friendly binding layer.</p>
			</div><div class=col-md-4>
				<p><i class="fa fa-github"></i></p>
				<h3>Open Source</h3>
				<p>LWJGL is available under a <a href="http://new.lwjgl.org/license">BSD license</a>. Visit our
				<a href="https://github.com/LWJGL/lwjgl3">GitHub repository</a> to monitor progress, report issues
				and even contribute with your own code!</p>
			</div><div class=col-md-4>
				<p><i class="fa fa-book"></i></p>
				<h3>Built-in Documentation</h3>
				<p>Get great auto-complete and inline documentation without leaving the comfort of your favorite IDE.</p>
			</div>
		</div><div class=row>
			<div class=col-md-4>
				<p><i class="fa fa-desktop"></i></p>
				<h3>Cross-platform</h3>
				<p>Write your game or application once, deploy on Windows, Mac, Linux.</p>
			</div><div class=col-md-4>
				<p><i class="fa fa-comments"></i></p>
				<h3>Community</h3>
				<p>Need help? Our <a href="http://forum.lwjgl.org/">forum</a> is a great place to seek a solution. Up
				for a chat? Drop by our <a href="irc://irc.freenode.net/lwjgl">IRC channel</a><br>(#LWJGL on freenode).</p>
			</div><div class=col-md-4>
				<p><i class="fa fa-gears"></i></p>
				<h3>GLFW Bindings</h3>
				<p>Create multiple windows, handle user input (keyboard, mouse, gaming peripherals) and manage OpenGL
				contexts. Also features multi-monitor support, clipboard access, file drag-n-drop, and
				<a href="http://www.glfw.org/docs/latest/news.html">much more</a>.</p>
			</div>
		</div><div class=row>
			<div class=col-md-4>
				<p><img width=122 height=60 src="//d2g0ezo1t7nqa0.cloudfront.net/img/opengl.png" alt="OpenGL"></p>
				<h3>OpenGL<sup>&reg;</sup> Bindings</h3>
				<p>Everything you need to create exciting 2D and 3D graphics. LWJGL supports all OpenGL versions
				(including the latest 4.5 specification), all ARB, Khronos, and OS-specific extensions ever released
				and dozens of popular vendor-specific extensions. If your favorite extension is missing,
				<a href="https://github.com/LWJGL/lwjgl3/issues">ask for it</a> and it will be added in no time!</p>
			</div><div class=col-md-4>
				<p><img width=60 height=60 src="//d2g0ezo1t7nqa0.cloudfront.net/img/opencl.png" alt="OpenCL"></p>
				<h3>OpenCL<sup>TM</sup> Bindings</h3>
				<p>The ultimate standard for cross-platform parallel programming on any hardware. LWJGL supports all
				OpenCL versions (including the latest 2.0 specification) and many useful extensions.</p>
			</div><div class=col-md-4>
				<p><img width=112 height=60 src="//d2g0ezo1t7nqa0.cloudfront.net/img/openal.png" alt="OpenGL|ES"></p>
				<h3>OpenAL Bindings</h3>
				<p>Cross-platform multichannel three-dimensional positional audio. A powerful API for music playback
				and audio effects. ALC and many extensions are also supported.</p>
			</div>
		</div><div class=row>
			<div class=col-md-4>
				<p><img width=160 height=60 src="//d2g0ezo1t7nqa0.cloudfront.net/img/opengl-es.png" alt="OpenGL|ES"></p>
				<h3>OpenGL<sup>&reg;</sup> ES Bindings</h3>
				<p>(coming soon)</p>
			</div><div class=col-md-4>
				<p><img width=98 height=60 src="//d2g0ezo1t7nqa0.cloudfront.net/img/egl.png" alt="OpenGL|ES"></p>
				<h3>EGL<sup>TM</sup> Bindings</h3>
				<p>(coming soon)</p>
			</div><div class=col-md-4>
				<p><i class="fa fa-question-circle" style="color:yellow"></i></p>
				<h3>Your favorite API here!</h3>
				<p>Think LWJGL should have bindings to your favorite API? Let us know or
				<a href="https://github.com/LWJGL/lwjgl3/wiki/4.5.-The-Generator">contribute it</a> yourself!</p>
			</div>
		</div>

		<p class=text-center>
			<small>OpenGL® and the oval logo are trademarks or registered trademarks of Silicon Graphics, Inc. in the United States and/or other countries worldwide.</small>
			<br><small>OpenCL and the OpenCL logo are trademarks of Apple Inc. used by permission by Khronos.</small>
			<br><small>OpenGL ES logo is a trademark of Silicon Graphics Inc. used by permission by Khronos.</small>
			<br><small>EGL and the EGL logo are trademarks of the Khronos Group Inc.</small>
		</p>
		<br>
	</section>
</div>

<section class="container home">
	<h2 class=text-center>Looking for LWJGL 2?</h2>
	<div class=line-sep></div>
	<article>
		<p>LW<b>JGL</b> 3 is a fresh start and LWJGL 2 is its predecessor. LWJGL 2 has been used in the creation of dozens of
		games, including titles like <a href="https://minecraft.net/">Minecraft</a> by Mojang and
		<a href="http://www.puppygames.net/revenge-of-the-titans/">Revenge of the Titans</a> by Puppygames. It is also
		used in popular game engines, like <a href="http://libgdx.badlogicgames.com/">libGDX</a> and
		<a href="http://jmonkeyengine.org/">jMonkeyEngine</a>.</p>
	</article>
	<br>
	<div class=text-center>
		<a class="btn btn-default btn-primary" href="http://legacy.lwjgl.org/">LWJGL 2 WEBSITE</a>
		<a class="btn btn-default" href="http://wiki.lwjgl.org/">LWJGL 2 WIKI</a>
	</div>
	<br>
	<div class=text-center>
		<a href="https://github.com/LWJGL/lwjgl3/wiki/1.2.-Why-a-new-version">Why replace LWJGL 2?</a>
	</div>
</section>

<? include "footer.php" ?>