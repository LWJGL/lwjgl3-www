<?
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
	background: url(//cdn.lwjgl.org/img/pattern.png);
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
}
.features .fa {
	margin-top: 20px;
	font-size: 32px;
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
	setTimeout(repaint, 0);
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
	<video id="home-video" poster="//cdn.lwjgl.org/video/manfps.jpg" preload="auto" muted loop autoplay>
		<source type="video/webm" src="//cdn.lwjgl.org/video/manfps.webm">
		<source type="video/mp4" src="//cdn.lwjgl.org/video/manfps.mp4">
	</video>
<?
} else {
?>
	<img id="home-video" src="//cdn.lwjgl.org/video/manfps.jpg" alt="">
<?
}
?>

	<div id="lwjgl-logo"><img src="//cdn.lwjgl.org/logo/lwjgl3-light.png" alt="LWJGL"></div>
	<div class="index-start">
		<h1>Lightweight Java Gaming Library 3</h1>
		<p><a href="/#start">LEARN MORE<br><i class="fa fa-angle-down"></i></a></p>
	</div>
</section>

<a id="start"></a>

<?
if (!$detect->isMobile() && !$detect->isTablet()) {
?>
	<iframe src="/inc/cube.html" style="display:block;width:200px;height:200px;border:0;margin:0 auto"></iframe>
<?
}
?>

<section class="container home">
	<h2 class="text-center">What is LW<b>JGL</b> 3?</h2>
	<div class="line-sep"></div>
	<article>
		<p>LW<b>JGL</b> is a Java library that enables cross-platform access to popular native APIs useful in the development of graphics (<a href="https://www.opengl.org/">OpenGL</a>), audio (<a href="http://www.openal.org/">OpenAL</a>) and parallel computing (<a href="https://www.khronos.org/opencl/">OpenCL</a>) applications. This access is direct and high-performance, yet also wrapped in a type-safe and user-friendly layer, appropriate for the Java ecosystem.</p>
		
		<p>LW<b>JGL</b> enables technology and provides low-level access. It is not a framework and does not provide higher-level utilities than what the native libraries expose. As such, novice programmers are encouraged to try one of the frameworks or game engines that make use of LWJGL, before working directly with the library.</p>
		
		<p>LW<b>JGL</b> is open source software and freely available at no charge.</p>
	</article>
	<br>
	<div class="text-center">
		<a class="btn btn-lg btn-primary" href="/download"><i class="fa fa-cloud-download"></i> DOWNLOAD</a>
		<a class="btn btn-lg btn-default" href="/source"><i class="fa fa-code"></i> SOURCE</a>
	</div>
</section>

<div class="area-dark">
	<section class="container home features">
		<h2 class="text-center">Main Features</h2>
		<div class="line-sep"></div>

		<div class="row">
			<div class="col-md-4">
				<p><i class="fa fa-puzzle-piece"></i></p>
				<h3>Low-level Bindings</h3>
				<p>Direct access to OpenGL, OpenCL, OpenAL, GLFW and other native APIs with uncompromised performance and a Java-friendly binding layer.</p>
				
				<p><i class="fa fa-desktop"></i></p>
				<h3>Cross-platform</h3>
				<p>Write your game or application once, deploy on Windows, Mac, Linux.</p>
			</div>
			<div class="col-md-4">
				<p><i class="fa fa-github"></i></p>
				<h3>Open Source</h3>

				<p>LWJGL is available under a <a href="http://new.lwjgl.org/license">BSD license</a>. Visit our <a href="https://github.com/LWJGL/lwjgl3">GitHub repository</a> to monitor progress, report issues and even contribute with your own code!</p>
				<p><i class="fa fa-comments"></i></p>
				<h3>Community</h3>
				<p>Need help? Our <a href="http://forum.lwjgl.org/">forums</a> is a great place to seek a solution. Up for a chat? Drop by our <a href="irc://irc.freenode.net/lwjgl">IRC channel</a> (#LWJGL on freenode).</p>
			</div>
			<div class="col-md-4">
				<p><i class="fa fa-book"></i></p>
				<h3>Built-in Documentation</h3>
				<p>Get great auto-complete and inline documentation without leaving the comfort of your favorite IDE.</p>

				<p><i class="fa fa-gamepad"></i></p>
				<h3>Controller</h3>
				<p>Get great support game controllers, gamepads, joysticks, etc.</p>
			</div>
		</div>

	</section>
</div>

<section class="container home">
	<h2 class="text-center">Looking for LWJGL 2?</h2>
	<div class="line-sep"></div>
	<article>
		<p>LWJGL 3 is a fresh start and LWJGL 2 is its predecessor. It has been used in the creation of dozens of games, including titles like <a href="https://minecraft.net/">Minecraft</a> by Mojang and <a href="http://www.puppygames.net/revenge-of-the-titans/">Revenge of the Titans</a> by Puppygames. It is also used in popular game engines, like <a href="http://libgdx.badlogicgames.com/">libGDX</a> and <a href="http://jmonkeyengine.org/">jMonkeyEngine</a>.</p>
	</article>
	<br>
	<div class="text-center">
		<a class="btn btn-default btn-primary" href="http://v2.lwjgl.org/">LWJGL 2 WEBSITE</a>
		<a class="btn btn-default" href="http://wiki.lwjgl.org/">LWJGL 2 WIKI</a>
	</div>
</section>

<? include "footer.php" ?>