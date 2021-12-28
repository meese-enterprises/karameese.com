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
	hideApp: 0,
	launchTypes: 1,
	main: function (launchtype) {
		if (!this.appWindow.appIcon) {
			this.appWindow.setDims("auto", "auto", 700, 400);
		}
		this.appWindow.setCaption("Settings");
		this.vars.showMenu(apps.settings.vars.menus);
		this.appWindow.openWindow();
	},
	vars: {
		appInfo: 'This app contains all official settings for AaronOS.<br><br>If these settings are not enough for you, and you are a very advanced user, you can use the following apps to completely control AaronOS:<br><ul><li>BootScript</li><li>CustomStyle Editor</li></ul>',
		language: {
			en: {
				valuesMayBeOutdated: 'All values below are from the time the Settings app was opened.',
				bgImgURL: 'Background Image URL',
				imgTile: 'Images tile to cover the screen.',
				dbgLevel: 'Debug Level',
				dbgExplain: 'Sets how verbose aOS is in its actions. The different levels determine how often console messages appear and why.',
				info: 'Info',
				cookies: 'By using this site you are accepting the small cookie the filesystem relies on and that all files you or your aOS apps generate will be saved on the aOS server for your convenience (and, mostly, for technical reasons).'
			},
			uv: {
				valuesMayBeOutdated: 'Each instance of a definitive value below this line would happen to have been generated at the exact moment in time at which the app which happens to be called Settings happens to have been opened.',
				bgImgURL: 'The Uniform Resource Locator of the Image to be Applied to the Background of the Desktop',
				imgTile: 'The specified image will tile as many times as necessary to cover the entirety of the screen.',
				performance: 'Functions that may Assist the Performance of the Operating System',
				dbgLevel: 'Level of logging to the Debug Console',
				dbgExplain: 'Determines the level of verbosity that aOS brings when referencing actions and issues. The differing levels given will determine how common messages will appear in the Console app, and the importance they must marked as to appear.',
				info: 'Essential Information About aOS',
				cookies: 'In the act of accessing this web site, you are hereby accepting the small, 21-character browser cookie that aOS relies heavily on for its filesystem. All text files you and your installed aOS apps happen to generate are stored solely on the aOS main server for your convenience (and, mostly, for annoying technical limitations).'
			}
		},
		menus: {
			folder: 1,
			folderName: 'Settings',
			folderPath: 'apps.settings.vars.menus',
			info: {
				folder: 0,
				folderName: 'Information',
				folderPath: 'apps.settings.vars.menus.info',
				image: 'settingIcons/new/information.png',
				osID: {
					option: 'aOS ID',
					description: function() {
						return 'Your aOS ID: ' + SRVRKEYWORD + '<br>' +
							'If you would wish to load another copy of aOS, use the button below. Be sure to have its aOS ID and password ready, and make sure to set a password on this current account if you want to get back to it later.'
					},
					buttons: function() {
						return '<button onclick="apps.settings.vars.changeKey()">Load a Different aOS</button>'
					}
				},
				osPassword: {
					option: 'aOS Password',
					description: function() {
						return 'Change the password required to access your account on AaronOS.'
					},
					buttons: function() {
						return '<input id="STNosPass" type="password"> <button onclick="apps.settings.vars.newPassword()">Set</button>'
					}
				},
				copyright: {
					option: 'Copyright Notice',
					description: function() {
						return 'AaronOS is &copy; 2015-2021 Aaron Adams<br><br>This software is provided FREE OF CHARGE.<br>If you were charged for the use of this software, please contact mineandcraft12@gmail.com<br><br>Original AaronOS source-code provided as-is at <a target="_blank" href="https://github.com/MineAndCraft12/AaronOS">Github</a>'
					},
					buttons: function() {
						return 'By using this site you are accepting the small cookie the filesystem relies on and that all files you or your aOS apps generate will be saved on the aOS server for your convenience (and, mostly, for technical reasons).' +
							function() {
								if (window.location.href.indexOf('https://aaronos.dev/AaronOS/') !== 0) {
									return '<br><br>This project is a fork of AaronOS. The official AaronOS project is hosted at <a href="https://aaronos.dev/">https://aaronos.dev/</a><br><br>The above copyright notice applies to all code and original resources carried over from Aaron Adams\' original, official AaronOS project.';
								} else {
									return '';
								}
							}()
					}
				},
				osVersion: {
					option: 'aOS Version',
					description: function() {
						return 'You are running AaronOS ' + window.aOSversion + '.'
					},
					buttons: function() {
						return 'aOS is updated automatically between restarts, with no action required on your part.'
					}
				},
				contact: {
					option: 'Contact',
					description: function() {
						return 'Having issues? Need help? Something broken on aOS? Want to suggest changes or features? Have some other need to contact me? Feel free to contact me below!'
					},
					buttons: function() {
						return 'Email: <a href="mailto:karabriggs15@gmail.com">karabriggs15@gmail.com</a>'
					}
				},
				dataCollect: {
					option: 'Anonymous Data Collection',
					description: function() {
						return 'Current: <span class="liveElement" data-live-eval="numEnDis(apps.settings.vars.collectData)">' + numEnDis(apps.settings.vars.collectData) + '</span>'
					},
					buttons: function() {
						return '<a href="privacy.txt" target="_blank">Privacy Policy</a><br><br>' +
							'<button onclick="apps.settings.vars.collectData = -1 * apps.settings.vars.collectData + 1">Toggle</button><br>' +
							'All ongoing data collection campaigns will be detailed in full here:' +
							apps.settings.vars.getDataCampaigns()
					}
				},
				uglyLoading: {
					option: 'Visible Loading',
					description: function() {
						return 'Current: <span class="liveElement" data-live-eval="numEnDis(dirtyLoadingEnabled)">' + numEnDis(dirtyLoadingEnabled) + '</span>.<br>' +
							'Allows you to watch aOS load at startup, but looks dirty compared to having a loading screen.'
					},
					buttons: function() {
						return '<button onclick="apps.settings.vars.togDirtyLoad()">Toggle</button>'
					}
				},
			},
			screenRes: {
				folder: 0,
				folderName: 'Display',
				folderPath: 'apps.settings.vars.menus.screenRes',
				image: 'settingIcons/new/resolution.png',
				mobileMode: {
					option: 'Mobile Mode',
					description: function() {
						return 'Current: ' + function() {
								if (autoMobile) {
									return 'Automatic'
								} else {
									return numEnDis(mobileMode)
								}
							}() + '.<br>' +
							'Changes various UI elements and functionality of AaronOS to be better suited for phones and other devices with small screens.'
					},
					buttons: function() {
						return '<button onclick="apps.settings.vars.setMobileMode(0)">Turn Off</button> <button onclick="apps.settings.vars.setMobileMode(1)">Turn On</button> <button onclick="apps.settings.vars.setMobileMode(2)">Automatic</button>'
					}
				},
				scaling: {
					option: 'Content Scaling',
					description: function() {
						return 'Use this option to scale AaronOS larger or smaller.<br>Default is 1. Double size is 2. Half size is 0.5.'
					},
					buttons: function() {
						return '<input placeholder="1" size="3" id="STNscaling" value="' + window.screenScale + '"> <button onclick="apps.settings.vars.setScale(getId(\'STNscaling\').value)">Set</button>'
					}
				},
				currRes: {
					option: 'Virtual Monitor Resolution',
					description: function() {
						return 'Current: <span class="liveElement" data-live-eval="getId(\'monitor\').style.width">' + getId('monitor').style.width + '</span> by <span class="liveElement" data-live-eval="getId(\'monitor\').style.height">' + getId('monitor').style.height + '</span>.<br>' +
							'These are the dimensions of AaronOS\'s virtual display. Scrollbars will be present if the display is made too large.'
					},
					buttons: function() {
						return '<button onclick="fitWindow()">Fit to Browser Window</button> <button onclick="fitWindowOuter()">Fit to Screen</button><hr>' +
							'Custom Resolution: <input id="STNscnresX" size="4" placeholder="width"> by <input id="STNscnresY" size="4" placeholder="height"><br><br>' +
							'<button onclick="fitWindowRes(getId(\'STNscnresX\').value, getId(\'STNscnresY\').value)">Set For Now</button> ' +
							'<button onclick="apps.settings.vars.saveRes(getId(\'STNscnresX\').value, getId(\'STNscnresY\').value)">Save Persistent</button> ' +
							'<button onclick="lfdel(\'aos_system/apps/settings/saved_screen_res\');fitWindow();">Delete Persistent</button>'
					}
				}
			},
			windows: {
				folder: 0,
				folderName: 'Windows',
				folderPath: 'apps.settings.vars.menus.windows',
				image: 'settingIcons/new/windows.png',
				darkMode: {
					option: 'Dark Mode',
					description: function() {
						return 'Current: <span class="liveElement" data-live-eval="numEnDis(darkMode)">Disabled</span>.<br>' +
							'Makes your aOS apps use a dark background and light foreground. Some apps may need to be restarted to see changes.'
					},
					buttons: function() {
						return '<button onclick="apps.settings.vars.togDarkMode();apps.settings.vars.showMenu(apps.settings.vars.menus.windows)">Toggle</button>'
					}
				},
				fadeDist: {
					option: 'Window Fade Size',
					description: function() {
						return 'The animated change in size of a window when being closed or opened. If set to 1, windows will not change size when closed. If between 0 and 1, the window will get smaller when closed. If larger than 1, the window will get bigger when closed.'
					},
					buttons: function() {
						return '<input id="STNwinFadeInput" placeholder="0.8" value="' + apps.settings.vars.winFadeDistance + '"> <button onClick="apps.settings.vars.setFadeDistance(getId(\'STNwinFadeInput\').value)">Set</button>'
					}
				},
			},
			taskbar: {
				folder: 0,
				folderName: 'Taskbar',
				folderPath: 'apps.settings.vars.menus.taskbar',
				image: 'settingIcons/new/taskbar.png',
				taskbarIconTitle: {
					option: 'Taskbar Icon Titles',
					description: function() {
						return 'Current: <span class="liveElement" data-live-eval="numEnDis(apps.settings.vars.iconTitlesEnabled)">true</span><br>Shows application titles on taskbar icons. Disabling this option makes icons take up far less space.'
					},
					buttons: function() {
						return '<button onclick="apps.settings.vars.toggleIconTitles();">Toggle</button>'
					}
				}
			},
			applicationPermissions: {
				folder: 0,
				folderName: "App Permissions",
				folderPath: "apps.settings.vars.menus.applicationPermissions",
				image: 'settingIcons/new/permissions.png',
				domainPermissions: {
					option: 'Domain Permissions',
					description: function() {
						return 'Every web app on your system requires permission to perform certain actions on aOS. All web apps belong to specific web domains. Use the controls below to change permissions for all apps belonging to a domain.'
					},
					buttons: function() {
						var tempHTML = '';
						tempHTML += '<div style="position:relative;height:2em;">' +
							'<span style="font-size:2em">Permission Descriptions</span> ' +
							'<button onclick="if(this.innerHTML === \'v\'){this.innerHTML = \'^\';this.parentElement.style.height = \'\';}else{this.innerHTML = \'v\';this.parentElement.style.height = \'2em\';}">v</button><br><br>';
						for (let j in apps.webAppMaker.vars.actions) {
							tempHTML += (apps.webAppMaker.vars.actionNames[j] || '[Unknown]') + ' (' + j + '): Permission to ' + (apps.webAppMaker.vars.actionDesc[j] || "[???]") + ".<br><ul>";
							if (apps.webAppMaker.vars.commandDescriptions.hasOwnProperty(j)) {
								for (let l in apps.webAppMaker.vars.commandDescriptions[j]) {
									tempHTML += '<li>' + apps.webAppMaker.vars.commandDescriptions[j][l] + '</li>';
								}
							}
							tempHTML += '</ul>';
						}
						tempHTML += '</div>';
						for (let i in apps.webAppMaker.vars.trustedApps) {
							tempHTML += '<br><br><div style="position:relative;height:2em;">' +
								'<span style="font-size:2em">' + i + '</span> ' +
								'<button onclick="if(this.innerHTML === \'v\'){this.innerHTML = \'^\';this.parentElement.style.height = \'\';}else{this.innerHTML = \'v\';this.parentElement.style.height = \'2em\';}">v</button><br><br>';
							for (let j in apps.webAppMaker.vars.actions) {
								tempHTML += '<select onchange="apps.webAppMaker.vars.trustedApps[\'' + i + '\'][\'' + j + '\'] = this.value;apps.webAppMaker.vars.updatePermissions()"> ';
								if (
									apps.webAppMaker.vars.trustedApps[i][j] === "true" ||
									(apps.webAppMaker.vars.globalPermissions[j] === "true" && !apps.webAppMaker.vars.trustedApps[i].hasOwnProperty(j))
								) {
									tempHTML += '<option value="true" selected>Allowed</option><option value="false">Denied</option></select> ';
								} else {
									tempHTML += '<option value="true">Allowed</option><option value="false" selected>Denied</option></select> ';
								}
								tempHTML += (apps.webAppMaker.vars.actionNames[j] || '[Unknown]') + ' (' + j + ')<br>Permission to ' + (apps.webAppMaker.vars.actionDesc[j] || "[???]") + ".<br><br>";
								if (apps.webAppMaker.vars.permissionsUsed.hasOwnProperty(i)) {
									var printedTimesUsed = 0;
									if (apps.webAppMaker.vars.permissionsUsed[i].hasOwnProperty(j)) {
										tempHTML += "Granted " + apps.webAppMaker.vars.permissionsUsed[i][j] + " times since boot.<br>";
										printedTimesUsed = 1;
									}
									if (apps.webAppMaker.vars.permissionsDenied[i].hasOwnProperty(j)) {
										tempHTML += "Refused " + apps.webAppMaker.vars.permissionsUsed[i][j] + " times since boot.<br>";
										printedTimesUsed = 1;
									}
									if (printedTimesUsed) {
										tempHTML += "<br>";
									}
								}
							}
						}
						return tempHTML + '</div>';
					}
				}
			},
			screensaver: {
				folder: 0,
				folderName: "Screen Saver",
				folderPath: "apps.settings.vars.menus.screensaver",
				image: 'settingIcons/new/screensaver.png',
				enable: {
					option: "Enable Screen Saver",
					description: function() {
						return "Current: " + apps.settings.vars.screensaverEnabled + ".<br>" +
							"This is an animation or other screen that appears when you're away from your computer."
					},
					buttons: function() {
						return "";
					}
				},
				time: {
					option: "Time to Wait",
					description: function() {
						return "Current: " + (apps.settings.vars.screensaverTime / 1000 / 1000 / 60) + ".<br>" +
							"This is the time in minutes that aOS waits to activate the screensaver."
					},
					buttons: function() {
						return '<input id="STNscreensaverTime"> <button onclick="apps.settings.vars.setScreensaverTime(parseFloat(getId(\'STNscreensaverTime\').value) * 1000 * 1000 * 60)">Set</button>'
					}
				}
			},
			smartIcons: {
				folder: 0,
				folderName: "Smart Icons",
				folderPath: "apps.settings.vars.menus.smartIcons",
				image: 'settingIcons/new/smartIcon_fg.png',
				autoRedirectToApp: {
					option: "Smart Icon Settings",
					description: function() {
						return "Click below to open the Smart Icon Settings app."
					},
					buttons: function() {
						c(function() {
							openapp(apps.smartIconSettings, 'dsktp');
							apps.settings.vars.showMenu(apps.settings.vars.menus);
						});
						return '<button onclick="openapp(apps.smartIconSettings, \'dsktp\')">Smart Icon Settings</button>';
					}
				}

			},
			noraa: {
				folder: 0,
				folderName: 'NORAA',
				folderPath: 'apps.settings.vars.menus.noraa',
				image: 'settingIcons/new/noraa.png',
				advHelp: {
					option: 'Advanced Help Pages',
					description: function() {
						return 'Current: <span class="liveElement" data-live-eval="numEnDis(apps.settings.vars.noraHelpTopics)">' + !!apps.settings.vars.noraHelpTopics + '</span>.<br>' +
							'NORAA returns more advanced help pages when you ask for OS help, instead of plain text.'
					},
					buttons: function() {
						return '<button onclick="apps.settings.vars.togNoraListen()">Toggle</button>'
					}
				},
				voices: {
					option: 'NORAA\'s Voice',
					description: function() {
						return 'Current: <span class="liveElement" data-live-eval="apps.nora.vars.lang">' + apps.nora.vars.lang + '</span>. This is the voice NORAA uses to speak to you. Choose from one of the voices below that are supported by your browser.'
					},
					buttons: function() {
						return apps.settings.vars.getVoicesForNORAA()
					}
				}
			},
			advanced: {
				folder: 0,
				folderName: 'Advanced',
				folderPath: 'apps.settings.vars.menus.advanced',
				image: 'settingIcons/new/advanced.png',
				reset: {
					option: 'Reset aOS',
					description: function() {
						return 'If you wish, you can completely reset aOS. This will give you a new OS ID, which will have the effect of removing all of your files. Your old files will still be preserved, so you can ask the developer for help if you mistakenly reset aOS. If you wish for your old files to be permanently removed, please contact the developer.'
					},
					buttons: function() {
						return '<button onclick="apps.settings.vars.resetOS()">Reset aOS</button>'
					}
				}
			},
			oldMenu: {
				folder: 0,
				folderName: 'Old Menu',
				folderPath: '\'oldMenu\'',
				image: 'settingIcons/beta/OldMenu.png'
			},
		},
		showMenu: function (menu) {
			if (menu === 'oldMenu') return openapp(apps.settings, 'oldMenu');

			apps.settings.appWindow.setContent(
				'<div id="STNmenuDiv" style="font-family:W95FA, monospace;font-size:12px;width:calc(100% - 3px);height:100%;overflow:auto">' +
				'<p id="STNmenuTitle" class="noselect" style="font-size:36px;margin:8px;">' + menu.folderName +
				'<button id="STNhomeButton" onclick="apps.settings.vars.showMenu(apps.settings.vars.menus)" style="float:left;margin:8px;top:8px;left:0;position:absolute;display:none;">Home</button>' +
				'</p><br></div>'
			);

			getId("STNmenuDiv").innerHTML += '<div id="STNmenuTable" class="noselect" style="width:100%;position:relative;"></div>';
			let appendStr = '';
			for (let i in this.menus) {
				if (i !== 'folder' && i !== 'folderName' && i !== 'folderPath' && i !== 'image' && i !== 'oldMenu') {
					if (this.menus[i].image) {
						appendStr += '<div class="STNtableTD cursorPointer" onclick="apps.settings.vars.showMenu(' + this.menus[i].folderPath + ')"><img src="' + this.menus[i].image + '" style="margin-bottom:-12px;width:32px;height:32px;margin-right:3px;' + darkSwitch('', 'filter:invert(1);') + '"> ' + this.menus[i].folderName + '</div>';
					} else {
						appendStr += '<div class="STNtableTD cursorPointer" onclick="apps.settings.vars.showMenu(' + this.menus[i].folderPath + ')"><div style="margin-bottom:-12px;width:32px;height:32px;margin-right:3px;position:relative;display:inline-block;"></div> ' + this.menus[i].folderName + '</div>';
					}
				}
			}

			getId('STNmenuTable').innerHTML += appendStr;
			if (menu.folder) return;

			getId('STNmenuTable').style.width = '225px';
			getId('STNmenuTable').style.position = 'absolute';
			getId('STNmenuTable').style.height = 'calc(100% - 64px)';
			getId('STNmenuTable').style.bottom = '0';
			getId('STNmenuTable').style.overflowY = 'auto';
			getId('STNmenuTitle').style.marginLeft = '76px';
			if (menu !== this.menus) getId('STNhomeButton').style.display = 'block';
			getId('STNmenuTable').style.maxWidth = "calc(50% - 6px)";
			getId('STNmenuDiv').innerHTML += '<div id="STNcontentDiv" style="width:calc(100% - 232px);min-width:50%;padding-top:5px;right:0;bottom:0;height:calc(100% - 69px);overflow-y:auto;"></div>';
			for (let i in menu) {
				if (i !== 'folder' && i !== 'folderName' && i !== 'folderPath' && i !== 'image') {
					getId('STNcontentDiv').innerHTML += '<span style="font-size:24px">' + menu[i].option +
						'</span><br><br>' + menu[i].description() +
						'<br><br>' + menu[i].buttons() + '<br><br><br>';
				}
			}
		},
		screensaverBlockNames: [],
		corsProxy: 'https://cors-anywhere.herokuapp.com/',
		saveRes: function (newX, newY) {
			lfsave('aos_system/apps/settings/saved_screen_res', newX + '/' + newY);
			fitWindowRes(newX, newY);
		},
		togDirtyLoad: function() {
			dirtyLoadingEnabled = -1 * dirtyLoadingEnabled + 1;
			apps.savemaster.vars.save('aos_system/apps/settings/ugly_boot', dirtyLoadingEnabled, 1);
			localStorage.setItem("aosdirtyloading", String(dirtyLoadingEnabled));
		},
		resetOS: function() {
			apps.prompt.vars.confirm('<h1>STOP</h1><br><br>Please confirm with absolute certainty that you wish to RESET AaronOS.', ['<h1>CANCEL</h1>', '<h1 style="color:#F00">RESET</h1>'], function (btn) {
				if (btn) {
					apps.prompt.vars.prompt('<h1>HOLD UP</h1><br><br>I don\'t think hitting a button is easy enough, so please follow these instructions:<br><br>Type EXACTLY "Reset AaronOS" into the field below.<br>Press the button and aOS will be reset.<br>If you do not type exactly "Reset AaronOS", then aOS will not reset.', 'RESET', function (str) {
						if (str === 'Reset AaronOS') {
							document.cookie = 'keyword=; Max-Age=-99999999;';
							window.location = 'aosBeta.php';
						}
					}, 'AaronOS');
				}
			}, 'Settings');
		},
		captionButtonsLeft: 0,
		togCaptionButtonsLeft: function (nosave) {
			if (this.captionButtonsLeft) {
				document.getElementById("desktop").classList.remove("leftCaptionButtons");
				this.captionButtonsLeft = 0;
			} else {
				document.getElementById("desktop").classList.add("leftCaptionButtons");
				this.captionButtonsLeft = 1;
			}

			if (!nosave) ufsave('aos_system/windows/controls_on_left', this.captionButtonsLeft);
		},
		iconTitlesEnabled: 1,
		toggleIconTitles: function (nosave) {
			this.iconTitlesEnabled = Math.abs(this.iconTitlesEnabled - 1);
			if (this.iconTitlesEnabled) {
				getId("icons").classList.remove("noIconTitles");
			} else {
				getId("icons").classList.add("noIconTitles");
			}
			if (!nosave) ufsave("aos_system/taskbar/iconTitles", String(this.iconTitlesEnabled));
		},
		setScale: function (newScale, nosave) {
			window.screenScale = parseFloat(newScale);
			fitWindow();
			if (!nosave) lfsave('aos_system/apps/settings/ui_scale', newScale);
		},
		togDarkMode: function (nosave) {
			if (darkMode) {
				darkMode = 0;
				document.body.classList.remove('darkMode');
			} else {
				darkMode = 1;
				document.body.classList.add('darkMode');
			}
			apps.settings.vars.updateFrameStyles();
			if (!nosave) ufsave('aos_system/windows/dark_mode', darkMode);
		},
		updateFrameStyles: function() {
			var allFrames = document.getElementsByTagName("iframe");
			for (let i = 0; i < allFrames.length; i++) {
				try {
					if (allFrames[i].getAttribute("data-parent-app")) {
						allFrames[i].contentWindow.postMessage({
							type: "response",
							content: "Update style information",
							conversation: "aosTools_Subscribed_Style_Update"
						});
					}
				} catch (err) {
					doLog("Error updating frame for " + allFrames[i].getAttribute("data-parent-app"), "#F00");
					doLog(err, "#F00");
				}
			}
		},
		setMobileMode: function (type, nosave) {
			if (type == 1) {
				setMobile(1);
				autoMobile = 0;
			} else if (type == 2) {
				autoMobile = 1;
			} else {
				setMobile(0);
				autoMobile = 0;
			}
			if (!nosave) lfsave('aos_system/apps/settings/mobile_mode', type);
			checkMobileSize();
		},
		tmpPasswordSet: '',
		newPassword: function() {
			apps.savemaster.vars.save('aOSpassword', getId('STNosPass').value, 1, 'SET_PASSWORD');
			USERFILES.aOSpassword = '*****';
			var tmpPasswordSet = getId('STNosPass').value;
			setTimeout(() => {
				var passxhr = new XMLHttpRequest();
				passxhr.onreadystatechange = () => {
					if (passxhr.readyState === 4) {
						if (passxhr.status === 200) {
							if (passxhr.responseText !== "REJECT") {
								document.cookie = 'logintoken=' + passxhr.responseText;
								apps.prompt.vars.notify("Password set successfully.", ["Okay"], function() {}, "Settings", "appicons/ds/STN.png");
							} else {
								apps.prompt.vars.alert("There was an issue setting your password. Try again.<br>" + passxhr.responseText, "Okay", function() {}, "Settings");
							}
						} else {
							apps.prompt.vars.alert("There was an issue setting your password. (net error " + passxhr.status + ") Try again.<br>" + passxhr.status, "Okay", function() {}, "Settings");
						}
					}
				}
				passxhr.open('POST', 'checkPassword.php');
				var passfd = new FormData();
				passfd.append('pass', tmpPasswordSet);
				passxhr.send(passfd);
			}, 1000);
			getId("STNosPass").value = "";
		},
		calcFLOPS: function() {
			var intOps = 0;
			var fltOps = 0.0;
			var strOps = "";
			var firstTime = performance.now();
			
			while (performance.now() - firstTime <= 1000) {
				intOps += 1;
			}

			while (performance.now() - firstTime <= 2000) {
				fltOps += 0.1;
			}
			
			while (performance.now() - firstTime <= 3000) {
				strOps += "A";
			}

			fltOps = Math.floor(fltOps * 10);
			strOps = strOps.length;
			apps.prompt.vars.alert("Operations Per Second:<br>Note: This value may be inaccurate due to counting time<br><br>Integer OPS: " + numberCommas(intOps) + "<br>Floating Point OPS: " + numberCommas(fltOps) + "<br>String OPS: " + numberCommas(strOps), 'OK', function() {}, 'Settings');
		},
		longTap: 0,
		longTapTime: 500000,
		togLongTap: function (nosave) {
			this.longTap = -1 * this.longTap + 1;
			if (!nosave) ufsave('aos_system/apps/settings/ctxmenu_two_fingers', this.longTap);
		},
		clickToMove: 0,
		togClickToMove: function() {
			this.clickToMove = -1 * this.clickToMove + 1;
		},
		togNoraHelpTopics: function (nosave) {
			this.noraHelpTopics = this.noraHelpTopics * -1 + 1;
			if (!nosave) ufsave('aos_system/noraa/adv_help_enabled', this.noraHelpTopics);
		},
		noraHelpTopics: 1,
		collectData: 0,
		currVoiceStr: '',
		currLangStr: '',
		currNoraPhrase: 'listen computer',
		currNoraListening: "0",
		togNoraListen: function (nosave) {
			if (this.currNoraListening === "1") {
				// Stop nora's listening
				this.currNoraListening = "0";
				apps.nora.vars.stopContRecog();
				if (!nosave) ufsave('aos_system/noraa/listen_enabled', this.currNoraListening);
			} else {
				// Start nora's listening
				this.currNoraListening = "1";
				apps.nora.vars.startContRecog();
				if (!nosave) ufsave('aos_system/noraa/listen_enabled', this.currNoraListening);
			}
		},
		togNoraPhrase: function (nosave) {
			this.currNoraPhrase = getId('STNnoraphrase').value;
			if (!nosave) ufsave('aos_system/noraa/listen_phrase', this.currNoraPhrase);
		},
		setDebugLevel: function (level) {
			dbgLevel = level;
		},
		winBorder: 3,
		dataCampaigns: [
			[
				'Example Campaign <i>(not real)</i>',
				['Session Error Logs', 'Feature Usage Statistics', 'Other useful stuff']
			]
		],
		getDataCampaigns: function() {
			if (this.dataCampaigns.length > 0) {
				var str = "";
				for (let i in this.dataCampaigns) {
					str += '<br>' + this.dataCampaigns[i][0];
					for (let j in this.dataCampaigns[i][1]) {
						str += '<br>-&nbsp;' + this.dataCampaigns[i][1][j];
					}
				}
				str += '<br>';
				return str;
			} else {
				return '<i>None found.</i><br>';
			}
		},
		FILcanWin: 0,
		togFILwin: function() {
			if (this.FILcanWin) {
				this.FILcanWin = 0;
			} else {
				this.FILcanWin = 1;
			}
			ufsave("aos_system/apps/files/window_debug", '' + this.FILcanWin);
		},
		enabWinImg: 1,
		currWinImg: 'images/winimg.png',
		togWinImg: function (nosave) {
			perfStart('settings');
			if (this.enabWinImg) {
				this.tempArray = document.getElementsByClassName("winBimg");
				for (let elem = 0; elem < this.tempArray.length; elem++) {
					this.tempArray[elem].style.display = "none";
				}
				this.enabWinImg = 0;
				if (!nosave) ufsave("aos_system/windows/border_texture_enabled", "0");
			} else {
				this.tempArray = document.getElementsByClassName("winBimg");
				for (let elem = 0; elem < this.tempArray.length; elem++) {
					this.tempArray[elem].style.display = "block";
				}
				this.enabWinImg = 1;
				if (!nosave) ufsave("aos_system/windows/border_texture_enabled", "1");
			}
			d(1, perfCheck('settings') + '&micro;s to toggle windowbgimg');
		},
		setWinImg: function (nosave) {
			perfStart('settings');
			this.currWinImg = getId('STNwinImgInput').value;
			this.tempArray = document.getElementsByClassName("winBimg");
			for (let elem = 0; elem < this.tempArray.length; elem++) {
				this.tempArray[elem].style.backgroundImage = 'url(' + this.currWinImg + ')';
			}

			if (!nosave) ufsave("aos_system/windows/border_texture", this.currWinImg);
			d(1, perfCheck('settings') + '&micro;s to set windowbgimg');
		},
		getVoicesForNORAA: function() {
			this.currVoiceStr = '';
			if (apps.nora.vars.voices !== []) {
				for (let i in apps.nora.vars.voices) {
					this.currVoiceStr += '<button onclick="apps.nora.vars.lang = \'' + apps.nora.vars.voices[i].name + '\';window.speechSynthesis.onvoiceschanged();apps.settings.vars.saveNORAAvoice()">' + apps.nora.vars.voices[i].name + '</button> ';
				}
				return this.currVoiceStr;
			} else {
				return '<i>Voices not available - try reopening Settings</i>';
			}
		},
		saveNORAAvoice: function() {
			ufsave('aos_system/noraa/speech_voice', apps.nora.vars.lang);
		},
		NORAAsetDelay: function (nosave) {
			apps.nora.vars.inputDelay = parseInt(getId('STNnoraDelay').value, 10);
			if (!nosave) ufsave('aos_system/noraa/speech_response_delay', apps.nora.vars.inputDelay);
		},
		tempArray: [],
		bgFit: 'center',
		checkScreensaver: function() {
			if (apps.settings.vars.screensaverEnabled && !screensaverRunning && screensaverBlocks.length === 0) {
				if (perfCheck('userActivity') > apps.settings.vars.screensaverTime) {
					getId('screensaverLayer').style.display = "block";
					apps.settings.vars.screensavers[apps.settings.vars.currScreensaver].start();
					screensaverRunning = 1;
				}
			}
		},
		screensaverTimer: 0,
		screensaverEnabled: false,
		screensaverTime: 300000000,
		currScreensaver: "phosphor",
		// TODO
		screensavers: {
			phosphor: {
				name: "Phosphor",
				selected: function() {
					apps.prompt.vars.alert("Screensaver applied.<br>There are no configuration options for this screensaver.", "Okay.", function() {}, "Phosphor Screensaver");
				},
				start: function() {
					getId('screensaverLayer').style.backgroundColor = '#000';
					getId('screensaverLayer').innerHTML = '<iframe src="scrsav/phosphor.html" style="pointer-events:none;border:none;width:100%;height:100%;display:block;position:absolute;left:0;top:0;"></iframe>';
					apps.settings.vars.screensavers.phosphor.vars.enabled = 1;
					apps.settings.vars.screensavers.phosphor.vars.moveCursors();
				},
				end: function() {
					getId('screensaverLayer').style.backgroundColor = '';
					getId('screensaverLayer').innerHTML = '';
					apps.settings.vars.screensavers.phosphor.vars.enabled = 0;
				},
				vars: {
					cursorsPosition: 0,
					cursorsInterval: 0,
					enabled: 0,
					moveCursors: function() {
						if (apps.settings.vars.screensavers.phosphor.vars.enabled) {
							lastPageX = Math.round(Math.random() * parseInt(getId('monitor').style.width) * 0.4);
							if (apps.settings.vars.screensavers.phosphor.vars.cursorInterval) {
								lastPageY = parseInt(getId('monitor').style.height) * 0.1;
								apps.settings.vars.screensavers.phosphor.vars.cursorInterval = 0;
							} else {
								lastPageY = parseInt(getId('monitor').style.height) * 0.9;
								apps.settings.vars.screensavers.phosphor.vars.cursorInterval = 1;
							}
							window.setTimeout(apps.settings.vars.screensavers.phosphor.vars.moveCursors, 3000);
						}
					}
				}
			},
			hue: {
				name: "Hue",
				selected: function() {
					apps.prompt.vars.alert("Screensaver applied.<br>There are no configuration options for this screensaver.", "Okay.", function() {}, "Hue Screensaver");
				},
				start: function() {
					apps.settings.vars.screensavers.hue.vars.currHue = 0;
					apps.settings.vars.screensavers.hue.vars.canRun = 1;
					requestAnimationFrame(apps.settings.vars.screensavers.hue.vars.setHue);
				},
				end: function() {
					apps.settings.vars.screensavers.hue.vars.canRun = 0;
				},
				vars: {
					currHue: 0,
					setHue: function() {
						if (apps.settings.vars.screensavers.hue.vars.canRun) {
							getId("monitor").style.filter = "hue-rotate(" + (apps.settings.vars.screensavers.hue.vars.currHue++) + "deg)";
							setTimeout(apps.settings.vars.screensavers.hue.vars.setHue, 100);
						} else {
							getId("monitor").style.filter = "";
						}
					},
					canRun: 0
				}
			},
			randomColor: {
				name: "Random Color",
				selected: function() {
					apps.prompt.vars.alert("Screensaver applied.<br>There are no configuration options for this screensaver.", "Okay.", function() {}, "Random Color Screensaver");
				},
				start: function() {
					apps.settings.vars.screensavers.randomColor.vars.currColor = [127, 127, 127];
					apps.settings.vars.screensavers.randomColor.vars.canRun = 1;
					getId('screensaverLayer').style.transition = 'background-color 6s';
					getId('screensaverLayer').style.transitionTimingFunction = 'linear';
					requestAnimationFrame(apps.settings.vars.screensavers.randomColor.vars.setColor);
				},
				end: function() {
					apps.settings.vars.screensavers.randomColor.vars.canRun = 0;
					getId('screensaverLayer').style.backgroundColor = '';
					getId('screensaverLayer').style.transition = '';
					getId('screensaverLayer').style.transitionTimingFunction = 'linear';
				},
				vars: {
					currColor: [127, 127, 127],
					setColor: function() {
						if (apps.settings.vars.screensavers.randomColor.vars.canRun) {
							apps.settings.vars.screensavers.randomColor.vars.currColor[0] = Math.floor(Math.random() * 256);
							apps.settings.vars.screensavers.randomColor.vars.currColor[1] = Math.floor(Math.random() * 256);
							apps.settings.vars.screensavers.randomColor.vars.currColor[2] = Math.floor(Math.random() * 256);
							getId('screensaverLayer').style.backgroundColor = 'rgb(' + apps.settings.vars.screensavers.randomColor.vars.currColor[0] + ',' + apps.settings.vars.screensavers.randomColor.vars.currColor[1] + ',' + apps.settings.vars.screensavers.randomColor.vars.currColor[2] + ')';
							lastPageX = Math.round(Math.random() * parseInt(getId('monitor').style.width) * 0.8 + parseInt(getId('monitor').style.width) * 0.1);
							lastPageY = Math.round(Math.random() * parseInt(getId('monitor').style.height) * 0.8 + parseInt(getId('monitor').style.height) * 0.1);
							setTimeout(apps.settings.vars.screensavers.randomColor.vars.setColor, 6000);
						}
					},
					canRun: 0
				}
			},
			wikiRandom: {
				name: "Random Wikipedia Page",
				selected: function() {
					apps.prompt.vars.confirm('Show the text "aOS ScreenSaver" on your wikipedia page?', ['No', 'Yes'], apps.settings.vars.screensavers.wikiRandom.vars.setSetting, 'Random Wikipedia ScreenSaver');
				},
				start: function() {
					apps.settings.vars.screensavers.wikiRandom.vars.canRun = 1;
					apps.settings.vars.screensavers.wikiRandom.vars.newPage();
				},
				end: function() {
					apps.settings.vars.screensavers.wikiRandom.vars.canRun = 0;
				},
				vars: {
					newPage: function() {
						if (apps.settings.vars.screensavers.wikiRandom.vars.canRun) {
							getId('screensaverLayer').innerHTML = '';
							if (ufload("aos_system/screensaver/wikirandom/logo_enabled") === '0') {
								getId('screensaverLayer').innerHTML = '<iframe src="https://en.wikipedia.org/wiki/Special:Random" style="pointer-events:none;border:none;width:100%;height:100%;"></iframe>';
							} else {
								getId('screensaverLayer').innerHTML = '<iframe src="https://en.wikipedia.org/wiki/Special:Random" style="pointer-events:none;border:none;width:100%;height:100%;"></iframe><div style="top:10px;right:200px;font-size:108px;color:#557;font-family:W95FA"><img src="appicons/ds/aOS.png" style="width:128px;height:128px"><i>Screensaver</i></div>';
							}
							setTimeout(apps.settings.vars.screensavers.wikiRandom.vars.canRun, 180000);
						}
					},
					setSetting: function (btn) {
						ufsave('aos_system/screensaver/wikirandom/logo_enabled', String(btn));
					}
				}
			}
		},
		scnsavList: '',
		grabScreensavers: function() {
			this.scnsavList = '';
			for (let item in this.screensavers) {
				this.scnsavList += '<button onclick="apps.settings.vars.setScreensaver(\'' + item + '\')">' + this.screensavers[item].name + '</button> ';
			}
			return this.scnsavList;
		},
		setScreensaverTime: function (newTime) {
			this.screensaverTime = newTime;
			ufsave("aos_system/screensaver/idle_time", this.screensaverTime);
		},
		setScreensaver: function (type) {
			this.currScreensaver = type;
			this.screensavers[type].selected();
			ufsave("aos_system/screensaver/selected_screensaver", this.currScreensaver);
		},
		currWinColor: "rgba(150, 150, 200, 0.5)",
		currWinBlend: "screen",
		currWinblurRad: "5",
		isAero: 0,
		sB: function (nosave) {
			perfStart('settings');
			getId('aOSloadingBg').style.backgroundImage = "url(" + getId('bckGrndImg').value + ")";
			getId("monitor").style.backgroundImage = "url(" + getId("bckGrndImg").value + ")";
			getId("bgSizeElement").src = getId("bckGrndImg").value;
			if (this.isAero) {
				this.tempArray = document.getElementsByClassName("winAero");
				for (var elem = 0; elem < this.tempArray.length; elem++) {
					this.tempArray[elem].style.backgroundImage = "url(" + getId("bckGrndImg").value + ")";
				}
			}
			if (!nosave) {
				ufsave("aos_system/desktop/background_image", getId("bckGrndImg").value);
			}
			try {
				updateBgSize();
			} catch (err) {

			}
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
				if (!nosave) ufsave("aos_system/windows/blur_enabled", "0");
			} else {
				if (this.isBackdrop) this.togBackdropFilter(nosave);
				this.tempArray = document.getElementsByClassName("winAero");
				for (var elem = 0; elem < this.tempArray.length; elem++) {
					this.tempArray[elem].style.backgroundImage = getId("monitor").style.backgroundImage;
					this.tempArray[elem].style.backgroundBlendMode = this.currWinBlend;
					this.tempArray[elem].style.filter = "blur(" + this.currWinblurRad + "px)";
					this.tempArray[elem].style.webkitFilter = "blur(" + this.currWinblurRad + "px)";
				}
				this.isAero = 1;
				if (!nosave) ufsave("aos_system/windows/blur_enabled", "1");
			}
			d(1, perfCheck('settings') + '&micro;s to toggle windowblur');
		},
		isBackdrop: 1,
		dispMapEffect: '',
		togDispMap: function (nosave) {
			if (this.dispMapEffect) {
				this.dispMapEffect = "";
				if (!nosave) ufsave("aos_system/windows/distort_enabled", "0");
			} else {
				this.dispMapEffect = " url(#svgblur)";
				if (!nosave) ufsave("aos_system/windows/distort_enabled", "1");
			}
			if (this.isBackdrop) {
				this.togBackdropFilter(1);
				this.togBackdropFilter(1);
			}
		},
		togBackdropFilter: function (nosave) {
			perfStart('settings');
			if (this.isBackdrop) {
				this.tempArray = document.getElementsByClassName("window");
				for (var elem = 0; elem < this.tempArray.length; elem++) {
					this.tempArray[elem].style.webkitBackdropFilter = 'none';
					this.tempArray[elem].style.backdropFilter = 'none';
					getId(this.tempArray[elem].id.substring(0, this.tempArray[elem].id.length - 4) + "_img").style.backgroundPosition = "";
				}
				getId('taskbar').style.webkitBackdropFilter = 'none';
				getId('taskbar').style.backdropFilter = 'none';
				getId("tskbrBimg").style.backgroundPosition = "";
				getId('ctxMenu').classList.remove('backdropFilterCtxMenu');
				this.isBackdrop = 0;
				if (!nosave) ufsave("aos_system/windows/backdropfilter_blur", "0");
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
				if (!nosave) ufsave("aos_system/windows/backdropfilter_blur", "1");
			}
			d(1, perfCheck('settings') + '&micro;s to toggle backdrop filter');
		},
		setWinColor: function (nosave, newcolor) {
			perfStart('settings');
			if (newcolor) {
				this.currWinColor = newcolor;
			} else {
				this.currWinColor = getId("STNwinColorInput").value;
			}
			this.tempArray = document.getElementsByClassName("winAero");
			for (let elem = 0; elem < this.tempArray.length; elem++) {
				this.tempArray[elem].style.backgroundColor = this.currWinColor;
			}
			if (!nosave) ufsave("aos_system/windows/border_color", this.currWinColor);
			d(1, perfCheck('settings') + '&micro;s to set window color');
		},
		setAeroRad: function (nosave) {
			perfStart('settings');
			this.currWinblurRad = getId("STNwinblurRadius").value;
			getId("svgDisplaceMap").setAttribute("scale", this.currWinblurRad);
			if (this.isAero) {
				for (var elem = 0; elem < this.tempArray.length; elem++) {
					this.tempArray = document.getElementsByClassName("winAero");
					this.tempArray[elem].style.webkitFilter = "blur(" + this.currWinblurRad + "px)";
					this.tempArray[elem].style.filter = "blur(" + this.currWinblurRad + "px)";
				}
				getId("tskbrAero").style.webkitFilter = "blur(" + this.currWinblurRad + "px)";
				getId("tskbrAero").style.filter = "blur(" + this.currWinblurRad + "px)";
			}
			if (this.isBackdrop) {
				this.tempArray = document.getElementsByClassName("window");
				for (var elem = 0; elem < this.tempArray.length; elem++) {
					this.tempArray[elem].style.webkitBackdropFilter = "blur(" + this.currWinblurRad + "px)" + this.dispMapEffect;
					this.tempArray[elem].style.backdropFilter = "blur(" + this.currWinblurRad + "px)" + this.dispMapEffect;
				}
				getId("taskbar").style.webkitBackdropFilter = "blur(" + this.currWinblurRad + "px)" + this.dispMapEffect;
				getId("taskbar").style.backdropFilter = "blur(" + this.currWinblurRad + "px)" + this.dispMapEffect;
			}
			if (!nosave) {
				ufsave("aos_system/windows/blur_radius", this.currWinblurRad);
			}
			d(1, perfCheck('settings') + '&micro;s to set windowblur radius');
		},
		winFadeDistance: '0.5',
		setFadeDistance: function (newDist, nosave) {
			this.winFadeDistance = newDist;
			for (let app in apps) {
				if (getId('win_' + apps[app].objName + '_top').style.opacity !== "1") {
					getId('win_' + apps[app].objName + '_top').style.transform = 'scale(' + newDist + ')';
					getId('win_' + apps[app].objName + '_top').style.opacity = '0';
				}
			}
			if (!nosave) ufsave("aos_system/windows/fade_distance", newDist);
		},
		reqFullscreen: function() {
			getId("monitor").requestFullscreen();
		},
		endFullscreen: function() {
			document.exitFullscreen();
		},
		tempchKey: '',
		tempchPass: '',
		changeKey: function() {
			apps.prompt.vars.prompt('What is the key of your target aOS system?<br>Leave blank to cancel.<br>Make sure to leave a password on your current system or you may not be able to get back to it.', 'Submit', function (tmpChKey) {
				apps.settings.vars.tempchKey = tmpChKey;
				if (apps.settings.vars.tempchKey !== '') {
					apps.prompt.vars.prompt('What is the password of your target aOS system? You still have a chance to cancel, by leaving the field blank.<br>You may be asked to log in again afterwards.', 'Submit', function (tmpChPass) {
						apps.settings.vars.tempchPass = tmpChPass;
						if (apps.settings.vars.tempchPass !== '') {
							var currDate = new Date();
							currDate.setTime(currDate.getTime() + (10000));
							document.cookie = 'changingKey=true;expires=' + currDate.toUTCString();
							window.location.replace('?changeKey=' + apps.settings.vars.tempchKey + '&changePass=' + apps.settings.vars.tempchPass);
						} else {
							apps.prompt.vars.alert('aOS-swap is cancelled.', 'Phew.', function() {}, 'Settings');
						}
					}, 'Settings', true);
				} else {
					apps.prompt.vars.alert('aOS-swap is cancelled.', 'Phew.', function() {}, 'Settings');
				}
			}, 'Settings');
		},
		shutDown: function (arg, logout) {
			if (arg === 'restart') {
				apps.prompt.vars.confirm('Are you sure you wish to restart aOS?', ['No, Stay On', 'Yes, Restart'], function (btn) {
					if (btn) {
						getId('aOSisLoading').style.opacity = '0';
						getId('aOSloadingBg').style.opacity = '0';
						getId('aOSisLoading').style.transition = '1s';
						getId('aOSisLoading').style.display = 'block';
						getId('aOSloadingBg').style.display = 'block';
						window.shutDownPercentComplete = 0;
						window.shutDownTotalPercent = 1;
						getId('aOSisLoading').innerHTML = '<div id="aOSisLoadingDiv"><h1>Restarting aOS</h1><hr><div id="aOSloadingInfoDiv"><div id="aOSloadingInfo" class="liveElement" data-live-eval="shutDownPercentComplete / shutDownTotalPercent * 100 + \'%\'" data-live-target="style.width">Shutting down...</div></div></div>';
						getId('aOSisLoading').classList.remove('cursorLoadDark');
						getId('aOSisLoading').classList.add('cursorLoadLight');
						requestAnimationFrame(function() {
							getId('aOSisLoading').style.opacity = '1';
							getId('aOSloadingBg').style.opacity = '1';
						});
						window.setTimeout(function() {
							getId('aOSisLoading').classList.remove('cursorLoadLight');
							getId('aOSisLoading').classList.add('cursorLoadDark');
							shutDownPercentComplete = codeToRun.length;
							for (var app in apps) {
								c(function (args) {
									m('THERE WAS AN ERROR SHUTTING DOWN THE APP ' + args + '. SHUTDOWN SHOULD CONTINUE WITH NO ISSUE.');
									shutDownPercentComplete++;
									apps[args].signalHandler('shutdown');
								}, app);
							}
							shutDownTotalPercent = codeToRun.length - shutDownPercentComplete;
							shutDownPercentComplete = 0;
							c(function() {
								getId('aOSisLoading').innerHTML = '<div id="aOSisLoadingDiv"><h1>Restarting aOS</h1><hr><div id="aOSloadingInfoDiv"><div id="aOSloadingInfo" class="liveElement" data-live-eval="shutDownPercentComplete / shutDownTotalPercent * 100 + \'%\'" data-live-target="style.width">Goodbye!</div></div></div>';
								if (logout) {
									document.cookie = "logintoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
								}
								window.location = 'blackScreen.html#restart-beta';
							});
						}, 1005);
					}
				}, 'aOS');
			} else {
				apps.prompt.vars.confirm('Are you sure you wish to shut down aOS?', ['No, Stay On', 'Yes, Shut Down'], function (btn) {
					if (btn) {
						getId('aOSisLoading').style.opacity = '0';
						getId('aOSloadingBg').style.opacity = '0';
						getId('aOSisLoading').style.transition = '1s';
						getId('aOSisLoading').style.display = 'block';
						getId('aOSloadingBg').style.display = 'block';
						window.shutDownPercentComplete = 0;
						window.shutDownTotalPercent = 1;
						getId('aOSisLoading').innerHTML = '<div id="aOSisLoadingDiv"><h1>Shutting Down aOS</h1><hr><div id="aOSloadingInfoDiv"><div id="aOSloadingInfo" class="liveElement" data-live-eval="shutDownPercentComplete / shutDownTotalPercent * 100 + \'%\'" data-live-target="style.width">Shutting down...</div></div></div>';
						getId('aOSisLoading').classList.remove('cursorLoadDark');
						getId('aOSisLoading').classList.add('cursorLoadLight');
						requestAnimationFrame(function() {
							getId('aOSisLoading').style.opacity = '1';
							getId('aOSloadingBg').style.opacity = '1';
						});
						window.setTimeout(function() {
							getId('aOSisLoading').classList.remove('cursorLoadLight');
							getId('aOSisLoading').classList.add('cursorLoadDark');
							shutDownPercentComplete = codeToRun.length;
							for (var app in apps) {
								c(function (args) {
									m('THERE WAS AN ERROR SHUTTING DOWN THE APP ' + args + '. SHUTDOWN SHOULD CONTINUE WITH NO ISSUE.');
									shutDownPercentComplete++;
									apps[args].signalHandler('shutdown');
								}, app);
							}
							shutDownTotalPercent = codeToRun.length - shutDownPercentComplete;
							shutDownPercentComplete = 0;
							c(function() {
								getId('aOSisLoading').innerHTML = '<div id="aOSisLoadingDiv"><h1>Shutting Down aOS</h1><hr><div id="aOSloadingInfoDiv"><div id="aOSloadingInfo" class="liveElement" data-live-eval="shutDownPercentComplete / shutDownTotalPercent * 100 + \'%\'" data-live-target="style.width">Goodbye!</div></div></div>';
								if (logout) {
									document.cookie = "logintoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
								}
								window.location = 'blackScreen.html#beta';
							});
						}, 1005);
					}
				}, 'aOS');
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
					if (localStorage.getItem("askedPassword") !== "1" && !(typeof USERFILES.aOSpassword === "string")) {
						window.setTimeout(function() {
							if (!(typeof USERFILES.aOSpassword === "string")) {
								apps.prompt.vars.notify("Please set a password on your account in Settings to protect it.", ["Set Password", "Cancel"], function (btn) {
									if (btn === 0) {
										openapp(apps.settings, "dsktp");
										apps.settings.vars.showMenu(apps.settings.vars.menus.info);
									} else {
										apps.prompt.vars.notify("In the future, you can go to Settings > Information to set a password on your account.", ["Okay"], function() {}, 'AaronOS', 'appicons/ds/aOS.png');
									}
								}, 'AaronOS', 'appicons/ds/aOS.png');
								localStorage.setItem("askedPassword", "1");
							}
						}, 600000);
					}
					window.setTimeout(function() {
						getId('aOSloadingInfo').innerHTML = 'Welcome.';
						getId('desktop').style.display = '';
						getId('taskbar').style.display = '';
					}, 0);
					window.setTimeout(function() {
						getId('aOSisLoading').style.opacity = 0;
						getId('aOSloadingBg').style.opacity = 0;
					}, 5);
					window.setTimeout(function() {
						getId('aOSisLoading').style.display = 'none';
						getId('aOSisLoading').innerHTML = '';
						getId('aOSloadingBg').style.display = 'none';
					}, 1005);
					window.setTimeout(function() {
						openapp(apps.settings, 'oldMenuHide');
						if (!safeMode) {
							if (ufload("aos_system/desktop/background_image")) {
								getId("bckGrndImg").value = ufload("aos_system/desktop/background_image");
								apps.settings.vars.sB(1);
							}
							if (ufload("aos_system/windows/backdropfilter_blur")) {
								if (ufload("aos_system/windows/backdropfilter_blur") === "0") {
									apps.settings.vars.togBackdropFilter(1);
								}
							} else if (!backdropFilterSupport) {
								apps.settings.vars.togBackdropFilter(1);
							}
							if (ufload("aos_system/windows/blur_radius")) {
								getId("STNwinblurRadius").value = ufload("aos_system/windows/blur_radius");
								apps.settings.vars.setAeroRad(1);
							}
							if (ufload("aos_system/taskbar/iconTitles")) {
								if (ufload("aos_system/taskbar/iconTitles") === "0") {
									apps.settings.vars.toggleIconTitles(1);
								}
							}
							if (ufload("aos_system/language")) {
								currentlanguage = ufload("aos_system/language");
							}
							if (ufload("aos_system/noraa/listen_enabled")) {
								if (ufload("aos_system/noraa/listen_enabled") === 1) {
									apps.settings.vars.togNoraListen(1);
								}
							}
							if (ufload("aos_system/noraa/listen_phrase")) {
								apps.settings.vars.currNoraPhrase = ufload("aos_system/noraa/listen_phrase");
							}
							if (ufload("aos_system/apps/settings/data_collect_enabled")) {
								apps.settings.vars.collectData = parseInt(ufload("aos_system/apps/settings/data_collect_enabled"), 10);
							}
							if (ufload("aos_system/noraa/adv_help_enabled")) {
								if (ufload("aos_system/noraa/adv_help_enabled") === "0") {
									apps.settings.vars.togNoraHelpTopics(1);
								}
							}
							if (ufload("aos_system/apps/settings/ctxmenu_two_fingers")) {
								if (ufload("aos_system/apps/settings/ctxmenu_two_fingers") === "1") {
									apps.settings.vars.togLongTap(1);
								}
							}
							apps.settings.vars.setScale(lfload("aos_system/apps/settings/ui_scale") || "1", 1);
							if (lfload("aos_system/apps/settings/saved_screen_res")) {
								apps.settings.vars.tempResArray = lfload("aos_system/apps/settings/saved_screen_res").split('/');
								fitWindowRes(apps.settings.vars.tempResArray[0], apps.settings.vars.tempResArray[1]);
							}
							if (ufload("aos_system/apps/settings/cors_proxy")) {
								apps.settings.vars.corsProxy = ufload("aos_system/apps/settings/cors_proxy");
							}
							if (ufload("aos_system/user_custom_style")) {
								getId('aosCustomStyle').innerHTML = ufload("aos_system/user_custom_style");
							}
							if (ufload("aos_system/windows/dark_mode")) {
								if (ufload("aos_system/windows/dark_mode") === "1") {
									apps.settings.vars.togDarkMode(1);
								}
							}
							if (lfload("aos_system/apps/settings/mobile_mode")) {
								apps.settings.vars.setMobileMode(lfload("aos_system/apps/settings/mobile_mode"), 1);
							}
							if (ufload("aos_system/desktop/background_fit")) {
								apps.settings.vars.setBgFit(ufload("aos_system/desktop/background_fit"), 1);
							}
							if (ufload("aos_system/screensaver/enabled")) {
								if (ufload("aos_system/screensaver/enabled") === "0") {
									apps.settings.vars.togScreensaver();
								}
							}
							if (ufload("aos_system/screensaver/idle_time")) {
								apps.settings.vars.screensaverTime = parseInt(ufload("aos_system/screensaver/idle_time"), 10);
							}
							if (ufload("aos_system/screensaver/selected_screensaver")) {
								apps.settings.vars.currScreensaver = ufload("aos_system/screensaver/selected_screensaver");
							}
							apps.settings.vars.screensaverTimer = window.setInterval(apps.settings.vars.checkScreensaver, 1000);
							if (ufload("aos_system/windows/fade_distance")) {
								setTimeout(function() {
									apps.settings.vars.setFadeDistance(ufload("aos_system/windows/fade_distance"), 1);
								}, 100);
							} else {
								setTimeout(function() {
									apps.settings.vars.setFadeDistance("0.5", 1);
								}, 1000);
							}
							if (typeof ufload("aos_system/taskbar/pinned_apps") === "string") {
								pinnedApps = JSON.parse(ufload("aos_system/taskbar/pinned_apps"));
								for (var i in pinnedApps) {
									getId('icn_' + pinnedApps[i]).style.display = 'inline-block';
								}
							}
						}

						// Google Play settings
						if (sessionStorage.getItem('GooglePlay') === 'true') {
							if (ufload("aos_system/windows/blur_enabled") !== "0") {
								apps.settings.vars.togAero(1);
							}

							try {
								if (localStorage.getItem('notifyGPlay') !== "1") {
									localStorage.setItem('notifyGPlay', "1");
									apps.prompt.vars.notify('Looks like you logged in through Google Play!<br>These settings were automatically set for you...<br><br>Performance Mode is on.<br>Screen scaling set to 1/2 if your device is 1080p or higher.<br>Tap a titlebar on a window, and then click somewhere else again, to move  a window. You can also resize them on the bottom-right corner.', [], function() {}, 'Google Play', 'appicons/ds/aOS.png');
								}
							} catch (localStorageNotSupported) {
								apps.prompt.vars.notify('Looks like you logged in through Google Play!<br>These settings were automatically set for you...<br><br>Performance Mode is on.<br>Screen scaling set to 1/2 if your device is 1080p or higher.<br>Tap a titlebar on a window, and then click somewhere else again, to move  a window. You can also resize them on the bottom-right corner.', [], function() {}, 'Google Play', 'appicons/ds/aOS.png');
							}
						}

						if (sessionStorage.getItem('fullscreen') === 'true') {
							setTimeout(apps.settings.vars.reqFullscreen, 5000);
						}
						if (!safeMode) {
							var dsktpIconFolder = ufload("aos_system/desktop/");
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
window.restartRequired = 0;
window.requireRestart = function() {
	if (restartRequired !== 1) {
		restartRequired = 1;
		apps.prompt.vars.notify("A change was made that requires a restart of AaronOS.", ["Restart", "Dismiss"], function (btn) {
			if (btn === 0) {
				apps.settings.vars.shutDown('restart');
			}
			restartRequired = 2;
		}, "AaronOS", "appicons/ds/aOS.png");
	}
}

} // End initial variable declaration