<!DOCTYPE html>
<style>
html,body {
	margin: 0; padding: 0;
}
html {
	overflow: hidden;
	font: 12px/1.5 Verdana, sans-serif;
}
img {
	vertical-align: bottom;
}
.tcTable td {
	padding-right: 5px;
	vertical-align: top;
}
.tcTD_projectName, .buildResults {
  display:none;
}
</style>
<script src="http://teamcity.lwjgl.org/externalStatus.html?js=1&buildTypeId=<?=$_GET['id']?>"></script>