<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name=viewport content="width=device-width, initial-scale=1">
	<title><?
	if ( isset($pageTitle) ) {
		print $pageTitle;
	} else {
		print "LWJGL - Lightweight Java Gaming Library";
	}
	?></title>
	<link rel="shortcut icon" href="//cdn.lwjgl.org/fav.ico" type="image/x-icon">
	<link rel=stylesheet href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap.min.css">
	<style>
	body {
		background-color: white;
		padding-top: 50px;
		font-family: 'Fira Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
	}

	h1,h2,h3 {
		font-weight: 300;
	}

	.navbar-default {
		background-color: #000;
		border: 0;
	}

	.navbar-default .navbar-brand, .navbar-default .navbar-text {
		color: #fff;
	}

	.navbar-default {
		font-weight: 300;
	}

	.navbar-default .navbar-brand b {
		font-weight: normal;
	}

	.navbar-default .navbar-brand,
	.navbar-default .navbar-nav>li>a {
		color: #fff;
	}

	.navbar-default .navbar-brand:hover,
	.navbar-default .navbar-nav>li>a:hover {
		color: lightblue;
	}

	footer {
		margin-top: 5px;
	}

	.credits {
		margin-top: 20px;
		padding: 20px 0 10px 0;
		font-size: 14px;
		font-weight: 300;
		background-color: #f9f9f9;
	}

	.line-sep {
		margin: 0 auto 10px auto;
		width: 30px;
		border-bottom: 2px solid black;
	}

	.area-dark {
		background-color: #313437;
		color: white;
	}

	.area-dark .line-sep {
		border-color: white;
	}
	</style>
<?
	if ( isset($pageCss) ) {
		print $pageCss;
	}
?>
</head>
<?/*
<body class="<?= substr(explode(".", $_SERVER['PHP_SELF'])[0], 1) ?>">
*/?>
<body>

<nav class="navbar navbar-default navbar-fixed-top" role="navigation">
<div class="container">

	<div class="navbar-header">
		<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#main-navbar">
		<span class="sr-only">Toggle navigation</span>
		<span class="icon-bar"></span>
		<span class="icon-bar"></span>
		<span class="icon-bar"></span>
		</button>
		<a class="navbar-brand" href="/">LW<b>JGL</b> 3</a>
	</div>

	<div class="collapse navbar-collapse" id="main-navbar">
		<ul class="nav navbar-nav pull-right">
			<li><a href="/#start"><i class="fa fa-info-circle"></i> ABOUT</a></li>
			<li><a href="/guide"><i class="fa fa-cube"></i> GET STARTED</a></li>
			<li><a href="/download"><i class="fa fa-cloud-download"></i> DOWNLOAD</a></li>
			<li><a href="/source"><i class="fa fa-code"></i> SOURCE</a></li>
			<li><a href="http://forum.lwjgl.org/"><i class="fa fa-group"></i> FORUM</a></li>
			<li><a href="http://blog.lwjgl.org/"><i class="fa fa-newspaper-o"></i> BLOG</a></li>
		</ul>
	</div>
</div>
</nav>
