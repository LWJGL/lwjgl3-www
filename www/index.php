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
if (!$detect->isMobile() && !$detect->isTablet() && false) {
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

	<div id="lwjgl-logo"><img src="//cdn.lwjgl.org/img/lwjgl3-w.png" alt="LWJGL"></div>
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
		<p>Short description of LWJGL 3...</p>
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
				<p><i class="fa fa-desktop"></i></p>
				<h3>Multi-platform</h3>
				<p>Publish your games or apps on Windows, Mac, Linux, all with the same code base.</p>

				<p><i class="fa fa-book"></i></p>
				<h3>Built-in Documentation</h3>
				<p>Get great auto-complete and inline documentation on your favorite IDE.</p>
			</div>
			<div class="col-md-4">
				<p><i class="fa fa-github"></i></p>
				<h3>Open Source</h3>
				<p>Publish your games or apps on Windows, Mac, Linux, all with the same code base.</p>

				<p><i class="fa fa-comments"></i></p>
				<h3>Community</h3>
				<p>Get great support from a big and growing community of game and application developers.</p>
			</div>
			<div class="col-md-4">
				<p><i class="fa fa-puzzle-piece"></i></p>
				<h3>Low-level Bindings</h3>
				<p>Low-level bindings to OpenGL, OpenCL, OpenAL.</p>

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
		<p>Short description of LWJGL 2...</p>
	</article>
	<br>
	<div class="text-center">
		<a class="btn btn-default btn-primary" href="http://v2.lwjgl.org/">LWJGL 2 WEBSITE</a>
		<a class="btn btn-default" href="http://wiki.lwjgl.org/">LWJGL 2 WIKI</a>
	</div>
</section>

<? include "footer.php" ?>