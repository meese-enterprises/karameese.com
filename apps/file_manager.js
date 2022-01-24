/* global apps, getId, ufsave */

// skipcq JS-0128
const FileManager = () => {

apps.files = new Application({
	title: "File Manager",
	abbreviation: "FIL",
	codeName: "files",
	image: "smarticons/files/fg.png",
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
		if (launchType === 'dsktp') {
			this.vars.currLoc = '/';
			getId('win_files_html').style.background = "none";
			this.appWindow.setContent(
				'<div id="FIL2topdiv" class="noselect" style="width:calc(100% - 96px); min-width:calc(70% + 48px); right:0; height:50px;">' +
				'<div title="Back" class="cursorPointer darkResponsive" style="width:34px; height:18px; padding-top:2px; left:5px; top:4px; border-top-left-radius:10px; border-bottom-left-radius:10px; text-align:center;" onClick="apps.files.vars.back()">&lArr; &nbsp;</div>' +
				'<div title="Home" class="cursorPointer darkResponsive" style="width:24px; border-left:1px solid #333; height:18px; padding-top:2px; left:30px; top:4px; border-top-left-radius:10px; border-bottom-left-radius:10px; text-align:center;" onClick="apps.files.vars.home()">H</div>' +
				'<div title="View Mode" class="cursorPointer darkResponsive" style="width:24px; border-right:1px solid #333; height:18px; padding-top:2px; right:31px; top:4px; border-top-right-radius:10px; border-bottom-right-radius:10px; text-align:center;" onClick="apps.files.vars.setViewMode()">&#8801;</div>' +
				'<div id="FIL2path" class="darkResponsive" style="left:55px; font-family:monospace; height:25px; line-height:25px; vertical-align:middle; width:calc(100% - 110px); border-top-left-radius:5px; border-top-right-radius:5px;"><div id="FIL2green" style="width:0;height:100%;"></div><div style="width:100%;height:25px;"><input id="FIL2input" style="background:transparent;box-shadow:none;color:inherit;font-family:monospace;border:none;width:calc(100% - 8px);height:25px;padding:0;padding-left:8px;border-top-left-radius:5px;border-top-right-radius:5px;" onkeypress="if(event.keyCode===13){apps.files.vars.navigate(this.value)}" value="/"></div></div>' +
				'<div id="FIL2viewModeIcon" style="pointer-events:none; color:#7F7F7F; text-align:right; left:55px; font-family:monospace; height:25px; line-height:25px; vertical-align:middle; width:calc(100% - 110px);"></div>' +
				'<div id="FIL2search" class="darkResponsive" style="left:55px; top:26px; font-family:monospace; height:22px; line-height:22px; vertical-align:middle; width:calc(100% - 110px);"><input id="FIL2searchInput" placeholder="Search" style="background:transparent;box-shadow:none;color:inherit;font-family:monospace;border:none;width:calc(100% - 8px);height:20px;padding:0;padding-left:8px;" onkeyup="apps.files.vars.updateSearch(this.value)"></div>' +
				'<div class="cursorPointer darkResponsive" style="width:34px; height:18px; padding-top:2px; left:5px; top:27px; border-top-left-radius:10px; border-bottom-left-radius:10px; text-align:center; display:none" onClick=""></div>' +
				'</div>' +
				'<div id="FIL2sidebar" class="darkResponsive" style="overflow-y:scroll; border-top-left-radius:5px; font-family:W95FA, Courier, monospace; font-size:12px; width:144px; max-width:30%; padding:3px; height:calc(100% - 56px); top:50px;">' +
				'Home<br><div id="FIL2home" class="FIL2sidetbl FIL2viewMedium"></div><br>' +
				'Navigation<br><div id="FIL2nav" class="FIL2sidetbl FIL2viewMedium"></div></div>' +
				'<div class="darkResponsive" style="width:calc(100% - 151px); border-top-right-radius:5px; min-width:calc(70% - 7px); right:0; height:calc(100% - 50px); top:50px; background-repeat:no-repeat; background-position:center" id="FIL2cntn"></div>'
			);
			getId("FIL2home").innerHTML =
				'<div class="cursorPointer" onClick="apps.files.vars.currLoc = \'/\';apps.files.vars.next(\'art/\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/file.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'art/\\\');toTop(apps.properties)\'])">' +
				'<img src="files/small/folder.png"> ' +
				'art/' +
				'</div>';
			this.vars.setViewMode(this.vars.currViewMode, 1);
		}
	},
	vars: {
		appInfo: 'Take a peek in here to see what pieces of work I finished and would like to share.',
		currLoc: '/',
		selectedDirectoryFiles: [],
		translateDir: function (origworkdir) {
			this.workdirorig = origworkdir;
			this.workdirtrans = this.workdirorig;

			this.workdirdepth = 0;
			this.workdirfinal = 'window';
			if (this.workdirorig[0] !== '/') {
				this.workdirtrans = this.workdir + '/' + this.workdirtrans;
			}

			this.workdirtemp = this.workdirtrans.split('/');
			var cleanEscapeRun = 0;
			while (!cleanEscapeRun) {
				cleanEscapeRun = 1;
				for (let i = 0; i < this.workdirtemp.length - 1; i++) {
					if (this.workdirtemp[i][this.workdirtemp[i].length - 1] === '\\') {
						this.workdirtemp.splice(i, 2, this.workdirtemp[i].substring(0, this.workdirtemp[i].length - 1) + '/' + this.workdirtemp[i + 1]);
						cleanEscapeRun = 0;
						break;
					}
				}

				if (cleanEscapeRun && this.workdirtemp.length > 0) {
					if (this.workdirtemp[this.workdirtemp.length - 1][this.workdirtemp[this.workdirtemp.length - 1].length - 1] === '\\') {
						this.workdirtemp.splice(i, 1, this.workdirtemp[this.workdirtemp.length - 1].substring(0, this.workdirtemp[this.workdirtemp.length - 1].length - 1) + '/');
						cleanEscapeRun = 0;
					}
				}
			}
			while (this.workdirdepth < this.workdirtemp.length) {
				if (this.workdirtemp[this.workdirdepth] !== '') {
					if (this.workdirtemp[this.workdirdepth] === '..') {
						if (this.workdirfinal.length === 0) {
							this.workdirfinal = "/";
						} else if (this.workdirfinal[this.workdirfinal.length - 1] === "]") {
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
							this.workdirtemp[this.workdirdepth].indexOf('=') === -1 &&
							this.workdirtemp[this.workdirdepth].indexOf(' ') === -1 &&
							this.workdirtemp[this.workdirdepth].indexOf(';') === -1 &&
							this.workdirtemp[this.workdirdepth].indexOf('.') === -1 &&
							this.workdirtemp[this.workdirdepth].indexOf(',') === -1 &&
							this.workdirtemp[this.workdirdepth].indexOf('/') === -1
						) {
							try {
								//new Function(this.workdirtemp[this.workdirdepth], 'var ' + this.workdirtemp[this.workdirdepth])
								this.workdirfinal += "." + this.workdirtemp[this.workdirdepth];
							} catch (err) {
								this.workdirfinal += "['" + this.workdirtemp[this.workdirdepth] + "']";
							}
						} else {
							this.workdirfinal += "['" + this.workdirtemp[this.workdirdepth] + "']";
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
			if (dir.charAt(dir.length - 1) === "/") dir = dir.substr(0, dir.length - 1);

			function loadFiles() {
				// https://stackoverflow.com/a/55270278/6456163
				let files = [];
				let xhr = new XMLHttpRequest();
				xhr.open("GET", './' + dir, false);
				xhr.onload = () => {
					if (xhr.status !== 200) return alert('Request failed. Returned status of ' + xhr.status);
					let parser = new DOMParser();
					let HTML = parser.parseFromString(xhr.response, 'text/html');
					let elements = HTML.getElementsByTagName("a");
					for (let x of elements) {
						let filePath = x.href;
						if (!filePath.includes('.php') && !filePath.endsWith('/')) {
							let split = filePath.split(/(?<=\.com)/);
							files.push(split[0] + '/' + dir + split[1]);
						}
					};
				}

				xhr.send();
				return files;
			}
			this.selectedDirectoryFiles = loadFiles();
			return this.selectedDirectoryFiles;
		},
		viewModes: [
			['Small Grid', 'FIL2viewCompact'],
			['Large Grid', 'FIL2viewSmall'],
			['Small List', 'FIL2viewMedium'],
			['Large List', 'FIL2viewLarge']
		],
		currViewMode: 3,
		setViewMode: function(newMode) {
			try {
				getId('FIL2tbl').classList.remove(this.viewModes[this.currViewMode][1]);
			} catch (err) {
				// Window is not open
			}

			if (typeof newMode === "number") {
				if (newMode < this.viewModes.length) {
					this.currViewMode = newMode;
				}
			} else {
				this.currViewMode++;
				if (this.currViewMode >= this.viewModes.length) {
					this.currViewMode = 0;
				}
			}

			try {
				getId('FIL2viewModeIcon').innerHTML = this.viewModes[this.currViewMode][0] + "&nbsp;";
				getId('FIL2tbl').classList.add(this.viewModes[this.currViewMode][1]);
			} catch (err) {
				// Window is not open
			}

			apps.savemaster.vars.save("system/apps/files/view_mode", this.currViewMode, 1);
		},
		back: function() {
			this.currLoc = this.currLoc.split("/");
			var cleanEscapeRun = 0;
			while (!cleanEscapeRun) {
				cleanEscapeRun = 1;
				for (let i = 0; i < this.currLoc.length - 1; i++) {
					if (this.currLoc[i][this.currLoc[i].length - 1] === '\\') {
						this.currLoc.splice(i, 2, this.currLoc[i].substring(0, this.currLoc[i].length) + '/' + this.currLoc[i + 1]);
						cleanEscapeRun = 0;
						break;
					}
				}
				if (cleanEscapeRun && this.currLoc.length > 0) {
					if (this.currLoc[this.currLoc.length - 1][this.currLoc[this.currLoc.length - 1].length - 1] === '\\') {
						this.currLoc.splice(i, 1, this.currLoc[this.currLoc.length - 1].substring(0, this.currLoc[this.currLoc.length - 1].length) + '/');
						cleanEscapeRun = 0;
					}
				}
			}
			this.currLoc.pop();
			this.currLoc.pop();
			this.currLoc = this.currLoc.join("/") + '/';
			this.update();
		},
		home: function() {
			this.currLoc = '/';
			this.update();
		},
		next: function (nextName) {
			var tempNextName = nextName;
			if (tempNextName.indexOf('/') !== -1 && tempNextName.indexOf('/') !== tempNextName.length - 1) {
				tempNextName = tempNextName.split('/');
				if (tempNextName[tempNextName.length - 1] === '') {
					tempNextName.pop();
					tempNextName = tempNextName.join('\\/') + '/';
				} else {
					tempNextName = tempNextName.join('\\/');
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
				case 'object':
					return 'folder';
				case 'string':
					return 'text';
				case 'function':
					return 'code';
				case 'boolean':
					return 'T/F';
				case 'undefined':
					return 'nothing';
				case 'number':
					return 'value';
				default:
					return type;
			}
		},
		icontype: function (type) {
			switch (type) {
				case 'object':
					return 'folder';
				case 'string':
					return 'file';
				case 'function':
					return 'console';
				case 'boolean':
					return 'gear';
				case 'undefined':
					return 'x';
				case 'number':
					return 'performance';
				default:
					return 'agent';
			}
		},
		currTotal: 0,
		currItem: 0,
		currEffect: 0,
		currContentStr: '',
		currentDirectoryFiles: [],
		update: function() {
			this.currContentStr = '';
			getId('FIL2searchInput').value = '';
			getId("FIL2green").style.backgroundColor = 'rgb(170, 255, 170)';
			getId("FIL2green").style.width = "0";
			getId('FIL2cntn').classList.add('cursorLoadDark');
			getId("FIL2cntn").innerHTML = '<div id="FIL2tbl" class="' + this.viewModes[this.currViewMode][1] + '" style="width:100%; position:absolute; margin:auto;padding-bottom:3px;"></div>';
			getId("FIL2tbl").style.marginTop = getId("findScrollSize").offsetHeight - getId("findScrollSize").clientHeight;
			if (this.currLoc === '/') {
				getId("FIL2path").innerHTML = '<div id="FIL2green" style="height:100%;background-color:rgb(170, 255, 170)"></div><div style="width:100%;height:25px;"><input id="FIL2input" style="background:transparent;box-shadow:none;color:inherit;font-family:monospace;border:none;width:calc(100% - 8px);height:25px;padding:0;padding-left:8px;border-top-left-radius:5px;border-top-right-radius:5px;" onkeypress="if(event.keyCode===13){apps.files.vars.navigate(this.value)}" value="/"></div>';
				getId("FIL2tbl").innerHTML =
					'<span style="padding-left:3px;line-height:18px">Home</span><br>' +
					'<div class="cursorPointer" onClick="apps.files.vars.next(\'art/\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/file.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'art/\\\');toTop(apps.properties)\'])">' +
					'<img src="files/small/folder.png"> ' +
					'art/' +
					'</div>';
				getId("FIL2green").className = '';
				getId('FIL2green').style.backgroundColor = "#FFF";
				getId("FIL2green").style.display = "none";
				getId("FIL2cntn").style.backgroundImage = "";
				getId('FIL2cntn').classList.remove('cursorLoadDark');
			} else {
				getId("FIL2path").innerHTML = '<div id="FIL2green" class="liveElement" data-live-target="style.width" data-live-eval="apps.files.vars.currItem/apps.files.vars.currTotal*100+\'%\'" style="height:100%;background-color:rgb(170, 255, 170);box-shadow:0 0 20px 10px rgb(170, 255, 170)"></div><div style="width:100%;height:25px;"><input id="FIL2input" style="background:transparent;box-shadow:none;color:inherit;font-family:monospace;border:none;width:calc(100% - 8px);height:25px;padding:0;padding-left:8px;border-top-left-radius:5px;border-top-right-radius:5px;" onkeypress="if(event.keyCode===13){apps.files.vars.navigate(this.value)}" value="' + this.currLoc + '"></div>';
				this.currentDirectoryFiles = this.ls('' + this.currLoc);
				this.currentDirectoryFiles.sort(function (a, b) {
					var aLow = a.toLowerCase();
					var bLow = b.toLowerCase();
					if (aLow === bLow) return 0;
					if (aLow > bLow) return 1;
					return -1;
				});
				var temphtml = '';
				for (let item in this.currentDirectoryFiles) {
					if (this.currentDirectoryFiles[item]) {
						// if item is a folder
						if (this.currentDirectoryFiles[item][this.currentDirectoryFiles[item].length - 1] === "/" && this.currentDirectoryFiles[item][this.currentDirectoryFiles[item].length - 2] !== "\\") {
							temphtml += '<div class="cursorPointer" onclick="apps.files.vars.next(\'' + this.currentDirectoryFiles[item] + '\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/file.png\', \'ctxMenu/x.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'' + (this.currLoc + this.currentDirectoryFiles[item]) + '\\\');toTop(apps.properties)\'])">' +
								'<img src="files/small/folder.png"> ' +
								this.currentDirectoryFiles[item].split('\\/').join('/') +
								'</div>';
						} else {
							// TODO: Style this
							// TODO: Minimize images, show smaller thumbnail images (Gatsby?) for speed initially
							temphtml += '<div class="cursorPointer" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/file.png\', \'ctxMenu/x.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'' + (this.currLoc + this.currentDirectoryFiles[item]).split('\\').join('\\\\') + '\\\');toTop(apps.properties)\'])">' +
								'<img src="' + this.currentDirectoryFiles[item] + '"> ' +
								this.currentDirectoryFiles[item].split('\\/').join('/') + '<span style="opacity:0.5;float:right;">' + this.currentDirectoryFiles[item] + '&nbsp;</span>' +
								'</div>';
						}
					}
				}
				getId('FIL2tbl').innerHTML = temphtml;
				getId("FIL2green").className = '';
				getId('FIL2green').style.backgroundColor = "#FFF";
				getId("FIL2green").style.display = "none";
				getId("FIL2cntn").style.backgroundImage = "";
				getId('FIL2cntn').classList.remove('cursorLoadDark');
			}
			var pathSplit = this.currLoc.split('/');
			if (pathSplit[0] === "") {
				pathSplit.shift();
			}
			if (pathSplit[pathSplit.length - 1] === "") {
				pathSplit.pop();
			}

			// TODO: Delete all of this
			var cleanEscapeRun = 0;
			while (!cleanEscapeRun) {
				cleanEscapeRun = 1;
				for (var j = 0; j < pathSplit.length - 1; j++) {
					if (pathSplit[j][pathSplit[j].length - 1] === '\\') {
						pathSplit.splice(j, 2, pathSplit[j].substring(0, pathSplit[j].length) + '/' + pathSplit[j + 1]);
						cleanEscapeRun = 0;
						break;
					}
				}
				if (cleanEscapeRun && pathSplit.length > 0) {
					if (pathSplit[pathSplit.length - 1][pathSplit[pathSplit.length - 1].length - 1] === '\\') {
						pathSplit.splice(j, 1, pathSplit[pathSplit.length - 1].substring(0, pathSplit[pathSplit.length - 1].length) + '/');
						cleanEscapeRun = 0;
					}
				}
			}
			var navDepth = 0;
			var navPath = "/";
			var tempHTML = '<div class="cursorPointer" onclick="apps.files.vars.currLoc = \'/\';apps.files.vars.update()" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/file.png\', \'ctxMenu/x.png\'], \'-Properties\', \'\', \'_Delete\', \'\'])">' +
				'<img src="files/small/folder.png"> ' +
				'/' +
				'</div>';
			for (let i in pathSplit) {
				// skipcq JS-D009
				if (pathSplit.indexOf("apps") === 0 && navDepth === 1) {
					tempHTML += '<div class="cursorPointer" onclick="apps.files.vars.currLoc = \'' + navPath + '\';apps.files.vars.next(\'' + pathSplit[i] + '/\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/file.png\', \'ctxMenu/x.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'' + (navPath + pathSplit[i]) + '/\\\');toTop(apps.properties)\', \'_Delete\', \'\'])">' +
						buildSmartIcon(16, (apps[pathSplit[i]] || {
							appWindow: {
								appImg: {
									foreground: "appicons/redx.png"
								}
							}
						}).appWindow.appImg) + ' ' +
						pathSplit[i].split('\\/').join('/') + "/" +
						'</div>';
				} else {
					tempHTML += '<div class="cursorPointer" onclick="apps.files.vars.currLoc = \'' + navPath + '\';apps.files.vars.next(\'' + pathSplit[i] + '/\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/file.png\', \'ctxMenu/x.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'' + (navPath + pathSplit[i]) + '/\\\');toTop(apps.properties)\', \'_Delete\', \'\'])">' +
						'<img src="files/small/folder.png"> ' +
						pathSplit[i].split('\\/').join('/') + '/' +
						'</div>';
				}
				navPath += pathSplit[i] + '/';
				navDepth++;
			}
			getId("FIL2nav").innerHTML = tempHTML;
		},
		updateSearch: function (searchStr) {
			var searchElems = getId('FIL2tbl').getElementsByClassName('cursorPointer');
			for (let i = 0; i < searchElems.length; i++) {
				if (searchElems[i].innerText.toLowerCase().indexOf(searchStr.toLowerCase()) === -1) {
					searchElems[i].style.display = 'none';
				} else {
					searchElems[i].style.display = '';
				}
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
				setTimeout(function() {
					if (getId("win_" + this.objName + "_top").style.opacity === "0") {
						this.appWindow.setContent("");
					}
				}.bind(this), 300);
				break;
			case "checkrunning":
				return this.appWindow.appIcon ? true : false;
			case "shrink":
				this.appWindow.closeKeepTask();
				break;
			case "USERFILES_DONE":
				if (ufload("system/apps/files/view_mode")) {
					this.vars.setViewMode(parseInt(ufload("system/apps/files/view_mode")), 1);
				}
				break;
			default:
				doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'", "#F00");
		}
	}
});

} // End initial variable declaration