<?
$pageTitle = "LWJGL 3 Source & Build Status";
include "header.php"
?>

<section class="container">
	<br>
	<h1><i class="fa fa-code"></i> LW<b>JGL</b> 3 Source</h1>

	<h3>Repository</h3>
	<p>LWJGL 3 is hosted on Github. Fork, star and contribute to our project!</p>
	<p><a class="btn btn-success" href="https://github.com/LWJGL/lwjgl3"><i class="fa fa-github"></i> Github Repository</a></p>
	<br>

	<h3>Issue Tracker</h3>
	<p>LWJGL's issue tracker is hosted on Github.</p>
	<p><a class="btn btn-default" href="https://github.com/LWJGL/lwjgl3/issues"><i class="fa fa-bug"></i> Issue Tracker</a></p>
	<br>
</section>

<hr>

<section class="container">
	<style>iframe { display:block; border:0; width:200px; height:40px; }</style>
		<h1><i class="fa fa-history"></i> Build Status</h1>
	<div class="row">
		<div class="col-md-3">
			<h2>LW<b>JGL</b> 3</h2>
			<br>
			<h4>Linux x64</h4>
			<p><a href="https://travis-ci.org/LWJGL-CI/lwjgl3"><img width=90 height=18 src="https://travis-ci.org/LWJGL-CI/lwjgl3.svg?branch=master" alt=""></a></p>
			<br>
			<h4>Linux x86</h4>
			<p><a href="https://travis-ci.org/LWJGL-CI/lwjgl3/branches"><img width=90 height=18 src="https://travis-ci.org/LWJGL-CI/lwjgl3.svg?branch=travis-linux-x86" alt=""></a></p>
			<br>
			<h4>OS X</h4>
			<p><a href="https://travis-ci.org/LWJGL-CI/lwjgl3/branches"><img width=90 height=18 src="https://travis-ci.org/LWJGL-CI/lwjgl3.svg?branch=travis-osx" alt=""></a></p>
			<br>
			<h4>Windows x64</h4>
			<iframe src="teamcity?id=lwjgl_Win64"></iframe>
			<br>
			<h4>Windows x86</h4>
			<iframe src="teamcity?id=lwjgl_Win32"></iframe>
		</div>
		<div class="col-md-3">
			<h2>GLFW</h2>
			<br>
			<h4>Linux x64</h4>
			<p><a href="https://travis-ci.org/LWJGL-CI/glfw"><img width=90 height=18 src="https://travis-ci.org/LWJGL-CI/glfw.svg?branch=master" alt=""></a></p>
			<br>
			<h4>Linux x86</h4>
			<p><a href="https://travis-ci.org/LWJGL-CI/glfw/branches"><img width=90 height=18 src="https://travis-ci.org/LWJGL-CI/glfw.svg?branch=travis-linux-x86" alt=""></a></p>
			<br>
			<h4>OS X</h4>
			<p><a href="https://travis-ci.org/LWJGL-CI/glfw/branches"><img width=90 height=18 src="https://travis-ci.org/LWJGL-CI/glfw.svg?branch=travis-osx" alt=""></a></p>
			<br>
			<h4>Windows x64</h4>
			<iframe src="teamcity?id=glfw_Win64"></iframe>
			<br>
			<h4>Windows x86</h4>
			<iframe src="teamcity?id=glfw_Win32"></iframe>
		</div>
		<div class="col-md-3">
			<h2>OpenAL Soft</h2>
			<br>
			<h4>Linux x64</h4>
			<p><a href="https://travis-ci.org/LWJGL-CI/openal-soft"><img width=90 height=18 src="https://travis-ci.org/LWJGL-CI/openal-soft.svg?branch=master" alt=""></a></p>
			<br>
			<h4>Linux x86</h4>
			<p><a href="https://travis-ci.org/LWJGL-CI/openal-soft/branches"><img width=90 height=18 src="https://travis-ci.org/LWJGL-CI/openal-soft.svg?branch=travis-linux-x86" alt=""></a></p>
			<br>
			<h4>OS X</h4>
			<p><a href="https://travis-ci.org/LWJGL-CI/openal-soft/branches"><img width=90 height=18 src="https://travis-ci.org/LWJGL-CI/openal-soft.svg?branch=travis-osx" alt=""></a></p>
			<br>
			<h4>Windows x64</h4>
			<iframe src="teamcity?id=OpenALSoft_Win64"></iframe>
			<br>
			<h4>Windows x86</h4>
			<iframe src="teamcity?id=OpenALSoft_Win32"></iframe>
		</div>
		<div class="col-md-3">
			<h2>libffi</h2>
			<br>
			<h4>Linux x64</h4>
			<p><a href="https://travis-ci.org/LWJGL-CI/libffi"><img width=90 height=18 src="https://travis-ci.org/LWJGL-CI/libffi.svg?branch=master" alt=""></a></p>
			<br>
			<h4>Linux x86</h4>
			<p><a href="https://travis-ci.org/LWJGL-CI/libffi/branches"><img width=90 height=18 src="https://travis-ci.org/LWJGL-CI/libffi.svg?branch=travis-linux-x86" alt=""></a></p>
			<br>
			<h4>OS X</h4>
			<p><a href="https://travis-ci.org/LWJGL-CI/libffi/branches"><img width=90 height=18 src="https://travis-ci.org/LWJGL-CI/libffi.svg?branch=travis-osx" alt=""></a></p>
			<br>
			<h4>Windows x64</h4>
			<iframe src="teamcity?id=libffi_Win64"></iframe>
			<br>
			<h4>Windows x86</h4>
			<iframe src="teamcity?id=libffi_Win32"></iframe>
		</div>
	</div>
	<br>
</section>

<? include "footer.php" ?>
