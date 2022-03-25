<div id="fileManagerTopbar">

</div>

<div id="fileManagerSidebar">
	<?php
		// Gets all the directories in the `art` directory, which serves as
		// the File Manager's root directory
		$directories = glob("../art/*", GLOB_ONLYDIR);

		// Loops through each directory
		foreach($directories as $directory) {
			// Gets the name of the directory
			$directoryName = basename($directory);
			echo '<div class="cursorPointer sidebarItem" oncontextmenu="apps.files.vars.openDirectoryContextMenu(event)">' .
				'<img class="sidebarIcon" src="icons/folder_v1.png">' .
				'<p class="fileManagerSidebarItem" onclick="apps.files.vars.openDirectory(\'' . $directoryName . '\')">' . $directoryName . '</p>' .
			'</div>';
		}
	?>
</div>

<div id="fileManagerContent">
	<?php
		// Gets all the content in the `art` directory
		$content = glob("../art/*");

		// IDEA: filesize with filesize($filename)

		// Loops through content
		foreach($content as $item) {
			$info = pathinfo($item);
			$basename = $info["basename"];
			$filename = $info["filename"];
			$isDirectory = is_dir($item);

			$HTML = '<div class="fileManagerContentItem cursorPointer" oncontextmenu="apps.files.vars.openFileContextMenu(event)"';
			if ($isDirectory) {
				$HTML .= ' onclick="apps.files.vars.openDirectory(\'' . $basename . '\')">';
				$HTML .= "<img class='folderIcon' src='icons/folder_v1.png'>";
				$HTML .= "<p class='fileManagerContentItem'>$filename</p>";
			} else {
				$HTML .= ' onclick="apps.files.vars.openFile(\'' . $basename . '\')">';
				$HTML .= "<img class='fileIcon' src='images/$item'>";
				$HTML .= "<p class='fileManagerContentItem'>$filename</p>";
			}

			$HTML .= "</div>";
			echo $HTML;

			// Gets the number of files in the directory
			//$numberOfFiles = count(glob("$directory/*"));

			// Gets the number of folders in the directory
			//$numberOfFolders = count(glob("$directory/*", GLOB_ONLYDIR));

			// Gets the number of files and folders in the directory
			//$numberOfFilesAndFolders = $numberOfFiles + $numberOfFolders;
		}
	?>
</div>
