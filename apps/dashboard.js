const Dashboard = () => {

apps.startMenu = new Application({
	title: "AaronOS Dashboard",
	abbreviation: "DsB",
	codeName: "startMenu",
	image: {
		backgroundColor: "#303947",
		// TODO: CHANGE TO CUSTOM KARA LOGO
		foreground: "smarticons/aOS/fg.png",
		backgroundBorder: {
			thickness: 2,
			color: "#252F3A"
		}
	},
	hideApp: 2,
	launchTypes: 1,
	main: function (launchType) {
		// TODO: Clean up
		if (launchType === 'srtup') {
			this.appWindow.paddingMode(0);
			getId('win_startMenu_shrink').style.display = "none";
			getId('win_startMenu_big').style.display = "none";
			getId('win_startMenu_exit').style.display = "none";
			getId('win_startMenu_fold').style.display = 'none';
			getId('win_startMenu_top').style.transform = 'scale(1)';
			getId('win_startMenu_cap').classList.remove('cursorLoadLight');
			getId('win_startMenu_cap').classList.add('cursorDefault');
			getId('win_startMenu_cap').setAttribute('onmousedown', '');
			getId('win_startMenu_size').style.pointerEvents = "none";
			getId('win_startMenu_cap').setAttribute('oncontextmenu', 'ctxMenu(apps.startMenu.vars.captionCtx, 1, event)');
			getId('win_startMenu_top').style.borderTopLeftRadius = "0";
			getId('win_startMenu_top').style.borderBottomLeftRadius = "0";
			getId('win_startMenu_top').style.borderBottomRightRadius = "";
			getId('win_startMenu_top').style.borderTopRightRadius = "0";
			getId('win_startMenu_html').style.borderBottomLeftRadius = "0";
			getId('win_startMenu_html').style.borderBottomRightRadius = "";
			getId('win_startMenu_html').style.overflowY = "auto";
			getId('win_startMenu_html').style.background = 'none';
			getId('win_startMenu_top').setAttribute('onClick', "toTop(apps.startMenu, 2)");
			getId('icn_startMenu').setAttribute('oncontextmenu', 'ctxMenu(apps.startMenu.vars.iconCtx, 1, event)');

			getId('win_startMenu_top').style.transition = '0.35s';
			getId('win_startMenu_aero').style.transition = '0.35s';

			this.appWindow.alwaysOnTop(1);

			this.appWindow.setCaption(lang('appNames', 'startMenu'));
			this.appWindow.openWindow();
			this.appWindow.closeKeepTask();
		} else if (launchType === 'dsktp' || launchType === 'tskbr') {
			if (getId('win_startMenu_top').style.display !== 'block') {
				requestAnimationFrame(function() {
					apps.startMenu.appWindow.setDims(0, 0, 300, 370)
				});

				this.appWindow.openWindow();
				this.vars.listOfApps = '';
				this.appWindow.setContent(
					'<div style="width:100%;height:100%;">' +
					'<div style="position:relative;text-align:center;">' +
					'<button onclick="c(function(){ctxMenu(apps.startMenu.vars.powerCtx, 1, event)})">' + lang('startMenu', 'power') + '</button>  ' +
					'<button onclick="openapp(apps.files, \'dsktp\')">' + lang('startMenu', 'files') + '</button> ' +
					'<button onclick="openapp(apps.settings, \'dsktp\')">' + lang('startMenu', 'settings') + '</button> ' +
					'<button onclick="openapp(apps.appsbrowser, \'dsktp\')">' + lang('startMenu', 'allApps') + '</button><br>' +
					'<button onclick="openapp(apps.appCenter, \'dsktp\')">AaronOS Hub</button> ' +
					'<button onclick="openapp(apps.jsConsole, \'dsktp\')">' + lang('startMenu', 'jsConsole') + '</button> ' +
					'<input autocomplete="off" style="width:calc(100% - 6px);margin-top:3px;" placeholder="App Search" onkeyup="apps.startMenu.vars.search(event)" id="appDsBsearch">' +
					'</div><div id="appDsBtableWrapper" class="noselect" style="width:100%;overflow-y:scroll;background-color:rgba(' + darkSwitch('255, 255, 255', '39, 39, 39') + ', 0.5);">' +
					'<table id="appDsBtable" style="color:#000;font-family:aosProFont, monospace; font-size:12px; width:100%;color:' + darkSwitch('#000', '#FFF') + ';"></table>' +
					'</div></div>'
				);
				var outerbound = getId("win_startMenu_html").getBoundingClientRect();
				var innerbound = getId("appDsBtableWrapper").getBoundingClientRect();
				getId("appDsBtableWrapper").style.height = outerbound.height - (innerbound.top - outerbound.top) + "px";
				if (this.vars.listOfApps.length === 0) {
					getId('appDsBtable').innerHTML = '<tr><td></td></tr>';
					getId('appDsBtable').classList.add('cursorLoadLight');
					for (var appHandle in appsSorted) {
						if (apps[appsSorted[appHandle]].keepOffDesktop < 2) {
							apps.startMenu.vars.listOfApps += '<tr class="cursorPointer dashboardSearchItem" onClick="openapp(apps.' + appsSorted[appHandle] + ', \'dsktp\')" oncontextmenu="ctxMenu(apps.startMenu.vars.ctx, 1, event, \'' + appsSorted[appHandle] + '\')">' +
								'<th>' + buildSmartIcon(32, apps[appsSorted[appHandle]].appWindow.appImg) + '</th>' +
								'<td>' + apps[appsSorted[appHandle]].appDesc + '</td>' +
								'<td style="text-align:right;opacity:0.5">' + apps[appsSorted[appHandle]].dsktpIcon + '</td>' +
								'</tr>';
						}
					}
					
					getId('appDsBtable').innerHTML = apps.startMenu.vars.listOfApps;
					getId('appDsBtable').innerHTML += '<tr><th><div style="width:32px;height:32px;position:relative;"></div></th><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td>&nbsp;&nbsp;&nbsp;</td>';
					getId('appDsBtable').classList.remove('cursorLoadLight');
					apps.startMenu.vars.appElems = getId('appDsBtable').getElementsByClassName('dashboardSearchItem');
				} else {
					getId('appDsBtable').innerHTML = this.vars.listOfApps;
					this.vars.appElems = getId('appDsBtable').getElementsByTagName('tr');
				}
				if (!mobileMode) {
					getId('appDsBsearch').focus();
				}
			} else {
				apps.startMenu.signalHandler('shrink');
			}
		}
	},
	vars: {
		appInfo: 'AaronOS is a web-based desktop environment that lives in the cloud. All files are saved on the aOS server, so they can be accessed from anywhere.<br><br>AaronOS is developed by Aaron Adams. He can be directly contacted at mineandcraft12@gmail.com',
		appElems: null,
		search: function (event, iblock) {
			if (this.appElems !== null) {
				if (event.keyCode === 13) {
					for (let i = 0; i < this.appElems.length; i++) {
						if (this.appElems[i].style.display !== 'none') {
							this.appElems[i].click();
							break;
						}
					}
				} else {
					for (let i = 0; i < this.appElems.length; i++) {
						if (this.appElems[i].innerText.toLowerCase().indexOf(getId('appDsBsearch').value.toLowerCase()) > -1) {
							this.appElems[i].style.display = iblock ? 'inline-block' : '';
						} else {
							this.appElems[i].style.display = 'none';
						}
					}
				}
			}
		},
		listOfApps: "",
		minimize: function() {
			apps.startMenu.appWindow.closeKeepTask();
			getId("icn_startMenu").classList.remove("openAppIcon");
		},
		captionCtx: [
			[' ' + lang('ctxMenu', 'hideApp'), function() {
				apps.startMenu.signalHandler('shrink');
			}, 'ctxMenu/beta/minimize.png']
		],
		iconCtx: [
			[' ' + lang('startMenu', 'files'), function() {
				openapp(apps.files, 'dsktp');
			}, 'ctxMenu/beta/folder.png'],
			[' ' + lang('startMenu', 'allApps'), function() {
				openapp(apps.appsBrowser, 'dsktp');
			}, 'ctxMenu/beta/window.png'],
			[' ' + lang('startMenu', 'settings'), function() {
				openapp(apps.settings, 'dsktp');
			}, 'ctxMenu/beta/gear.png'],
			['+Log Out', function() {
				apps.settings.vars.shutDown('restart', 1);
			}, 'ctxMenu/beta/power.png'],
			[' ' + lang('startMenu', 'restart'), function() {
				apps.settings.vars.shutDown('restart', 0);
			}, 'ctxMenu/beta/power.png'],
			[' ' + lang('startMenu', 'shutDown'), function() {
				apps.settings.vars.shutDown(0, 1);
			}, 'ctxMenu/beta/power.png']
		],
		powerCtx: [
			[' Log Out', function() {
				apps.settings.vars.shutDown('restart', 1);
			}, 'ctxMenu/beta/power.png'],
			[' ' + lang('startMenu', 'restart'), function() {
				apps.settings.vars.shutDown('restart', 0);
			}, 'ctxMenu/beta/power.png'],
			[' ' + lang('startMenu', 'shutDown'), function() {
				apps.settings.vars.shutDown(0, 1);
			}, 'ctxMenu/beta/power.png']
		],
		ctx: [
			[' ' + lang('ctxMenu', 'openApp'), function (arg) {
				openapp(apps[arg], "dsktp");
			}, 'ctxMenu/beta/window.png'],
			[function (arg) {
				if (dsktp[arg]) {
					return '_Add Desktop Icon';
				} else {
					return '+Add Desktop Icon';
				}
			}, function (arg) {
				if (dsktp[arg]) {
					removeDsktpIcon(arg);
				} else {
					newDsktpIcon(arg, arg);
				}
				openapp(apps.startMenu, 'tskbr');
			}, 'ctxMenu/beta/add.png'],
			[function (arg) {
				return `${dsktp[arg] ? ' ' : '-'}Remove Desktop Icon`;
			}, function (arg) {
				dsktp[arg] ? removeDsktpIcon(arg) : newDsktpIcon(arg, arg);
				openapp(apps.startMenu, 'tskbr');
			}, 'ctxMenu/beta/x.png'],
			['+About This App', function (arg) {
				openapp(apps.appInfo, arg);
			}, 'ctxMenu/beta/file.png'],
			[' View Files', function (arg) {
				c(function() {
					openapp(apps.files, 'dsktp');
					c(function() {
						apps.files.vars.next('apps/');
						apps.files.vars.next(arg + '/');
					});
				});
			}, 'ctxMenu/beta/folder.png']
		]
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
				if (mobileMode)
					getId('win_startMenu_top').style.transform = 'scale(1) translate(-' + getId('desktop').style.width + ', 0)';
				
				break;
			case "checkrunning":
				if (this.appWindow.appIcon) {
					return 1;
				} else {
					return 0;
				}
				case "shrink":
					setTimeout(apps.startMenu.vars.minimize, 350);
					this.appWindow.setDims(-305, 0, 300, 370);
					if (mobileMode) {
						getId('win_startMenu_top').style.transform = 'scale(1) translate(-' + getId('desktop').style.width + ', 0)';
					}

					this.appWindow.appIcon = 0;
					break;
				case "USERFILES_DONE":
					// SET UP WIDGETS
					if (ufload("aos_system/taskbar/widget_list") && !safeMode) {
						var tempList = JSON.parse(ufload("aos_system/taskbar/widget_list"));
						for (var i in tempList) {
							addWidget(i, 1);
						}
					} else {
						addWidget('notifications', 1);
						addWidget('time', 1);
						addWidget('flow', 1);
					}

					// Remove taskbar text
					getId('icntitle_startMenu').style.display = "none";
					break;
				case "shutdown":

					break;
				default:
					doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'");
		}
	}
});
apps.startMenu.main('srtup');

} // End initial variable declaration