// skipcq JS-0128
const FileManager = () => {
	apps.files = new Application({
		name: "files",
		title: "File Manager",
		abbreviation: "FIL",
		image: "icons/folder_v1.png",
		hideApp: 0,
		launchTypes: 1,
		// TODO: Fix home page on boot
		main: function (launchType) {
			if (!this.appWindow.appIcon) {
				this.appWindow.paddingMode(0);
				this.appWindow.setDims("auto", "auto", 796, 400, 1);
			}
			this.appWindow.setCaption("File Manager");
			this.appWindow.openWindow();
			if (launchType === "dsktp") {
				this.vars.currLoc = "/";
				getId("win_files_html").style.background = "none";
				this.appWindow.setContent('<div id="fileManagerDisplay" class="full-iframe"></div>');
			}

			// Get the contents of accreditation.html and load into the window
			const xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function () {
				if (this.readyState === 4) {
					const elmnt = document.getElementById("fileManagerDisplay");
					if (this.status === 200) {
						elmnt.innerHTML = this.responseText;
					}
				}
			};
			xhttp.open("GET", "./apps/filemanager.html", true);
			xhttp.send();
		},
		vars: {
			appInfo:
				"Take a peek in here to see what pieces of work I finished and would like to share.",
			currLoc: "/",
			selectedDirectoryFiles: [],
			translateDir: function (origworkdir) {
				this.workdirorig = origworkdir;
				this.workdirtrans = this.workdirorig;

				this.workdirdepth = 0;
				this.workdirfinal = "window";
				if (this.workdirorig[0] !== "/") {
					this.workdirtrans = this.workdir + "/" + this.workdirtrans;
				}

				this.workdirtemp = this.workdirtrans.split("/");
				let cleanEscapeRun = 0;
				while (!cleanEscapeRun) {
					cleanEscapeRun = 1;
					for (let i = 0; i < this.workdirtemp.length - 1; i++) {
						if (this.workdirtemp[i][this.workdirtemp[i].length - 1] === "\\") {
							this.workdirtemp.splice(
								i,
								2,
								this.workdirtemp[i].substring(
									0,
									this.workdirtemp[i].length - 1
								) +
									"/" +
									this.workdirtemp[i + 1]
							);
							cleanEscapeRun = 0;
							break;
						}
					}

					if (cleanEscapeRun && this.workdirtemp.length > 0) {
						if (
							this.workdirtemp[this.workdirtemp.length - 1][
								this.workdirtemp[this.workdirtemp.length - 1].length - 1
							] === "\\"
						) {
							this.workdirtemp.splice(
								i,
								1,
								this.workdirtemp[this.workdirtemp.length - 1].substring(
									0,
									this.workdirtemp[this.workdirtemp.length - 1].length - 1
								) + "/"
							);
							cleanEscapeRun = 0;
						}
					}
				}
				while (this.workdirdepth < this.workdirtemp.length) {
					if (this.workdirtemp[this.workdirdepth] !== "") {
						if (this.workdirtemp[this.workdirdepth] === "..") {
							if (this.workdirfinal.length === 0) {
								this.workdirfinal = "/";
							} else if (
								this.workdirfinal[this.workdirfinal.length - 1] === "]"
							) {
								this.workdirfinal = this.workdirfinal.split("['");
								this.workdirfinal.pop();
								this.workdirfinal = this.workdirfinal.join(".");
							} else {
								this.workdirfinal = this.workdirfinal.split(".");
								this.workdirfinal.pop();
								this.workdirfinal = this.workdirfinal.join(".");
							}
							if (this.workdirfinal.length === 0) {
								this.workdirfinal = "/";
							}
						} else {
							if (
								isNaN(parseInt(this.workdirtemp[this.workdirdepth], 10)) &&
								this.workdirtemp[this.workdirdepth].indexOf("=") === -1 &&
								this.workdirtemp[this.workdirdepth].indexOf(" ") === -1 &&
								this.workdirtemp[this.workdirdepth].indexOf(";") === -1 &&
								this.workdirtemp[this.workdirdepth].indexOf(".") === -1 &&
								this.workdirtemp[this.workdirdepth].indexOf(",") === -1 &&
								this.workdirtemp[this.workdirdepth].indexOf("/") === -1
							) {
								try {
									// new Function(this.workdirtemp[this.workdirdepth], 'var ' + this.workdirtemp[this.workdirdepth])
									this.workdirfinal +=
										"." + this.workdirtemp[this.workdirdepth];
								} catch (err) {
									this.workdirfinal +=
										"['" + this.workdirtemp[this.workdirdepth] + "']";
								}
							} else {
								this.workdirfinal +=
									"['" + this.workdirtemp[this.workdirdepth] + "']";
							}
						}
					}
					this.workdirdepth++;
				}
				return this.workdirfinal;
			},
			getRealDir: function (origdir) {
				return eval(this.translateDir(origdir));
			},
			ls: function (dir) {
				// Remove leading and trailing slashes
				if (dir.charAt(0) === "/") dir = dir.substr(1);
				if (dir.charAt(dir.length - 1) === "/") {
					dir = dir.substr(0, dir.length - 1);
				}

				function loadFiles() {
					// https://stackoverflow.com/a/55270278/6456163
					const files = [];
					const xhr = new XMLHttpRequest();
					xhr.open("GET", "./" + dir, false);
					xhr.onload = () => {
						if (xhr.status !== 200) {
							return alert("Request failed. Returned status of " + xhr.status);
						}
						const parser = new DOMParser();
						const HTML = parser.parseFromString(xhr.response, "text/html");
						const elements = HTML.getElementsByTagName("a");
						for (const x of elements) {
							const filePath = x.href;
							if (!filePath.includes(".php") && !filePath.endsWith("/")) {
								const split = filePath.split(/(?<=\.com)/);
								files.push(split[0] + "/" + dir + split[1]);
							}
						}
					};

					xhr.send();
					return files;
				}
				this.selectedDirectoryFiles = loadFiles();
				return this.selectedDirectoryFiles;
			},
			back: function () {
				this.currLoc = this.currLoc.split("/");
				let cleanEscapeRun = 0;
				while (!cleanEscapeRun) {
					cleanEscapeRun = 1;
					for (let i = 0; i < this.currLoc.length - 1; i++) {
						if (this.currLoc[i][this.currLoc[i].length - 1] === "\\") {
							this.currLoc.splice(
								i,
								2,
								this.currLoc[i].substring(0, this.currLoc[i].length) +
									"/" +
									this.currLoc[i + 1]
							);
							cleanEscapeRun = 0;
							break;
						}
					}
					if (cleanEscapeRun && this.currLoc.length > 0) {
						if (
							this.currLoc[this.currLoc.length - 1][
								this.currLoc[this.currLoc.length - 1].length - 1
							] === "\\"
						) {
							this.currLoc.splice(
								i,
								1,
								this.currLoc[this.currLoc.length - 1].substring(
									0,
									this.currLoc[this.currLoc.length - 1].length
								) + "/"
							);
							cleanEscapeRun = 0;
						}
					}
				}
				this.currLoc.pop();
				this.currLoc.pop();
				this.currLoc = this.currLoc.join("/") + "/";
				this.update();
			},
			home: function () {
				this.currLoc = "/";
				this.update();
			},
			next: function (nextName) {
				let tempNextName = nextName;
				if (
					tempNextName.indexOf("/") !== -1 &&
					tempNextName.indexOf("/") !== tempNextName.length - 1
				) {
					tempNextName = tempNextName.split("/");
					if (tempNextName[tempNextName.length - 1] === "") {
						tempNextName.pop();
						tempNextName = tempNextName.join("\\/") + "/";
					} else {
						tempNextName = tempNextName.join("\\/");
					}
				}
				this.currLoc += tempNextName;
				this.update();
			},
			navigate: function (newName) {
				if (newName[0] !== "/") {
					newName = "/" + newName;
				}
				if (newName[newName.length - 1] !== "/") {
					newName = newName + "/";
				}
				this.currLoc = newName;
				this.update();
			},
			filetype: function (type) {
				switch (type) {
					case "object":
						return "folder";
					case "string":
						return "text";
					case "function":
						return "code";
					case "boolean":
						return "T/F";
					case "undefined":
						return "nothing";
					case "number":
						return "value";
					default:
						return type;
				}
			},
			icontype: function (type) {
				switch (type) {
					case "object":
						return "folder";
					case "string":
						return "file";
					case "function":
						return "console";
					case "boolean":
						return "gear";
					case "undefined":
						return "x";
					case "number":
						return "performance";
					default:
						return "agent";
				}
			},
			currTotal: 0,
			currItem: 0,
			currEffect: 0,
			currContentStr: "",
			currentDirectoryFiles: [],
			update: function () {
				this.currContentStr = "";
				getId("fileSearchInput").value = "";
				getId("FIL2green").style.backgroundColor = "rgb(170, 255, 170)";
				getId("FIL2green").style.width = "0";
				getId("fileManagerContent").classList.add("cursorLoadDark");
				getId("fileManagerContent").style.marginTop =
					getId("findScrollSize").offsetHeight -
					getId("findScrollSize").clientHeight;
				if (this.currLoc === "/") {
					getId("filePath").innerHTML =
						'<div id="FIL2green" style="height:100%;background-color:rgb(170, 255, 170)"></div><div style="width:100%;height:25px;"><input id="FIL2input" style="background:transparent;box-shadow:none;color:inherit;font-family:monospace;border:none;width:calc(100% - 8px);height:25px;padding:0;padding-left:8px;border-top-left-radius:5px;border-top-right-radius:5px;" onkeypress="if(event.keyCode===13){apps.files.vars.navigate(this.value)}" value="/"></div>';
					getId("fileManagerContent").innerHTML =
						'<span style="padding-left:3px;line-height:18px">Home</span><br>' +
						"<div class=\"cursorPointer\" onClick=\"apps.files.vars.next('art/')\" oncontextmenu=\"ctxMenu([[event.pageX, event.pageY, 'ctxMenu/file.png'], ' Properties', 'apps.properties.main(\\'openFile\\', \\'art/\\');toTop(apps.properties)'])\">" +
						'<img src="images/folder.png"> ' +
						"art/" +
						"</div>";
					getId("FIL2green").className = "";
					getId("FIL2green").style.backgroundColor = "#FFF";
					getId("FIL2green").style.display = "none";
					getId("fileManagerContent").style.backgroundImage = "";
					getId("fileManagerContent").classList.remove("cursorLoadDark");
				} else {
					tempNextName = tempNextName.join("\\/");
				}
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
