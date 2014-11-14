<?
$pageTitle = "Download LWJGL 3";
$pageDesc = "Download release, stable, or nightly builds of LWJGL 3";
include "header.php"
?>

<section class="container">
	<br>
	<h1>Download LW<b>JGL</b></h1>

	<div class="row">
		<div class="col-md-4">
			<h3>Release</h3>
			<p>LWGL 3 has not had any releases yet.</p>
			<p><a class="btn btn-success" disabled href="#"><i class="fa fa-clock-o"></i> CHECK BACK LATER</a></p>
		</div>
		<div class="col-md-4">
			<h3>Stable</h3>
			<p>Latest build that has been verified to work.</p>
			<p><a class="btn btn-warning" href="http://build.lwjgl.org/stable/lwjgl.zip"><i class="fa fa-cloud-download"></i> DOWNLOAD LWJGL 3 STABLE</a></p>
		</div>
		<div class="col-md-4">
			<h3>Nightly</h3>
			<p>Bleeding edge, possibly broken</p>
			<p><a class="btn btn-danger" href="http://build.lwjgl.org/nightly/lwjgl.zip"><i class="fa fa-cloud-download"></i> DOWNLOAD LWJGL 3 NIGHTLY</a></p>
			<br>

			<h3>Build Status ( Nightly )</h3>
			<iframe src="teamcity?id=lwjgl_Bundle" style="border:0;width:200px;height:40px"></iframe>
		</div>
	</div>
	<br>
</section>

<br><br>

<div class="area-dark">
	<section class="container">
		<h1>Looking for LWJGL 2?</h1>

		<p>LWJGL 2 has moved but is still available. Please follow the links below to find what you're looking for:</p>
		<p>
			<a class="btn btn-default" href="http://legacy.lwjgl.org/">LWJGL 2 WEBSITE</a>
			<a class="btn btn-default" href="http://wiki.lwjgl.org/">LWJGL 2 WIKI</a>
		</p>
		<br>
	</section>
</div>
<br>
<section class="container">
	<p>Broken download? Let us know at the <a href="http://forum.lwjgl.org/">forums</a>.</p>
</section>

<section class="container">
	<h3>Build from source?</h3>
	<p>Click below if you prefer to build from source:</p>
	<p>
		<a class="btn btn-default" href="/source"><i class="fa fa-code"></i> Source</a>
		<a class="btn btn-default" href="/guide#build"><i class="fa fa-info-circle"></i> Build instructions</a>
	</p>
</section>

<? include "footer.php" ?>
