<?php
	$fileName = "counter.txt";
	$handle = fopen($fileName, "r");
	if (!$handle) {
		// Create file if it does not exist
		fopen($fileName, "w");
	}

	$counter = (int) fread($handle, 20);
	fclose($handle);

	$counter++;
	$handle = fopen($fileName, "w");
	fwrite($handle, $counter);
	fclose ($handle);
?>