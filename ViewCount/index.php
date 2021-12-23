<!DOCTYPE html>
<html>

<head>
	<title>View Counter</title>
	<link rel="stylesheet" href="style.css">
	<meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline';" />
	
</head>

<body class="winHTML">
	<h1>viewer count:</h1>
	<div id="viewerCount">
		<?php
			$fileName = "../counter.txt";
			$handle = fopen($fileName, "r");
			$counter = (int) fread($handle, 20);
			fclose($handle);

			echo str_pad($counter, 6, "0", STR_PAD_LEFT);
		?>
	</div>
</body>

<script type="module" src="script.js"></script>

</html>