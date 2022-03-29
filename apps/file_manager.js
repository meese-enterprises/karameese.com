// skipcq JS-0128
const FileManager = () => {
	apps.files = new Application({
		name: "files",
		title: "File Manager",
		abbreviation: "FIL",
		image: "icons/folder_v1.png",
		hideApp: 0,
		launchTypes: 1,
		main: function (launchType) {
			if (!this.appWindow.appIcon) {
				this.appWindow.paddingMode(0);
				this.appWindow.setDims("auto", "auto", 796, 400, true);
			}
			this.appWindow.setCaption("File Manager");
			this.appWindow.openWindow();
			if (launchType === "dsktp") {
				this.appWindow.setContent('<div id="fileManagerDisplay" class="full-iframe"></div>');
			}

			// Get the contents of filemanager.php and load into the window
			const xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function () {
				if (this.readyState === 4) {
					const element = document.getElementById("fileManagerDisplay");
					if (this.status === 200) {
						element.innerHTML = this.responseText;
					}
				}
			};
			xhttp.open("GET", "filemanager.php", true);
			xhttp.send();
		},
		vars: {
			appInfo:
				"Take a peek in here to see what pieces of work I finished and would like to share.",
			// TODO: Fix these context menus
			openDirectoryContextMenu: function (event) {
				ctxMenu([
					[event.pageX, event.pageY, "ctxMenu/file.png"],
					" Properties",
					"apps.properties.main(\'openDirectory\', \'art/\');toTop(apps.properties)",
				]);
			},
			openFileContextMenu: function (event) {
				ctxMenu([
					[event.pageX, event.pageY, "ctxMenu/file.png"],
					" Properties",
					"apps.properties.main(\'openFile\', \'art/\');toTop(apps.properties)",
				]);
			},
			openDirectory: function (path) {
				fetch("filemanager.php", {
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
					},
					body: JSON.stringify({ path }),
				})
				.then(response => response.text())
				.then(data => document.querySelector("#fileManagerContent").innerHTML = JSON.parse(data));
			},
			openFile: function (path) {
				// TODO: Remove `.filesystem`?
				const URL = `https://karameese.com/.filesystem/${path}`;
				apps.jsPaint.main(URL);
			},
		},
		signalHandler: function (signal) {
			switch (signal) {
				case "forceclose":
					this.appWindow.closeWindow();
					this.appWindow.closeIcon();
					break;
				case "close":
					this.appWindow.closeWindow();
					setTimeout(
						function () {
							if (getId("win_" + this.name + "_top").style.opacity === "0") {
								this.appWindow.setContent("");
							}
						}.bind(this),
						300
					);
					break;
				case "checkrunning":
					return Boolean(this.appWindow.appIcon);
				case "shrink":
					this.appWindow.closeKeepTask();
					break;
				case "USERFILES_DONE":
					break;
				default:
					doLog(
						`No case found for '${signal}' signal in app '${this.abbreviation}'`,
						"#F00"
					);
			}
		},
	});
}; // End initial variable declaration
