const Settings = () => {

apps.settings = new Application({
	title: "Settings",
	abbreviation: "STN",
	codeName: "settings",
	image: {
		backgroundColor: "#303947",
		foreground: "smarticons/settings/fg.png",
		backgroundBorder: {
			thickness: 2,
			color: "#252F3A"
		}
	},
	hideApp: 2,
	launchTypes: 1,
	main: function (launchtype) {
		if (!this.appWindow.appIcon) {
			this.appWindow.setDims("auto", "auto", 700, 400);
		}
		this.appWindow.setCaption("Settings");
		this.appWindow.openWindow();
	},
	vars: {
		appInfo: '',
		language: {
			en: {
				valuesMayBeOutdated: 'All values below are from the time the Settings app was opened.',
				bgImgURL: 'Background Image URL',
				imgTile: 'Images tile to cover the screen.',
				dbgLevel: 'Debug Level',
				dbgExplain: 'Sets how verbose aOS is in its actions. The different levels determine how often console messages appear and why.',
				info: 'Info',
				cookies: 'By using this site you are accepting the small cookie the filesystem relies on and that all files you or your apps generate will be saved on the server for your convenience (and, mostly, for technical reasons).'
			},
			uv: {
				valuesMayBeOutdated: 'Each instance of a definitive value below this line would happen to have been generated at the exact moment in time at which the app which happens to be called Settings happens to have been opened.',
				bgImgURL: 'The Uniform Resource Locator of the Image to be Applied to the Background of the Desktop',
				imgTile: 'The specified image will tile as many times as necessary to cover the entirety of the screen.',
				performance: 'Functions that may Assist the Performance of the Operating System',
				dbgLevel: 'Level of logging to the Debug Console',
				dbgExplain: 'Determines the level of verbosity when referencing actions and issues. The differing levels given will determine how common messages will appear in the Console app, and the importance they must marked as to appear.',
				info: 'Essential Information About aOS',
				cookies: 'In the act of accessing this web site, you are hereby accepting the small, 21-character browser cookie that aOS relies heavily on for its filesystem. All text files you and your installed aOS apps happen to generate are stored solely on the aOS main server for your convenience (and, mostly, for annoying technical limitations).'
			}
		},
		menus: {
			folder: 1,
			folderName: 'Settings',
			folderPath: 'apps.settings.vars.menus'
		},
		corsProxy: 'https://cors-anywhere.herokuapp.com/',
		resetOS: function() {
			// TODO: Call this somewhere
			document.cookie = 'keyword=; Max-Age=-99999999;';
			window.location = 'index.php';
		},
		iconTitlesEnabled: 1,
		noraHelpTopics: 1,
		currVoiceStr: '',
		currLangStr: '',
		currNoraPhrase: 'listen computer',
		currNoraListening: "0",
		togNoraListen: function (nosave) {
			if (this.currNoraListening === "1") {
				// Stop nora's listening
				this.currNoraListening = "0";
				apps.nora.vars.stopContRecog();
				if (!nosave) ufsave('system/noraa/listen_enabled', this.currNoraListening);
			} else {
				// Start nora's listening
				this.currNoraListening = "1";
				apps.nora.vars.startContRecog();
				if (!nosave) ufsave('system/noraa/listen_enabled', this.currNoraListening);
			}
		},
		togNoraPhrase: function (nosave) {
			this.currNoraPhrase = getId('STNnoraphrase').value;
			if (!nosave) ufsave('system/noraa/listen_phrase', this.currNoraPhrase);
		},
		winBorder: 3,
		NORAAsetDelay: function (nosave) {
			apps.nora.vars.inputDelay = parseInt(getId('STNnoraDelay').value, 10);
			if (!nosave) ufsave('system/noraa/speech_response_delay', apps.nora.vars.inputDelay);
		},
		tempArray: [],
		bgFit: 'center',
		currWinColor: "rgba(150, 150, 200, 0.5)",
		currWinblurRad: "5",
		isAero: 0,
		sB: function (nosave) {
			perfStart('settings');
			getId('loadingBg').style.backgroundImage = "url(" + getId('bckGrndImg').value + ")";
			getId("monitor").style.backgroundImage = "url(" + getId("bckGrndImg").value + ")";
			getId("bgSizeElement").src = getId("bckGrndImg").value;
			if (this.isAero) {
				this.tempArray = document.getElementsByClassName("winAero");
				for (let elem = 0; elem < this.tempArray.length; elem++) {
					this.tempArray[elem].style.backgroundImage = "url(" + getId("bckGrndImg").value + ")";
				}
			}
			if (!nosave) ufsave("system/desktop/background_image", getId("bckGrndImg").value);
			try {
				updateBgSize();
			} catch (err) {}
			d(1, perfCheck('settings') + '&micro;s to set background');
		},
		togAero: function (nosave) {
			perfStart('settings');
			if (this.isAero) {
				this.tempArray = document.getElementsByClassName("winAero");
				for (let elem = 0; elem < this.tempArray.length; elem++) {
					this.tempArray[elem].style.backgroundImage = "none";
					this.tempArray[elem].style.backgroundBlendMode = "initial";
					this.tempArray[elem].style.filter = "none";
					this.tempArray[elem].style.webkitFilter = "none";
				}
				this.isAero = 0;
				if (!nosave) ufsave("system/windows/blur_enabled", "0");
			} else {
				if (this.isBackdrop) this.togBackdropFilter(nosave);
				this.tempArray = document.getElementsByClassName("winAero");
				for (let elem = 0; elem < this.tempArray.length; elem++) {
					this.tempArray[elem].style.backgroundImage = getId("monitor").style.backgroundImage;
					this.tempArray[elem].style.backgroundBlendMode = "screen";
					this.tempArray[elem].style.filter = "blur(" + this.currWinblurRad + "px)";
					this.tempArray[elem].style.webkitFilter = "blur(" + this.currWinblurRad + "px)";
				}
				this.isAero = 1;
				if (!nosave) ufsave("system/windows/blur_enabled", "1");
			}
			d(1, perfCheck('settings') + '&micro;s to toggle windowblur');
		},
		isBackdrop: 1,
		dispMapEffect: '',
		togBackdropFilter: function (nosave) {
			perfStart('settings');
			if (this.isBackdrop) {
				this.tempArray = document.getElementsByClassName("window");
				for (let elem = 0; elem < this.tempArray.length; elem++) {
					this.tempArray[elem].style.webkitBackdropFilter = 'none';
					this.tempArray[elem].style.backdropFilter = 'none';
					getId(this.tempArray[elem].id.substring(0, this.tempArray[elem].id.length - 4) + "_img").style.backgroundPosition = "";
				}
				getId('taskbar').style.webkitBackdropFilter = 'none';
				getId('taskbar').style.backdropFilter = 'none';
				getId("tskbrBimg").style.backgroundPosition = "";
				getId('ctxMenu').classList.remove('backdropFilterCtxMenu');
				this.isBackdrop = 0;
				if (!nosave) ufsave("system/windows/backdropfilter_blur", "0");
			} else {
				if (this.isAero) this.togAero(nosave);
				this.tempArray = document.getElementsByClassName("window");
				for (let elem = 0; elem < this.tempArray.length; elem++) {
					this.tempArray[elem].style.webkitBackdropFilter = 'blur(' + this.currWinblurRad + 'px)' + this.dispMapEffect;
					this.tempArray[elem].style.backdropFilter = 'blur(' + this.currWinblurRad + 'px)' + this.dispMapEffect;
					if (this.dispMapEffect) {
						getId(this.tempArray[elem].id.substring(0, this.tempArray[elem].id.length - 4) + "_img").style.backgroundPosition = "";
					}
				}
				getId('taskbar').style.webkitBackdropFilter = 'blur(' + this.currWinblurRad + 'px)' + this.dispMapEffect;
				getId('taskbar').style.backdropFilter = 'blur(' + this.currWinblurRad + 'px)' + this.dispMapEffect;
				if (this.dispMapEffect) {
					getId("tskbrBimg").style.backgroundPosition = "";
				}
				getId('ctxMenu').classList.add('backdropFilterCtxMenu');
				this.isBackdrop = 1;
				if (!nosave) ufsave("system/windows/backdropfilter_blur", "1");
			}
			d(1, perfCheck('settings') + '&micro;s to toggle backdrop filter');
		},
		setAeroRad: function (nosave) {
			perfStart('settings');
			this.currWinblurRad = getId("STNwinblurRadius").value;
			getId("svgDisplaceMap").setAttribute("scale", this.currWinblurRad);
			if (this.isAero) {
				for (let elem = 0; elem < this.tempArray.length; elem++) {
					this.tempArray = document.getElementsByClassName("winAero");
					this.tempArray[elem].style.webkitFilter = "blur(" + this.currWinblurRad + "px)";
					this.tempArray[elem].style.filter = "blur(" + this.currWinblurRad + "px)";
				}
				getId("tskbrAero").style.webkitFilter = "blur(" + this.currWinblurRad + "px)";
				getId("tskbrAero").style.filter = "blur(" + this.currWinblurRad + "px)";
			}
			if (this.isBackdrop) {
				this.tempArray = document.getElementsByClassName("window");
				for (let elem = 0; elem < this.tempArray.length; elem++) {
					this.tempArray[elem].style.webkitBackdropFilter = "blur(" + this.currWinblurRad + "px)" + this.dispMapEffect;
					this.tempArray[elem].style.backdropFilter = "blur(" + this.currWinblurRad + "px)" + this.dispMapEffect;
				}
				getId("taskbar").style.webkitBackdropFilter = "blur(" + this.currWinblurRad + "px)" + this.dispMapEffect;
				getId("taskbar").style.backdropFilter = "blur(" + this.currWinblurRad + "px)" + this.dispMapEffect;
			}

			if (!nosave) ufsave("system/windows/blur_radius", this.currWinblurRad);
			d(1, perfCheck('settings') + '&micro;s to set windowblur radius');
		},
		winFadeDistance: '0', // 0 is smaller, 1 is same size, 2 is bigger
		shutDown: function (arg, logout) {
			getId('isLoading').style.opacity = '0';
			getId('loadingBg').style.opacity = '0';
			getId('isLoading').style.transition = '1s';
			getId('isLoading').style.display = 'block';
			getId('loadingBg').style.display = 'block';
			window.shutDownPercentComplete = 0;
			window.shutDownTotalPercent = 1;
			getId('isLoading').classList.remove('cursorLoadDark');
			getId('isLoading').classList.add('cursorLoadLight');
			
			if (arg === 'restart') {
				getId('isLoading').innerHTML = '<div id="isLoadingDiv"><h1>Restarting aOS</h1><hr><div id="loadingInfoDiv"><div id="loadingInfo" class="liveElement" data-live-eval="shutDownPercentComplete / shutDownTotalPercent * 100 + \'%\'" data-live-target="style.width">Shutting down...</div></div></div>';
				requestAnimationFrame(function() {
					getId('isLoading').style.opacity = '1';
					getId('loadingBg').style.opacity = '1';
				});
				window.setTimeout(function() {
					getId('isLoading').classList.remove('cursorLoadLight');
					getId('isLoading').classList.add('cursorLoadDark');
					shutDownPercentComplete = codeToRun.length;
					for (let app in apps) {
						c(function (args) {
							m('THERE WAS AN ERROR SHUTTING DOWN THE APP ' + args + '. SHUTDOWN SHOULD CONTINUE WITH NO ISSUE.');
							shutDownPercentComplete++;
							apps[args].signalHandler('shutdown');
						}, app);
					}
					shutDownTotalPercent = codeToRun.length - shutDownPercentComplete;
					shutDownPercentComplete = 0;
					c(function() {
						getId('isLoading').innerHTML = '<div id="isLoadingDiv"><h1>Restarting aOS</h1><hr><div id="loadingInfoDiv"><div id="loadingInfo" class="liveElement" data-live-eval="shutDownPercentComplete / shutDownTotalPercent * 100 + \'%\'" data-live-target="style.width">Goodbye!</div></div></div>';
						if (logout) {
							document.cookie = "logintoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
						}
						window.location = 'blackScreen.html#restart-beta';
					});
				}, 1005);
			} else {
				getId('isLoading').innerHTML = '<div id="isLoadingDiv"><h1>Shutting Down aOS</h1><hr><div id="loadingInfoDiv"><div id="loadingInfo" class="liveElement" data-live-eval="shutDownPercentComplete / shutDownTotalPercent * 100 + \'%\'" data-live-target="style.width">Shutting down...</div></div></div>';
				requestAnimationFrame(function() {
					getId('isLoading').style.opacity = '1';
					getId('loadingBg').style.opacity = '1';
				});
				window.setTimeout(function() {
					getId('isLoading').classList.remove('cursorLoadLight');
					getId('isLoading').classList.add('cursorLoadDark');
					shutDownPercentComplete = codeToRun.length;
					for (let app in apps) {
						c(function (args) {
							m('THERE WAS AN ERROR SHUTTING DOWN THE APP ' + args + '. SHUTDOWN SHOULD CONTINUE WITH NO ISSUE.');
							shutDownPercentComplete++;
							apps[args].signalHandler('shutdown');
						}, app);
					}
					shutDownTotalPercent = codeToRun.length - shutDownPercentComplete;
					shutDownPercentComplete = 0;
					c(function() {
						getId('isLoading').innerHTML = '<div id="isLoadingDiv"><h1>Shutting Down aOS</h1><hr><div id="loadingInfoDiv"><div id="loadingInfo" class="liveElement" data-live-eval="shutDownPercentComplete / shutDownTotalPercent * 100 + \'%\'" data-live-target="style.width">Goodbye!</div></div></div>';
						if (logout) {
							document.cookie = "logintoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
						}
						window.location = 'blackScreen.html#beta';
					});
				}, 1005);
			}
		}
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
				if (this.appWindow.appIcon) {
					return 1;
				} else {
					return 0;
				}
				case "shrink":
					this.appWindow.closeKeepTask();
					break;
				case "USERFILES_DONE":
					window.setTimeout(function() {
						getId('loadingInfo').innerHTML = 'Welcome.';
						getId('desktop').style.display = '';
						getId('taskbar').style.display = '';
					}, 0);
					window.setTimeout(function() {
						getId('isLoading').style.opacity = 0;
						getId('loadingBg').style.opacity = 0;
					}, 5);
					window.setTimeout(function() {
						getId('isLoading').style.display = 'none';
						getId('isLoading').innerHTML = '';
						getId('loadingBg').style.display = 'none';
					}, 1005);
					window.setTimeout(function() {
						openapp(apps.settings, 'oldMenuHide');
						if (ufload("system/desktop/background_image")) {
							getId("bckGrndImg").value = ufload("system/desktop/background_image");
							apps.settings.vars.sB(1);
						}
						if (ufload("system/windows/backdropfilter_blur")) {
							if (ufload("system/windows/backdropfilter_blur") === "0") {
								apps.settings.vars.togBackdropFilter(1);
							}
						} else if (!backdropFilterSupport) {
							apps.settings.vars.togBackdropFilter(1);
						}
						if (ufload("system/windows/blur_radius")) {
							getId("STNwinblurRadius").value = ufload("system/windows/blur_radius");
							apps.settings.vars.setAeroRad(1);
						}
						if (ufload("system/language")) {
							currentlanguage = ufload("system/language");
						}
						if (ufload("system/noraa/listen_enabled")) {
							if (ufload("system/noraa/listen_enabled") === 1) {
								apps.settings.vars.togNoraListen(1);
							}
						}
						if (ufload("system/noraa/listen_phrase")) {
							apps.settings.vars.currNoraPhrase = ufload("system/noraa/listen_phrase");
						}
						if (lfload("system/apps/settings/saved_screen_res")) {
							apps.settings.vars.tempResArray = lfload("system/apps/settings/saved_screen_res").split('/');
							fitWindowRes(apps.settings.vars.tempResArray[0], apps.settings.vars.tempResArray[1]);
						}
						if (ufload("system/apps/settings/cors_proxy")) {
							apps.settings.vars.corsProxy = ufload("system/apps/settings/cors_proxy");
						}
						if (ufload("system/desktop/background_fit")) {
							apps.settings.vars.setBgFit(ufload("system/desktop/background_fit"), 1);
						}
						if (typeof ufload("system/taskbar/pinned_apps") === "string") {
							pinnedApps = JSON.parse(ufload("system/taskbar/pinned_apps"));
							for (var i in pinnedApps) {
								getId('icn_' + pinnedApps[i]).style.display = 'inline-block';
							}
						}

						var dsktpIconFolder = ufload("system/desktop/");
						if (dsktpIconFolder) {
							for (let file in dsktpIconFolder) {
								if (file.indexOf('ico_') === 0) {
									if (getId(file.substring(10, 16)) !== null) {
										getId(file.substring(4, file.length)).style.left = eval(USERFILES[file])[0] + "px";
										getId(file.substring(4, file.length)).style.top = eval(USERFILES[file])[1] + "px";
									}
								}
							}
						}
						apps.settings.appWindow.closeWindow();
					}, 0);
					break;
				case 'shutdown':

					break;
				default:
					doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'");
		}
	}
});

} // End initial variable declaration