// skipcq JS-0128
const Dashboard = () => {
	apps.startMenu = new Application({
		name: "startMenu",
		title: "Dashboard",
		abbreviation: "DsB",
		image: "logo.png",
		hideApp: 1,
		launchTypes: 1,
		main: function (launchType) {
			if (launchType === "srtup") {
				this.appWindow.paddingMode(0);
				getId("win_startMenu_shrink").style.display = "none";
				getId("win_startMenu_big").style.display = "none";
				getId("win_startMenu_exit").style.display = "none";
				getId("win_startMenu_fold").style.display = "none";
				getId("win_startMenu_top").style.display = "none";
				getId("win_startMenu_top").style.transform = "scale(1)";
				getId("win_startMenu_cap").classList.add("cursorDefault");
				getId("win_startMenu_cap").setAttribute("onmousedown", "");
				getId("win_startMenu_size").style.pointerEvents = "none";
				getId("win_startMenu_cap").setAttribute(
					"oncontextmenu",
					"ctxMenu(apps.startMenu.vars.captionCtx, 1, event)"
				);
				getId("win_startMenu_top").style.borderTopLeftRadius = "0";
				getId("win_startMenu_top").style.borderBottomLeftRadius = "0";
				getId("win_startMenu_top").style.borderBottomRightRadius = "";
				getId("win_startMenu_top").style.borderTopRightRadius = "0";
				getId("win_startMenu_html").style.borderBottomLeftRadius = "0";
				getId("win_startMenu_html").style.borderBottomRightRadius = "";
				getId("win_startMenu_html").style.overflowY = "auto";
				getId("win_startMenu_html").style.background = "none";
				getId("win_startMenu_top").setAttribute(
					"onClick",
					"toTop(apps.startMenu, 2)"
				);
				getId("icn_startMenu").setAttribute(
					"oncontextmenu",
					"ctxMenu(apps.startMenu.vars.iconCtx, 1, event)"
				);

				this.appWindow.setAlwaysOnTop();
				this.appWindow.setCaption("Dashboard");
				this.appWindow.openWindow();
				this.appWindow.closeKeepTask();
			} else if (launchType === "dsktp" || launchType === "tskbr") {
				if (getId("win_startMenu_top").style.display === "block") {
					return apps.startMenu.signalHandler("shrink");
				}

				getId("win_startMenu_top").style.display = "block";

				requestAnimationFrame(function () {
					apps.startMenu.appWindow.setDims(0, 0, 300, 370);
				});

				this.appWindow.openWindow();
				this.vars.listOfApps = "";
				this.appWindow.setContent(
					'<div style="width:100%;height:100%;">' +
						'<div style="position:relative;text-align:center;">' +
						'<input autocomplete="off" placeholder="App Search" onkeyup="apps.startMenu.vars.search(event)" id="appSearch">' +
						'</div><div id="dashboardWrapper" class="noselect" style="width:100%;overflow-y:scroll;background-color:rgba(' +
						darkSwitch("255, 255, 255", "39, 39, 39") +
						', 0.5);">' +
						'<table id="appList" style="color:#000;font-family:W95FA, monospace; font-size:12px; width:100%;color:' +
						darkSwitch("#000", "#FFF") +
						';"></table>' +
						"</div></div>"
				);
				const outerbound =
					getId("win_startMenu_html").getBoundingClientRect();
				const innerbound =
					getId("dashboardWrapper").getBoundingClientRect();
				getId("dashboardWrapper").style.height = "calc(100% - " + (innerbound.top - outerbound.top) + "px)";
				if (this.vars.listOfApps.length === 0) {
					getId("appList").innerHTML = "<tr><td></td></tr>";
					getId("appList").classList.add("cursorLoadDark");
					for (const appHandle in this.vars.appsSorted) {
						const app = this.vars.appsSorted[appHandle];
						if (apps[app].hideApp < 2) {
							apps.startMenu.vars.listOfApps +=
								'<tr class="cursorPointer dashboardSearchItem" onClick="openapp(apps.' +
								app +
								", 'dsktp')\" oncontextmenu=\"ctxMenu(apps.startMenu.vars.ctx, 1, event, '" +
								app +
								"')\">" +
								"<th>" +
								buildIcon({
									size: 32,
									image: apps[app].appWindow.image
								}) +
								"</th>" +
								"<td>" +
								apps[app].title +
								"</td>" +
								'<td style="text-align:right;opacity:0.5">' +
								apps[app].abbreviation +
								"</td>" +
								"</tr>";
						}
					}

					getId("appList").innerHTML = apps.startMenu.vars.listOfApps;
					getId("appList").innerHTML +=
						'<tr><th><div style="width:32px;height:32px;position:relative;"></div></th><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td>&nbsp;&nbsp;&nbsp;</td>';
					getId("appList").classList.remove("cursorLoadDark");
					apps.startMenu.vars.appElems = getId(
						"appList"
					).getElementsByClassName("dashboardSearchItem");
				} else {
					getId("appList").innerHTML = this.vars.listOfApps;
					this.vars.appElems = getId("appList").getElementsByTagName("tr");
				}
				if (!mobileMode) {
					getId("appSearch").focus();
				}
			}
		},
		vars: {
			appInfo: "",
			appElems: null,
			appsSorted: [],
			search: function (event, iblock) {
				if (this.appElems === null) return;
				if (event.keyCode === 13) {
					for (let i = 0; i < this.appElems.length; i++) {
						if (this.appElems[i].style.display !== "none") {
							this.appElems[i].click();
							break;
						}
					}
				} else {
					for (let i = 0; i < this.appElems.length; i++) {
						if (
							this.appElems[i].innerText
								.toLowerCase()
								.indexOf(getId("appSearch").value.toLowerCase()) > -1
						) {
							this.appElems[i].style.display = iblock ? "inline-block" : "";
						} else {
							this.appElems[i].style.display = "none";
						}
					}
				}
			},
			listOfApps: "",
			minimize: function () {
				apps.startMenu.appWindow.closeKeepTask();
				getId("icn_startMenu").classList.remove("openAppIcon");
			},
			captionCtx: [
				[
					" Hide",
					function () {
						apps.startMenu.signalHandler("shrink");
					},
					"ctxMenu/minimize.png",
				],
			],
			iconCtx: [
				[
					" Files",
					function () {
						openapp(apps.files, "dsktp");
					},
					"ctxMenu/folder.png",
				],
				[
					" All Apps",
					function () {
						openapp(apps.appsBrowser, "dsktp");
					},
					"ctxMenu/window.png",
				],
			],
			ctx: [
				[
					" Open",
					function (arg) {
						openapp(apps[arg], "dsktp");
					},
					"ctxMenu/window.png",
				],
				[
					"+About This App",
					function (arg) {
						openapp(apps.appInfo, arg);
					},
					"ctxMenu/file.png",
				],
				[
					" View Files",
					function (arg) {
						c(function () {
							openapp(apps.files, "dsktp");
							c(function () {
								apps.files.vars.next("apps/");
								apps.files.vars.next(arg + "/");
							});
						});
					},
					"ctxMenu/folder.png",
				],
			],
		},
		signalHandler: function (signal) {
			switch (signal) {
				case "forceclose":
					this.appWindow.closeWindow();
					this.appWindow.closeIcon();
					break;
				case "close":
					setTimeout(apps.startMenu.vars.minimize, 350);
					this.appWindow.setDims(-305, 0, 300, 370);
					if (mobileMode) {
						getId("win_startMenu_top").style.transform =
							"scale(1) translate(-" + getId("desktop").style.width + ", 0)";
					}

					break;
				case "checkrunning":
					return Boolean(this.appWindow.appIcon);
				case "shrink":
					setTimeout(apps.startMenu.vars.minimize, 350);
					this.appWindow.setDims(-305, 0, 300, 370);
					if (mobileMode) {
						getId("win_startMenu_top").style.transform =
							"scale(1) translate(-" + getId("desktop").style.width + ", 0)";
					}

					this.appWindow.appIcon = 0;
					break;
				case "USERFILES_DONE":
					// SET UP WIDGETS
					addWidget("notifications", 1);
					addWidget("time", 1);
					addWidget("flow", 1);

					// Remove taskbar text
					getId("icntitle_startMenu").style.display = "none";

					// Settings page stuff
					window.setTimeout(function () {
						getId("loadingInfo").innerHTML = "Welcome.";
						getId("desktop").style.display = "";
						getId("taskbar").style.display = "";
					}, 0);
					window.setTimeout(function () {
						getId("isLoading").style.opacity = 0;
						getId("loadingBg").style.opacity = 0;
					}, 5);
					window.setTimeout(function () {
						getId("isLoading").style.display = "none";
						getId("isLoading").innerHTML = "";
						getId("loadingBg").style.display = "none";
					}, 1005);
					window.setTimeout(function () {
						const dsktpIconFolder = ufload("system/desktop/");
						if (dsktpIconFolder) {
							for (const file in dsktpIconFolder) {
								if (
									file.indexOf("ico_") === 0 &&
									getId(file.substring(10, 16)) !== null
								) {
									getId(file.substring(4, file.length)).style.left =
										eval(USERFILES[file])[0] + "px";
									getId(file.substring(4, file.length)).style.top =
										eval(USERFILES[file])[1] + "px";
								}
							}
						}
					}, 0);

					this.vars.appsSorted = Object.keys(apps).sort();

					break;
				default:
					doLog(
						`No case found for '${signal}' signal in app '${this.abbreviation}'`
					);
			}
		},
	});

	apps.startMenu.main("srtup");
}; // End initial variable declaration
