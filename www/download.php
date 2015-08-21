<?
$pageTitle = "Download LWJGL 3";
$pageDesc = "Download release, stable, or nightly builds of LWJGL 3";
include "header.php"
?>

<section class="container">
	<br>
	<h1>Download LW<b>JGL</b> 3</h1>

	<div class="row">
		<div class="col-md-4">
			<h3>Release (obsolete)</h3>
			<p>Latest official release.</p>
			<p><a class="btn btn-success" href="http://build.lwjgl.org/release/latest/lwjgl.zip"><i class="fa fa-clock-o"></i> DOWNLOAD ALPHA</a></p>
			<iframe src="teamcity?id=LwjglReleases_StableToRelease" style="border:0;width:200px;height:40px"></iframe>
		</div>
		<div class="col-md-4">
			<h3>Stable (newer)</h3>
			<p>Latest build that has been verified to work.</p>
			<p><a class="btn btn-warning" href="http://build.lwjgl.org/stable/lwjgl.zip"><i class="fa fa-cloud-download"></i> DOWNLOAD STABLE</a></p>
			<iframe src="teamcity?id=LwjglReleases_NightlyToStable" style="border:0;width:200px;height:40px"></iframe>
		</div>
		<div class="col-md-4">
			<h3>Nightly (newest)</h3>
			<p>Bleeding edge, possibly broken.</p>
			<p><a class="btn btn-danger" href="http://build.lwjgl.org/nightly/lwjgl.zip"><i class="fa fa-cloud-download"></i> DOWNLOAD NIGHTLY</a></p>
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
