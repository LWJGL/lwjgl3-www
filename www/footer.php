<hr>

<footer class="container">
<nav class="row">
	<div class="col-md-3">
		<h3>About</h3>
		<ul class="list-unstyled fa-ul">
			<li><i class="fa-li fa fa-home"></i> <a href="/">Home</a></li>
			<li><i class="fa-li fa fa-info-circle"></i> <a href="/#start">About</a></li>
			<li><i class="fa-li fa fa-legal"></i> <a href="/license">License</a></li>
<?/*
			<li><i class="fa-li fa fa-question-circle"></i> <a href="/faq">F.A.Q.</a></li>
			<li><i class="fa-li fa fa-gift"></i> <a href="#">Donations</a></li>
			<li><i class="fa-li fa fa-envelope"></i> <a href="#">Contact</a></li>
*/?>
		</ul>
	</div>
	<div class="col-md-3">
		<h3>News</h3>
		<ul class="list-unstyled fa-ul">
			<li><i class="fa-li fa fa-newspaper-o"></i> <a href="http://blog.lwjgl.org/">Blog</a></li>
			<li><i class="fa-li fa fa-group"></i> <a href="http://forum.lwjgl.org/">Forum</a></li>
			<li><i class="fa-li fa fa-twitter"></i> <a href="https://twitter.com/lwjgl" rel="external nofollow">Twitter</a></li>
			<li><i class="fa-li fa fa-code"></i> <a href="https://github.com/LWJGL/lwjgl3/commits/master">ChangeLog</a></li>
		</ul>
	</div>
	<div class="col-md-3">
		<h3>Developers</h3>
		<ul class="list-unstyled fa-ul">
			<li><i class="fa-li fa fa-github"></i> <a href="https://github.com/LWJGL/lwjgl3">GitHub</a></li>
			<li><i class="fa-li fa fa-book"></i> <a href="https://github.com/LWJGL/lwjgl3/wiki">Wiki</a></li>
			<li><i class="fa-li fa fa-bug"></i> <a href="https://github.com/LWJGL/lwjgl3/issues">Issues</a></li>
			<li><i class="fa-li fa fa-file-code-o"></i> <a href="http://javadoc.lwjgl.org/">JavaDoc</a></li>
		</ul>
	</div>
	<div class="col-md-3">
		<h3>Sponsor</h3>
		<a href="http://www.webhotelier.net/" title="WebHotelier"><img width=143 height=30 src="https://dloycpjzg76ow.cloudfront.net/images/brand/webhotelier-logo@x2.png" alt="WebHotelier"></a>
	</div>
</nav>
</footer>

<section class="credits">
<div class="container">
	<p>Copyright &copy; 2012-2014 Lightweight Java Game Library Project. All rights reserved.</p>
</div>
</section>

<script>
WebFontConfig = {
	google: { families: [ 'Fira+Sans:300,400,700:latin' ] }
};
(function() {
var wf = document.createElement('script');
wf.src = '//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
wf.async = 'true';
document.body.appendChild(wf);
var fontAwesome = document.createElement('link');
fontAwesome.rel = "stylesheet";
fontAwesome.href = "//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css";
document.head.appendChild(fontAwesome);
})();
</script>
<script src="//code.jquery.com/jquery-2.1.1.min.js"></script>
<?
if ( isset($pageScript) ) {
	print $pageScript;
}
?>
<script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/js/bootstrap.min.js"></script>
</body>
</html>