<?php
function dirToArray($dir) {
	$result = array();
	$cdir = scandir($dir);
	foreach ($cdir as $key => $value) {
		if (!in_array($value, array(".", ".."))) {
			if (is_dir($dir . DIRECTORY_SEPARATOR . $value)) {
				$result[$value] = dirToArray($dir . DIRECTORY_SEPARATOR . $value);
			} else {
				if ($value == 'aOSpassword.txt') {
					$result[substr($value, 0, strrpos($value, '.'))] = '*****';
				} else {
					$result[substr($value, 0, strrpos($value, '.'))] = file_get_contents($dir . DIRECTORY_SEPARATOR . $value);
				}
			}
		}
	}

	return $result;
}

if (isset($_COOKIE['keyword'])) {
	if (is_dir('USERFILES/' . $_COOKIE['keyword'])) {
		if (file_exists('USERFILES/' . $_COOKIE['keyword'] . '/aOSpassword.txt')) {
			if (isset($_COOKIE['logintoken'])) {
				if ((require 'checkToken.php') === 0) {
					echo '{}';
				} else {
					$jsonResult = json_encode(dirToArray('USERFILES/' . $_COOKIE['keyword']));
					if ($jsonResult == "null") {
						echo '{}';
					} else {
						$jsonResult = str_replace("/script", "\\/script", $jsonResult);
						echo $jsonResult;
					}
				}
			} else {
				echo '{}';
			}
		} else {
			$jsonResult = json_encode(dirToArray('USERFILES/' . $_COOKIE['keyword']));
			if ($jsonResult == "null") {
				echo '{}';
			} else {
				$jsonResult = str_replace("/script", "\\/script", $jsonResult);
				echo $jsonResult;
			}
		}
	} else {
		echo '{}';
	}
} else {
	echo '{}';
}
