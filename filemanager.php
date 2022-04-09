<?php
	##########################################################################
	# Defines functions and variables to be used throughout the application. #
	##########################################################################

	$directoryContextMenu = "apps.files.vars.openDirectoryContextMenu(event)";
	$fileContextMenu = "apps.files.vars.openFileContextMenu(event)";
	$root = ".filesystem";

	# Listens for POST requests to update the file manager content.
	if ( "POST" === $_SERVER["REQUEST_METHOD"] ) {
		$json = file_get_contents("php://input");
		$data = json_decode($json);

		$content = (object) [
			"fileManager" => getFileManagerContent($data->path),
			// IDEA: Tree-like hierarchy of directories here instead
			"sidebar" => getSidebarContent($data->path),
			// IDEA: Function to get absolute path of file/directory
			"path" => $data->path // TODO: Return an absolute path here
		];
		echo json_encode($content);
		return;
	}

	/**
	 * Returns the contents of the given path.
	 * @param path - the path to the directory.
	 * @param sidebar - if true, only directories are returned because the sidebar
	 *                  is not intended to display files.
	 * @return array - "Returns an array containing the matched files/directories, an empty array if no file matched."
	 */
	function getContentInDirectory($path, $sidebar = false) {
		global $root;
		$path = strpos($path, $root) !== false
			? $path
			: $root . "/" . $path;

		$content = glob("$path/*", $sidebar ? GLOB_ONLYDIR : 0);
		return $content;
	}

	/**
	 * Generates HTML of the content in the given path.
	 * @param path - the path to the directory.
	 * @return string - string containing the HTML of the content.
	 */
	function getFileManagerContent($path) {
		global $directoryContextMenu, $fileContextMenu, $root;

		# Gets all the content in the specified directory
		$content = getContentInDirectory($path);
		$HTML = "";

		if (!$content) {
			$altText = "Boo says hi :)";
			$HTML .= "<div class='empty-directory'>";
			$HTML .= "<img src='images/cute-ghost.png' alt='$altText' title='$altText' />";
			$HTML .= "<p>There is nothing here yet! Stay tuned <3</p>";
			$HTML .= "</div>";

			return $HTML;
		}

		foreach($content as $contentPath) {
			$info = pathinfo($contentPath);
			$basename = $info["basename"];
			$filename = $info["filename"];
			$isDirectory = is_dir($contentPath);

			$item = "<div class='fileManagerContentItem cursorPointer' oncontextmenu=";
			if ($isDirectory) {
				$item .= $directoryContextMenu;
				$item .= " onclick='apps.files.vars.openDirectory(\"$basename\")'>";
				$item .= "<img class='folderIcon' src='icons/folder_v1.png'>";
				$item .= "<p class='fileManagerContentItem'>$filename</p>";

				// TODO: This is where I need to update the top bar.
			} else {
				$item .= $fileContextMenu;
				$item .= " onclick='apps.files.vars.openFile(\"$basename\")'>";
				$item .= "<img class='fileIcon' src='$contentPath'>";
				$item .= "<p class='fileManagerContentItem'>$filename</p>";
			}

			$item .= "</div>";
			$HTML .= $item;

			// Gets the number of files in the directory
			//$numberOfFiles = count(glob("$directory/*"));

			// Gets the number of folders in the directory
			//$numberOfFolders = count(glob("$directory/*", GLOB_ONLYDIR));

			// Gets the number of files and folders in the directory
			//$numberOfFilesAndFolders = $numberOfFiles + $numberOfFolders;

			// IDEA: filesize with filesize($filename)
		}

		return $HTML;
	}

	function getSidebarContent($path) {
		global $directoryContextMenu, $root;
		$HTML = "";
		$content = getContentInDirectory($path, true);

		# Loops through each directory
		foreach($content as $directoryPath) {
			$directoryName = basename($directoryPath);
			$openDir = "apps.files.vars.openDirectory(\"$directoryPath\")";

			$HTML .= "<div class='cursorPointer sidebarItem' oncontextmenu='$directoryContextMenu'>" .
				"<img class='sidebarIcon' src='icons/folder_v1.png'>" .
				"<p class='fileManagerSidebarItem' onclick='$openDir'>$directoryName</p>" .
			'</div>';
		}

		return $HTML;
	}
?>

<div id="fileManagerTopbar">
	<?php
		$pathMessage = "Enter a path...";
		echo "<input type='text' id='fileManagerPath' placeholder='$pathMessage' title='$pathMessage' value='$root' ";
		echo "onkeyup='apps.files.vars.pathInput(event)'>";

		$searchMessage = "Search...";
		echo "<input type='search' id='fileManagerSearch' placeholder='$searchMessage' title='$searchMessage' ";
		echo "onkeydown='apps.files.vars.fileSearch(event)' />";
	?>
</div>

<div id="fileManagerSidebar">
	<?php echo getSidebarContent($root); ?>
</div>

<div id="fileManagerContent">
	<?php echo getFileManagerContent($root); ?>
</div>
