<?php
	##########################################################################
	# Defines functions and variables to be used throughout the application. #
	##########################################################################

	$directoryContextMenu = "apps.files.vars.openDirectoryContextMenu(event)";
	$fileContextMenu = "apps.files.vars.openFileContextMenu(event)";
	$root = ".filesystem";

	# Listens for POST requests
	if ( "POST" === $_SERVER["REQUEST_METHOD"] ) {
		$json = file_get_contents("php://input");
		$data = json_decode($json);

		if ($data->purpose === "updateContent") {
			# Update the file manager content, the sidebar content, and the path
			$content = (object) [
				"fileManager" => getFileManagerContent($data->path),
				// TODO: Tree-like hierarchy of directories here instead
				"sidebar" => getSidebarContent($data->path),
				// TODO: Return an absolute path here
				"path" => $data->path
			];

			echo json_encode($content);
		} else if ($data->purpose === "search") {
			# Search for files and directories matching the given query
			$search = $data->search;
			if ($search === "") {
				# Display the root directory if the search query is empty
				$result = getFileManagerContent($root);
				$content = (object) [ "searchResults" => $result ];
				echo json_encode($content);
				return;
			}

			# https://stackoverflow.com/a/12236744/6456163
			$dir   = new RecursiveDirectoryIterator($root);
			$files = new RecursiveIteratorIterator($dir);

			$matchingFiles = [];
			foreach ($files as $file) {
				# Ignores ".." directories
				if (preg_match("/\.\.$/", $file)) continue;

				# Uses non-capturing groups to match the file name efficiently
				if (preg_match("/(?:^.*" . $search . ".*$)/", $file)) {
					$fileName = $file->getFilename();
					if ($fileName === ".") {
						# Remove the "." from the path to give the real folder name
						$absolutePath = substr($file->getPathname(), 0, -2);
						$pathSections = explode("/", $absolutePath);
						$fileName = end($pathSections);
					}

					$fileObj = (object) [
						"type" => $file->getType(),
						"name" => $fileName,
						"path" => $file->getPathname(),
						"size" => $file->getSize()
					];

					array_push($matchingFiles, $fileObj);
				}
			}

			$result = "";
			if (count($matchingFiles) === 0) {
				$result = getEmptyFileManagerContent();
			} else {
				foreach ($matchingFiles as $file) {
					if ($file->type === "dir") {
						$result .= createFolderElement($file->name, $file->path);
					} else {
						$result .= createFileElement($file->name, $file->path);
					}
				}
			}

			# TODO: After everything works, do the HTML generation on the client side
			# to reduce data sent across the wire
			$content = (object) [ "searchResults" => $result ];
			echo json_encode($content);
		}

		return;
	}

	/**
	 * Gets content for the file manager when it is empty.
	 */
	function getEmptyFileManagerContent() {
		$altText = "Boo says hi :)";
		$HTML    = "<div class='empty-directory'>";
		$HTML   .= "<img src='images/cute-ghost.png' alt='$altText' title='$altText' />";
		$HTML   .= "<p>There is nothing here yet! Stay tuned <3</p>";
		$HTML   .= "</div>";
		return $HTML;
	}

	/**
	 * Creates a folder HTML string for the file explorer based on the given parameters.
	 * @param name - the name of the folder.
	 * @param path - the path to the folder.
	 * @todo - set the title of the folder element to the absolute path for search result context
	 */
	function createFolderElement($name, $path) {
		global $directoryContextMenu;

		$HTML  = "<div class='fileManagerContentItem cursorPointer' oncontextmenu=";
		$HTML .= $directoryContextMenu;
		$HTML .= " onclick='apps.files.vars.openDirectory(\"$path\")'>";
		$HTML .= "<img class='folderIcon' src='icons/folder_v1.png'>";
		$HTML .= "<p class='fileManagerContentItem'>$name</p>";
		$HTML .= "</div>";
		return $HTML;
	}

	/**
	 * Creates a file HTML string for the file explorer based on the given parameters.
	 * @param name - the name of the file.
	 * @param filePath - the path to the file.
	 * @param iconPath - the path to the icon to use for the file; defaults to the file path if not specified.
	 * @todo - set the title of the file element to the absolute path for search result context
	 */
	function createFileElement($name, $filePath, $iconPath = null) {
		global $fileContextMenu;
		if (!isset($iconPath)) $iconPath = $filePath;

		$HTML  = "<div class='fileManagerContentItem cursorPointer' oncontextmenu=";
		$HTML .= $fileContextMenu;
		$HTML .= " onclick='apps.files.vars.openFile(\"$filePath\")'>";
		$HTML .= "<img class='fileIcon' src='$iconPath'>";
		$HTML .= "<p class='fileManagerContentItem'>$name</p>";
		$HTML .= "</div>";
		return $HTML;
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
		if (!$content) return getEmptyFileManagerContent();
		$HTML = "";

		foreach($content as $contentPath) {
			$info = pathinfo($contentPath);
			$basename = $info["basename"];
			$filename = $info["filename"];
			$isDirectory = is_dir($contentPath);

			if ($isDirectory) {
				$HTML .= createFolderElement($filename, $contentPath);
			} else {
				$HTML .= createFileElement($filename, $basename, $contentPath);
			}

			// Gets the number of files in the directory
			//$numberOfFiles = count(glob("$directory/*"));

			// Gets the number of folders in the directory
			//$numberOfFolders = count(glob("$directory/*", GLOB_ONLYDIR));

			// Gets the number of files and folders in the directory
			//$numberOfFilesAndFolders = $numberOfFiles + $numberOfFolders;

			// IDEA: filesize with filesize($filename)
				// Could pass this to the context menu
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

			// TODO: Do this as a nested list underneath the root level directory
			$HTML .= "<div class='cursorPointer sidebarItem' oncontextmenu='$directoryContextMenu' onclick='$openDir'>" .
				"<img class='sidebarIcon' src='icons/folder_v1.png'>" .
				"<p class='fileManagerSidebarItem'>$directoryName</p>" .
			"</div>";
		}

		return $HTML;
	}
?>

<div id="fileManagerTopbar">
	<img src="./icons/back_arrow.svg" id="backArrow" onclick="apps.files.vars.goBack()" />

	<?php
		$pathMessage = "Enter a path...";
		echo "<input type='text' id='fileManagerPath' placeholder='$pathMessage' title='$pathMessage' value='$root' ";
		echo "onkeyup='apps.files.vars.pathInput(event)'>";

		$searchMessage = "Search...";
		echo "<input type='search' id='fileManagerSearch' placeholder='$searchMessage' title='$searchMessage' ";
		echo "onkeyup='apps.files.vars.fileSearch(event)' />";
	?>
</div>

<div id="fileManagerSidebar">
	<?php echo getSidebarContent($root); ?>
</div>

<div id="fileManagerContent">
	<?php echo getFileManagerContent($root); ?>
</div>
