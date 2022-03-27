<?php ob_start(); ?>
<!DOCTYPE html>
<html>

<head>
	<title>Kara Meese</title>

	<?php
		# To prevent the browser from caching the page
		echo '<link rel="stylesheet" type="text/css" href="style.css?ms='.round(microtime(true) * 1000).'">';

		# Site metadata
		$author = "Meese Enterprises, LLC";
		$description = "An artistic portfolio website.";
		$title = "Kara Meese";
		$previewImage = "";
		$favicon = "logo.png";
		$themeColor = "#fa87f4";

		echo "<meta charset='UTF-8'>";
		echo "<meta property='description' content='$description' />";
		echo "<link rel='shortcut icon' href='$favicon' />";
		echo "<meta property='theme-color' content='$themeColor' />";
		echo "<meta property='image' content='$favicon' />";
		echo "<meta itemProp='name' content='$title' />";
		echo "<meta itemProp='description' content='$description' />";
		echo "<meta itemProp='image' content='$favicon' />";
		echo "<meta property='og:title' content='$title' />";
		echo "<meta property='og:description' content='$description' />";
		echo "<meta property='og:image' content='$previewImage' />";
		echo "<meta property='og:site_name' content='$title' />";
		echo "<meta property='og:locale' content='en_US' />";
		echo "<meta property='og:type' content='website' />";
		echo "<meta property='twitter:card' content='summary' />";
		echo "<meta property='twitter:title' content='$title' />";
		echo "<meta property='twitter:description' content='$description' />";
		echo "<meta property='twitter:image' content='$previewImage' />";
		echo "<meta property='twitter:image:src' content='$previewImage' />";
		echo "<meta name='twitter:image:alt' content='$title Icon' />";
	?>

	<link rel="icon" href="logo.png" type="image/x-icon">
	<style id="appIconStyle"></style>
	<link rel="stylesheet" type="text/css" href="win95.css">
</head>

<body id="pagebody">
	<!-- helps JS find scrollbar stuff -->
	<div id="findScrollSize"></div>

	<!-- computer screen and content inside on startup -->
	<div id="monitor" class="cursorDefault">
		<div id="desktop" onclick="try{exitFlowMode()}catch(err){}" oncontextmenu="showEditContext(event)">
			<div id="widgetMenu" class="darkResponsive noselect">
				<div id="widgetTitle"></div>
				<div id="widgetContent" class="canselect"></div>
				<div class="winExit cursorPointer" onClick="closeWidgetMenu()">x</div>
			</div>
			<div id="notifContainer">
				<div id="notifications"></div>
			</div>
		</div>

		<div id="winmove" class="cursorOpenHand" onmouseup="winmove(event)" onmousemove="winmoving(event)"></div>
		<div id="icomove" class="cursorOpenHand" onclick="icomove(event)" onmousemove="icomoving(event)"></div>
		<div id="icnmove" class="cursorOpenHand" onclick="icnmove(event)" onmousemove="icnmoving(event)"></div>
		<div id="winres" class="cursorOpenHand" onmouseup="winres(event)" onmousemove="winresing(event)"></div>
		<div id="windowFrameOverlay"></div>
		<div id="taskbar" class="noselect">
			<div id="tskbrAero" class="winAero"></div>
			<div id="tskbrBimg" class="winBimg"></div>
			<div id="time"></div>
			<div id="taskbarIcons"></div>
		</div>
		<div id="ctxMenu" onclick="getId('ctxMenu').style.display='none'" class="backdropFilterCtxMenu noselect"></div>
		<div id="loadingBg"></div>
		<div id="isLoading" class="cursorLoadDark">
			<div id="isLoadingDiv">
				<h1>KaraOS</h1>
				<hr>
				<div id="loadingInfoDiv">
					<div id="loadingInfo" class="liveElement"
						data-live-eval="(finishedWaitingCodes / codeToRun.length) * 100 + '%'" data-live-target="style.width">
						Initializing...
					</div>
				</div>
			</div>
		</div>
	</div>
	<?php include "updateViewCounter.php"; ?>
</body>

<?php
	// Guarantees the availability of the document.

	// Classes
	echo '<script src="./classes/Application.js"></script>';
	echo '<script src="./classes/DesktopIcon.js"></script>';
	echo '<script src="./classes/Widget.js"></script>';

	// Supporting scripts
	echo '<script src="./ghostCursor.js"></script>';
	echo '<script src="./helperFunctions.js"></script>';
	echo '<script src="./dateFunctions.js"></script>';
	echo '<script src="./iconFunctions.js"></script>';
	echo '<script src="./widgetFunctions.js"></script>';

	// Widgets
	echo '<script src="./widgets/flow.js"></script>';
	echo '<script src="./widgets/notifications.js"></script>';
	echo '<script src="./widgets/time.js"></script>';

	// Apps and main application
	echo '<script src="./apps/accreditation.js"></script>';
	echo '<script src="./apps/app_info.js"></script>';
	echo '<script src="./apps/app_prompt.js"></script>';
	echo '<script src="./apps/dashboard.js"></script>';
	echo '<script src="./apps/file_manager.js"></script>';
	echo '<script src="./apps/help.js"></script>';
	echo '<script src="./apps/js_paint.js"></script>';
	echo '<script src="./apps/messaging.js"></script>';
	echo '<script src="./apps/music_player.js"></script>';
	echo '<script src="./apps/nora.js"></script>';
	echo '<script src="./apps/old_site.js"></script>';
	echo '<script src="./apps/properties_viewer.js"></script>';
	echo '<script src="./apps/save_master.js"></script>';
	echo '<script src="./apps/view_count.js"></script>';
	echo '<script src="main.js?ms='.round(microtime(true) * 1000).'"></script>';

	echo '<script defer>';
	require 'filepreloaderBeta.php';
	echo '</script>';
?>

</html>
<?php ob_end_flush(); ?>
