<?php

function deleteDir($dirPath) {
	if (!is_dir($dirPath)) {
		throw new InvalidArgumentException("$dirPath must be a directory");
	}
	if (substr($dirPath, strlen($dirPath) - 1, 1) != '/') {
		$dirPath .= '/';
	}
	$files = glob($dirPath . '*', GLOB_MARK);
	foreach ($files as $file) {
		if (is_dir($file)) {
			deleteDir($file);
		} else {
			unlink($file);
		}
	}
	rmdir($dirPath);
}

if (strpos($_SERVER['HTTP_REFERER'], $_SERVER['SERVER_NAME']) !== false || explode(':', $_SERVER['HTTP_HOST'])[0] === "localhost" || $_SERVER['SERVER_NAME'] === '0.0.0.0') {
	function error($errid, $errstr, $errfile, $errno) {
		echo "Error - ["+$errno+'] '+$errstr;
	}
	
	set_error_handler("error");
	if (strlen($_POST['k']) == 21 && $_COOKIE['keyword'] === $_POST['k']) {
			if (!is_dir('USERFILES/' . $_POST['k'])) {
				echo 'Error - user folder does not exist.';
				die();
			}
			if (file_exists('USERFILES/' . $_POST['k'] . '/aOSpassword.txt')) {
				if (isset($_COOKIE['logintoken'])) {
					if ((require 'checkToken.php') === 0) {
						echo 'Error - Not logged in.';
						die();
					}
				} else {
					echo 'Error - Not logged in.';
					die();
				}
			}

			if (strpos($_POST['f'], '..') != false) {
				echo 'Error - keyword ".." not allowed.';
				die();
			}
			if (realpath('USERFILES/' . $_POST['k']) == realpath('USERFILES/' . $_POST['k'] . '/' . $_POST['f'])) {
				echo 'Error - not allowed to delete root folder.';
				die();
			}

			$filepath = 'USERFILES/' . $_POST['k'] . '/' . $_POST['f'];
			if (is_dir($filepath)) {
				try {
					deleteDir($filepath);
				} catch (Exception $e) {
					echo 'Error - Could not delete directory: ' . $e;
					die();
				}
			} else {
				try {
					if (!unlink(realpath($filepath . '.txt'))) {
						echo 'Error - Coult not delete file.';
						die();
					}
				} catch (Exception $e) {
					echo 'Error - Could not delete file: ' . $e;
					die();
				}
			}
	} else {
		echo "Error - User ID malformed, or your user ID is incorrect.";
		die();
	}
} else {
	echo 'Error - Forbidden request from cross-origin domain.';
	die();
}

?>