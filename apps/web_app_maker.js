const WebAppMaker = () => {

apps.webAppMaker = new Application({
	title: "Web App Maker",
	abbreviation: "WAP",
	codeName: "webAppMaker",
	image: "appicons/ds/APM.png",
	hideApp: 0,
	launchTypes: 1,
	main: function (launchtype) {
		if (launchtype === "dsktp") {
			this.appWindow.setCaption("Web App Maker");
			if (!this.appWindow.appIcon) {
				this.appWindow.setDims("auto", "auto", 1000, 600);
			}
		}
		getId('win_webAppMaker_html').style.overflow = 'auto';
		this.appWindow.setContent(
			'<h1>Web App Maker</h1>' +
			'<p>Use this tool to add a web page as an app for aOS.</p>' +
			'<h2>App API</h2>' +
			'<p>If you are writing an app designed specifically for aOS, there is an API available for you to use and allows you to interface with aOS.</p>' +
			'<p>Those of you wishing to develop your own app, the Documentation includes directions you should follow. If not, keep reading below.</p>' +
			'<button onclick="openapp(apps.devDocumentation, \'dsktp\');c(function(){toTop(apps.devDocumentation)})">API Documentation</button>' +
			'<h2>Getting Started</h2>' +
			'<p>First, we need a URL to the webpage you would like to add. It needs to follow a few rules first:</p>' +
			'<ul><li>Address must start with "https://" (not "http://")</li><li>Website must not block aOS from loading it.</li></ul>' +
			'<p>If you\'re unsure that your app follows the rules above, you can test it out here. Enter the URL into the box below and click "Test". The webpage should appear in the box underneath it.</p>' +
			'<input id="WAPtestURL" placeholder="https://example.com/webpage"> <button onclick="getId(\'WAPtestFrame\').src=getId(\'WAPtestURL\').value">Test</button><br>' +
			'<iframe id="WAPtestFrame" src=""></iframe>' +
			'<p>With that test out of the way, let\'s make our app.</p>' +
			'<hr>' +
			'<h2>Launch URL</h2>' +
			'<p>This is the URL the app will load when it launches. Be sure to test the URL above.</p>' +
			'<input id="WAPurl" placeholder="https://">' +
			'<hr>' +
			'<h2>App Name</h2>' +
			'<p>This will be the name displayed on the app\'s desktop icon and its window title bar.</p>' +
			'<img src="appmaker/title.png"><br>' +
			'<input id="WAPname">' +
			'<hr>' +
			'<h2>App Abbreviation</h2>' +
			'<p>This is the shortcut a user can type to get to the app quicker. This is required.</p>' +
			'<img src="appmaker/letters.png"><br>' +
			'<input id="WAPletters" placeholder="two to three letters">' +
			'<hr>' +
			'<h2>App Icon</h2>' +
			'<p>This is the URL to an image to use as your app\'s icon. It\'s best to use an image that is sized at a power of two (like 128x128 or 256x256). Any web-compatible image will work.</p>' +
			'<input id="WAPicon" placeholder="https://site.com/image.png">' +
			'<hr>' +
			'<h2>App Size</h2>' +
			'<p>This is the default width and height of your app\'s window when it is first opened.</p>' +
			'Width: <input id="WAPsizeX" placeholder="700" value="700"><br>' +
			'Height: <input id="WAPsizeY" placeholder="400" value="400">' +
			'<hr>' +
			'<h2>Install App</h2>' +
			'<p>This will add your app to your database. Next time you load aOS (or refresh the page), your app will be on the desktop.</p>' +
			'<button onclick="apps.webAppMaker.vars.addApp()">Install</button>' +
			'<p>To uninstall an app, you can delete its file in the file browser. Its file will be located in "aos_system/wap_apps".</p>'
		);
		this.appWindow.openWindow();
	},
	vars: {
		appInfo: 'Use this tool to convert any compatible webpage into an app for aOS!<br><br>If you need to delete an app made with this tool, then open its window, right click its title bar, and click "About App". There will be a file name in that info window. You can delete that file in File Manager -> USERFILES, and the app will be uninstalled.',
		ctxMenus: {
			defaultCtx: []
		},
		// TODO: actually follow the new frame ID system for frame manipulation
		actions: { // PERMISSIONS
			context: {
				/*
						position: [x, y],
						options: [
								{
										name: "Option 1",
										icon: "gear",
										disabled: "true",
								},
								{
										name: "Option 2",
										customIcon: "ctxMenu/beta/gear.png",
										sectionBegin: "true"
								},
						]
				*/
				// show custom menu
				menu: function (input, frame, frameOrigin) {
					var boundingRect = frame.getBoundingClientRect();
					var arrayToRender = [];
					for (var i in input.options) {
						var namePrefix = " ";
						if (input.options[i].disabled && input.options[i].sectionBegin) {
							namePrefix = "_";
						} else if (input.options[i].disabled) {
							namePrefix = "-";
						} else if (input.options[i].sectionBegin) {
							namePrefix = "+";
						}
						if (input.options[i].customImage) {
							arrayToRender.push([
								namePrefix + input.options[i].name,
								(() => {
									var j = i;
									return () => {
										apps.webAppMaker.vars.postReply({
											messageType: "response",
											content: j,
											conversation: input.conversation
										}, frameOrigin, frame.contentWindow);
									}
								})(),
								input.options[i].customImage
							]);
						} else if (input.options[i].image) {
							arrayToRender.push([
								namePrefix + input.options[i].name,
								(() => {
									var j = i;
									return () => {
										apps.webAppMaker.vars.postReply({
											messageType: "response",
											content: j,
											conversation: input.conversation
										}, frameOrigin, frame.contentWindow);
									}
								})(),
								"ctxMenu/beta/" + input.options[i].image + ".png"
							]);
						} else {
							arrayToRender.push([
								namePrefix + input.options[i].name,
								(() => {
									var j = i;
									return () => {
										apps.webAppMaker.vars.postReply({
											messageType: "response",
											content: j,
											conversation: input.conversation
										}, frameOrigin, frame.contentWindow);
									}
								})()
							]);
						}
					}
					ctxMenu(
						arrayToRender, 1, {
							pageX: (input.position || [0, 0])[0] + boundingRect.x,
							pageY: (input.position || [0, 0])[1] + boundingRect.y
						}, {}
					)
					return "APPMAKER_DO_NOT_REPLY";
				},
				// Show text-editing menu (copy, paste, etc)
				text_menu: function (input, frame, frameOrigin) {
					currentSelection = input.selectedText;
					showEditContext(null, 1, input.position, input.conversation, frame, frameOrigin, input.enablePaste);
					return "APPMAKER_DO_NOT_REPLY";
				}
			},
			fs: {
				read_uf: function (input) {
					return ufload(input.targetFile);
				},
				write_uf: function (input) {
					try {
						ufsave(input.targetFile, input.content);
						return "success";
					} catch (err) {
						return "error: " + err
					}
				},
				read_lf: function (input) {
					return lfload(input.targetFile);
				},
				write_lf: function (input) {
					try {
						lfsave(input.targetFile, input.content);
						return "success";
					} catch (err) {
						return "error: " + err
					}
				}
			},
			prompt: {
				alert: function (input, srcFrame, frameOrigin) {
					try {
						apps.prompt.vars.alert(input.content || "", input.button || "Okay", () => {
							apps.webAppMaker.vars.postReply({
								messageType: "response",
								content: true,
								conversation: input.conversation
							}, frameOrigin, srcFrame.contentWindow);
						}, (apps[srcFrame.getAttribute("data-parent-app")] || {
							appDesc: "An app"
						}).appDesc);
					} catch (err) {
						return false;
					}
					return "APPMAKER_DO_NOT_REPLY";
				},
				prompt: function (input, srcFrame, frameOrigin) {
					try {
						apps.prompt.vars.prompt(input.content || "", input.button || "Okay", (userText) => {
							apps.webAppMaker.vars.postReply({
								messageType: "response",
								content: userText,
								conversation: input.conversation
							}, frameOrigin, srcFrame.contentWindow);
						}, (apps[srcFrame.getAttribute("data-parent-app")] || {
							appDesc: "An app"
						}).appDesc);
					} catch (err) {
						return false;
					}
					return "APPMAKER_DO_NOT_REPLY";
				},
				confirm: function (input, srcFrame, frameOrigin) {
					try {
						apps.prompt.vars.confirm(input.content || "", input.buttons || ["Cancel", "Okay"], (userBtn) => {
							apps.webAppMaker.vars.postReply({
								messageType: "response",
								content: userBtn,
								conversation: input.conversation
							}, frameOrigin, srcFrame.contentWindow);
						}, (apps[srcFrame.getAttribute("data-parent-app")] || {
							appDesc: "An app"
						}).appDesc);
					} catch (err) {
						return false;
					}
					return "APPMAKER_DO_NOT_REPLY";
				},
				notify: function (input, srcFrame, frameOrigin) {
					try {
						apps.prompt.vars.notify(input.content || "", input.buttons || ["Cancel", "Okay"], (userBtn) => {
							apps.webAppMaker.vars.postReply({
								messageType: "response",
								content: userBtn,
								conversation: input.conversation
							}, frameOrigin, srcFrame.contentWindow);
						}, (apps[srcFrame.getAttribute("data-parent-app")] || {
							appDesc: "An app"
						}).appDesc, input.image || "");
					} catch (err) {
						return err;
					}
					return "APPMAKER_DO_NOT_REPLY";
				}
			},
			getstyle: {
				darkmode: function (input) {
					return !!darkMode;
				},
				customstyle: function (input) {
					var tempStyleLinks = [];
					var tempStyleElements = document.getElementsByClassName('customstyle_appcenter');
					for (var i = 0; i < tempStyleElements.length; i++) {
						if (tempStyleElements[i].tagName === "LINK") {
							tempStyleLinks.push([tempStyleElements[i].href, "link"]);
						} else if (tempStyleElements[i].tagName === "STYLE") {
							tempStyleLinks.push([tempStyleElements[i].innerHTML, "literal"]);
						}
					}
					return {
						customStyle: getId("aosCustomStyle").innerHTML,
						styleLinks: tempStyleLinks
					};
				}
			},
			readsetting: {

			},
			writesetting: {

			},
			js: {
				exec: function (input) {
					try {
						var inputtedFunction = new Function(input.content);
						return inputtedFunction();
					} catch (error) {
						return "Error: " + error;
					}
				}
			},
			appwindow: {
				set_caption: function (input, frame) {
					try {
						if (frame.getAttribute("data-parent-app")) {
							if (apps[frame.getAttribute("data-parent-app")]) {
								apps[frame.getAttribute("data-parent-app")].appWindow.setCaption(input.content);
								return true;
							}
							return false;
						}
						return false;
					} catch (err) {
						return false;
					}
				},
				disable_padding: function (input, frame) {
					try {
						if (frame.getAttribute("data-parent-app")) {
							if (apps[frame.getAttribute("data-parent-app")]) {
								apps[frame.getAttribute("data-parent-app")].appWindow.paddingMode(0);
								return true;
							}
							return false;
						}
						return false;
					} catch (err) {
						return false;
					}
				},
				enable_padding: function (input, frame) {
					try {
						if (frame.getAttribute("data-parent-app")) {
							if (apps[frame.getAttribute("data-parent-app")]) {
								apps[frame.getAttribute("data-parent-app")].appWindow.paddingMode(1);
								return true;
							}
							return false;
						}
						return false;
					} catch (err) {
						return false;
					}
				},
				open_window: function (input, frame) {
					try {
						if (frame.getAttribute("data-parent-app")) {
							if (apps[frame.getAttribute("data-parent-app")]) {
								apps[frame.getAttribute("data-parent-app")].appWindow.openWindow();
								toTop(apps[frame.getAttribute("data-parent-app")]);
								return true;
							}
							return false;
						}
						return false;
					} catch (err) {
						return false;
					}
				},
				close_window: function (input, frame) {
					try {
						if (frame.getAttribute("data-parent-app")) {
							if (apps[frame.getAttribute("data-parent-app")]) {
								apps[frame.getAttribute("data-parent-app")].signalHandler("close");
								return true;
							}
							return false;
						}
						return false;
					} catch (err) {
						return false;
					}
				},
				minimize: function (input, frame) {
					try {
						if (frame.getAttribute("data-parent-app")) {
							if (apps[frame.getAttribute("data-parent-app")]) {
								apps[frame.getAttribute("data-parent-app")].signalHandler("shrink");
								return true;
							}
							return false;
						}
						return false;
					} catch (err) {
						return false;
					}
				},
				maximize: function (input, frame) {
					try {
						if (frame.getAttribute("data-parent-app")) {
							if (apps[frame.getAttribute("data-parent-app")]) {
								if (!apps[frame.getAttribute("data-parent-app")].appWindow.fullscreen) {
									apps[frame.getAttribute("data-parent-app")].appWindow.toggleFullscreen();
								}
								return true;
							}
							return false;
						}
						return false;
					} catch (err) {
						return false;
					}
				},
				unmaximize: function (input, frame) {
					try {
						if (frame.getAttribute("data-parent-app")) {
							if (apps[frame.getAttribute("data-parent-app")]) {
								if (apps[frame.getAttribute("data-parent-app")].appWindow.fullscreen) {
									apps[frame.getAttribute("data-parent-app")].appWindow.toggleFullscreen();
								}
								return true;
							}
							return false;
						}
						return false;
					} catch (err) {
						return false;
					}
				},
				get_maximized: function (input, frame) {
					if (frame.getAttribute("data-parent-app")) {
						if (apps[frame.getAttribute("data-parent-app")]) {
							return !!apps[frame.getAttribute("data-parent-app")].appWindow.fullscreen;
						}
					}
				},
				set_dims: function (input, frame) {
					try {
						if (frame.getAttribute("data-parent-app")) {
							if (apps[frame.getAttribute("data-parent-app")]) {
								apps[frame.getAttribute("data-parent-app")].appWindow.setDims(
									input.x || "auto",
									input.y || "auto",
									input.width || apps[frame.getAttribute("data-parent-app")].appWindow.sizeH,
									input.height || apps[frame.getAttribute("data-parent-app")].appWindow.sizeV
								);
								return true;
							}
							return false;
						}
						return false;
					} catch (err) {
						return false;
					}
				},
				get_borders: function (input, frame) {
					if (mobileMode) {
						return {
							left: 0,
							top: 32,
							right: 0,
							bottom: 0
						};
					} else {
						return {
							left: apps.settings.vars.winBorder,
							top: 32,
							right: apps.settings.vars.winBorder,
							bottom: apps.settings.vars.winBorder
						};
					}
				},
				get_screen_dims: function (input, frame) {
					return {
						width: parseFloat(getId("monitor").style.width),
						height: parseFloat(getId("monitor").style.height)
					};
				},
				take_focus: function (input, frame) {
					if (apps[frame.getAttribute("data-parent-app")]) {
						toTop(apps[frame.getAttribute("data-parent-app")]);
						return true;
					} else {
						return false;
					}
				},
				block_screensaver: function (input, frame) {
					if (apps[frame.getAttribute("data-parent-app")]) {
						return blockScreensaver("webApp_" + frame.getAttribute("data-parent-app"));
					} else {
						return false;
					}
				},
				unblock_screensaver: function (input, frame) {
					if (apps[frame.getAttribute("data-parent-app")]) {
						return unblockScreensaver("webApp_" + frame.getAttribute("data-parent-app"));
					} else {
						return false;
					}
				}
			},
			bgservice: {
				set_service: function (input, frame) {
					if (!input.serviceURL) {
						return false;
					}
					if (frame.getAttribute("data-parent-app")) {
						if (getId("win_" + frame.getAttribute("data-parent-app") + "_bgservice")) {
							getId("win_" + frame.getAttribute("data-parent-app") + "_bgservice").src = input.serviceURL;
							return true;
						} else {
							var tempElement = document.createElement("iframe");
							tempElement.classList.add("winBgService");
							tempElement.id = "win_" + frame.getAttribute("data-parent-app") + "_bgservice";
							tempElement.setAttribute("data-parent-app", frame.getAttribute("data-parent-app"));
							getId("win_" + frame.getAttribute("data-parent-app") + "_top").appendChild(tempElement);
							tempElement.src = input.serviceURL;
							return true;
						}
					}
					return false;
				},
				exit_service: function (input, frame) {
					try {
						if (getId("win_" + frame.getAttribute("data-parent-app") + "_bgservice")) {
							getId("win_" + frame.getAttribute("data-parent-app") + "_top").removeChild(
								getId("win_" + frame.getAttribute("data-parent-app") + "_bgservice")
							);
							return true;
						}
						return true;
					} catch (err) {
						return false;
					}
				},
				check_service: function (input, frame) {
					if (getId("win_" + frame.getAttribute("data-parent-app") + "_bgservice")) {
						if (getId("win_" + frame.getAttribute("data-parent-app") + "_bgservice").src) {
							return getId("win_" + frame.getAttribute("data-parent-app") + "_bgservice").src;
						} else {
							return false;
						}
					} else {
						return false;
					}
				}
			}
		},
		actionNames: {
			fs: "Filesystem",
			prompt: "Prompt",
			readsetting: "Read Settings",
			writesetting: "Write Settings",
			js: "Execute JavaScript",
			context: "Context Menus",
			appwindow: "App Window",
			bgservice: "Background Service"
		},
		actionDesc: {
			fs: "access your files on aOS",
			prompt: "show prompts and notifications on aOS",
			readsetting: "read your settings on aOS",
			writesetting: "change your settings on aOS",
			js: "execute JavaScript code on aOS (DANGEROUS! MAKE SURE YOU COMPLETELY TRUST THE DEVELOPER!)",
			context: "use various context menus",
			appwindow: "manipulate its window and block the screensaver",
			bgservice: "run in the background"
		},
		commandDescriptions: {
			context: {
				menu: "Display context menus."
			},
			getstyle: {
				darkmode: "Get the state of dark mode.",
				customstyle: "Get the user's system theme."
			},
			fs: {
				read_uf: "Read and write USERFILES",
				read_lf: "Read and write LOCALFILES",
			},
			readsetting: {
				glbl: "Read your aOS settings."
			},
			writesetting: {
				glbl: "Change your aOS settings."
			},
			prompt: {
				alert: "Show an alert window to display information.",
				prompt: "Show a prompt window to ask for information.",
				confirm: "Show a confirm window to ask for a choice.",
				notify: "Show a notification and ask for a choice."
			},
			js: {
				exec: "Execute JavaScript on AaronOS. WARNING! This permission allows an app to do <i>anything</i> to your aOS system, including potentially performing actions on your behalf!"
			},
			appwindow: {
				set_caption: "Set the caption of the app window",
				disable_padding: "Toggle padding of window content",
				open_window: "Open the app window.",
				minimize: "Minimize the app window.",
				maximize: "Maximize the app window.",
				unmaximize: "Unmaximize the app window.",
				get_maximized: "Get window maximization state.",
				close_window: "Close the app window.",
				set_dims: "Set the size and position of the window.",
				block_screensaver: "Block the AaronOS screensaver.",
			},
			bgservice: {
				set_service: "Launch a background service that persists beyond its window being closed.",
				exit_service: "Close its background service.",
				check_service: "Check the state of its background service."
			}
		},
		trustedApps: {
			[window.location.origin]: {
				"fs": "true",
				"readsetting": "true",
				"writesetting": "true",
				"js": "true",
				"bgservice": "true"
			}
		},
		globalPermissions: {
			"getstyle": "true",
			"appwindow": "true",
			"prompt": "true",
			"context": "true"
		},
		updatePermissions: function() {
			ufsave("aos_system/apps/webAppMaker/trusted_apps", JSON.stringify(apps.webAppMaker.vars.trustedApps, null, 4));
		},
		reflectPermissions: function() {
			doLog("Initializing WAP Permission system...", "#ACE");
			if (ufload("aos_system/apps/webAppMaker/trusted_apps")) {
				try {
					var tempobj = JSON.parse(ufload("aos_system/apps/webAppMaker/trusted_apps"));
					var fail = 0;
					for (var i in tempobj) {
						for (var j in tempobj[i]) {
							if (tempobj[i][j] !== "true" && tempobj[i][j] !== "false") {
								fail = 1;
							}
						}
					}
					if (fail) {
						doLog("Failed Permissions: Not in correct format.", "#F00");
					} else {
						apps.webAppMaker.vars.trustedApps = tempobj;
					}
				} catch (err) {
					doLog("Failed Permissions: " + err, "#F00");
				}
			}
			doLog("Done.", "#ACE");
		},
		permissionsUsed: {},
		permissionsDenied: {},
		pageIDsToVerify: {},
		frameIDsToVerify: {},
		framesToVerify: {},
		verifiedFrames: {},
		recieveMessage: function (msg) {
			if (typeof msg.data === "string") {
				doLog("String-formatted request is no longer supported. " + (msg.origin !== "null" ? msg.origin : "*"), "#F00");
			} else {
				if (typeof msg.data === "object") {
					if (msg.data.messageType) {
						if (msg.data.messageType === "request") {
							var returnMessage = {
								messageType: "response",
								conversation: ""
							};

							if (!msg.data.hasOwnProperty("action")) {
								returnMessage = {
									messageType: "response",
									content: "Error - no action provided"
								};
								if (msg.data.conversation) {
									returnMessage.conversation = msg.data.conversation;
								}
								apps.webAppMaker.vars.postReply(returnMessage, (msg.origin !== "null" ? msg.origin : "*"), msg.source);
								return;
							}

							if (msg.data.action.split(":")[0] === "permission") {
								returnMessage = {
									messageType: "response",
									content: "asking: " + msg.data.action.split(":")[1]
								};
								if (msg.data.conversation) {
									returnMessage.conversation = msg.data.conversation;
								}

								if (msg.data.action.split(":").length > 1) {
									if (apps.webAppMaker.vars.globalPermissions.hasOwnProperty(msg.data.action.split(":")[1])) {
										returnMessage.content = "granted: " + msg.data.action.split(":")[1];
									} else if (apps.webAppMaker.vars.actions.hasOwnProperty(msg.data.action.split(":")[1])) {
										if (apps.webAppMaker.vars.trustedApps.hasOwnProperty((msg.origin !== "null" ? msg.origin : "*"))) {
											if (apps.webAppMaker.vars.trustedApps[(msg.origin !== "null" ? msg.origin : "*")].hasOwnProperty(msg.data.action.split(":")[1])) {
												if (apps.webAppMaker.vars.trustedApps[(msg.origin !== "null" ? msg.origin : "*")][msg.data.action.split(":")[1]] === "true") {
													returnMessage.content = "granted: " + msg.data.action.split(":")[1];
												}
											}
										}
									} else {
										returnMessage.content = "unknown"
									}
								}

								if (returnMessage.content.indexOf("asking") === 0) {
									if (msg.data.action.split(":").length === 1) {
										apps.webAppMaker.vars.askPermission(null, (msg.origin !== "null" ? msg.origin : "*"), msg.source, (msg.data.conversation || null));
									} else if (apps.webAppMaker.vars.actions.hasOwnProperty(msg.data.action.split(":")[1])) {
										apps.webAppMaker.vars.askPermission(msg.data.action.split(":")[1], (msg.origin !== "null" ? msg.origin : "*"), msg.source, (msg.data.conversation || null));
									}
								} else {
									apps.webAppMaker.vars.postReply(returnMessage, (msg.origin !== "null" ? msg.origin : "*"), msg.source);
								}
								return;
							}

							if (msg.data.action === "page_id:create") {
								var returnMessage = {
									messageType: "response",
									data: "pending",
									content: "pending"
								};
								if (msg.data.conversation) {
									returnMessage.conversation = msg.data.conversation;
								}
								apps.webAppMaker.vars.postReply(returnMessage, (msg.origin !== "null" ? msg.origin : "*"), msg.source);

								var loopMessage = {
									messageType: "response",
									data: [],
									conversation: "devTools_get_page_id"
								}
								var randomIDChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
								var tempStr = "";
								for (var i = 0; i < 16; i++) {
									tempStr += randomIDChars[Math.floor(Math.random() * randomIDChars.length)];
								}
								apps.webAppMaker.vars.pageIDsToVerify[tempStr] = msg.data.devToolsFrameID;
								apps.webAppMaker.vars.frameIDsToVerify[tempStr] = [];
								apps.webAppMaker.vars.framesToVerify[tempStr] = [];

								var allFramesOnPage = document.getElementsByTagName("iframe");
								for (var i = 0; i < allFramesOnPage.length; i++) {
									if (allFramesOnPage[i].getAttribute("data-parent-app")) {
										var tempStr2 = "";
										for (var j = 0; j < 16; j++) {
											tempStr2 += randomIDChars[Math.floor(Math.random() * randomIDChars.length)];
										}
										apps.webAppMaker.vars.frameIDsToVerify[tempStr].push(tempStr2);
										apps.webAppMaker.vars.framesToVerify[tempStr].push(allFramesOnPage[i])
										loopMessage.content = [tempStr, tempStr2];
										apps.webAppMaker.vars.postReply(loopMessage, "*", allFramesOnPage[i].contentWindow);
									}
								}
								return;
							}

							if (msg.data.action === "page_id:respond") {
								if (apps.webAppMaker.vars.frameIDsToVerify.hasOwnProperty(msg.data.content[0])) {
									if (apps.webAppMaker.vars.frameIDsToVerify[msg.data.content[0]].indexOf(msg.data.content[1]) > -1) {
										if (msg.data.devToolsFrameID === apps.webAppMaker.vars.pageIDsToVerify[msg.data.content[0]]) {
											// the correct frame is identified
											apps.webAppMaker.vars.verifiedFrames[apps.webAppMaker.vars.pageIDsToVerify[msg.data.content[0]]] = apps.webAppMaker.vars.framesToVerify[msg.data.content[0]][apps.webAppMaker.vars.frameIDsToVerify[msg.data.content[0]].indexOf(msg.data.content[1])];
											apps.webAppMaker.vars.verifiedFrames[apps.webAppMaker.vars.pageIDsToVerify[msg.data.content[0]]].setAttribute("data-frame-id", apps.webAppMaker.vars.pageIDsToVerify[msg.data.content[0]]);
											var returnMessage = {
												messageType: "response",
												content: true,
												data: true
											};
											if (msg.data.conversation) {
												returnMessage.conversation = "devTools_verify_page_id";
											}
											apps.webAppMaker.vars.postReply(returnMessage, (msg.origin !== "null" ? msg.origin : "*"), msg.source);
											delete apps.webAppMaker.vars.pageIDsToVerify[msg.data.content[0]];
											// clean up removed frames
											for (var i in apps.webAppMaker.vars.verifiedFrames) {
												if (!document.body.contains(apps.webAppMaker.vars.verifiedFrames[i])) {
													delete apps.webAppMaker.vars.verifiedFrames[i];
												}
											}
											return;
										}

										apps.webAppMaker.vars.framesToVerify[msg.data.content[0]].splice(apps.webAppMaker.vars.frameIDsToVerify[msg.data.content[0]].indexOf(msg.data.content[1]), 1);
										apps.webAppMaker.vars.frameIDsToVerify[msg.data.content[0]].splice(apps.webAppMaker.vars.frameIDsToVerify[msg.data.content[0]].indexOf(msg.data.content[1]), 1);
										if (apps.webAppMaker.vars.frameIDsToVerify[msg.data.content[0]].length === 0) {
											delete apps.webAppMaker.vars.frameIDsToVerify[msg.data.content[0]];
											delete apps.webAppMaker.vars.framesToVerify[msg.data.content[0]];
											if (apps.webAppMaker.vars.pageIDsToVerify.hasOwnProperty(msg.data.content[0])) {
												delete apps.webAppMaker.vars.pageIDsToVerify[msg.data.content[0]];
											}
										}
									}
								}
								var returnMessage = {
									messageType: "response",
									data: "ignore",
									content: "ignore"
								};
								if (msg.data.conversation) {
									returnMessage.conversation = msg.data.conversation;
								}
								apps.webAppMaker.vars.postReply(returnMessage, (msg.origin !== "null" ? msg.origin : "*"), msg.source);
							}

							if (!apps.webAppMaker.vars.actions.hasOwnProperty(msg.data.action.split(":")[0])) {
								returnMessage = {
									messageType: "response",
									content: "Error - permission not recognized"
								};
								if (msg.data.conversation) {
									returnMessage.conversation = msg.data.conversation;
								}
								apps.webAppMaker.vars.postReply(returnMessage, (msg.origin !== "null" ? msg.origin : "*"), msg.source);
								return;
							}

							if (!apps.webAppMaker.vars.permissionsUsed.hasOwnProperty((msg.origin !== "null" ? msg.origin : "*"))) {
								apps.webAppMaker.vars.permissionsUsed[(msg.origin !== "null" ? msg.origin : "*")] = {};
								apps.webAppMaker.vars.permissionsDenied[(msg.origin !== "null" ? msg.origin : "*")] = {};
							}

							if (!apps.webAppMaker.vars.trustedApps.hasOwnProperty((msg.origin !== "null" ? msg.origin : "*"))) {
								if (!apps.webAppMaker.vars.globalPermissions.hasOwnProperty(msg.data.action.split(":")[0])) {
									returnMessage = {
										messageType: "response",
										content: "Error - origin not recognized: " + (msg.origin !== "null" ? msg.origin : "*")
									};
									if (msg.data.conversation) {
										returnMessage.conversation = msg.data.conversation;
									}
									apps.webAppMaker.vars.postReply(returnMessage, (msg.origin !== "null" ? msg.origin : "*"), msg.source);
									if (!apps.webAppMaker.vars.permissionsDenied[(msg.origin !== "null" ? msg.origin : "*")].hasOwnProperty(msg.data.action.split(":")[0])) {
										apps.webAppMaker.vars.permissionsDenied[(msg.origin !== "null" ? msg.origin : "*")][msg.data.action.split(":")[0]] = 1;
									} else {
										apps.webAppMaker.vars.permissionsDenied[(msg.origin !== "null" ? msg.origin : "*")][msg.data.action.split(":")[0]]++;
									}
									return;
								}
							} else {
								if (
									!apps.webAppMaker.vars.trustedApps[(msg.origin !== "null" ? msg.origin : "*")].hasOwnProperty(msg.data.action.split(":")[0]) &&
									!apps.webAppMaker.vars.globalPermissions.hasOwnProperty(msg.data.action.split(":")[0])
								) {
									returnMessage = {
										messageType: "response",
										content: "Error - permission not granted by user"
									};
									if (msg.data.conversation) {
										returnMessage.conversation = msg.data.conversation;
									}
									apps.webAppMaker.vars.postReply(returnMessage, (msg.origin !== "null" ? msg.origin : "*"), msg.source);
									if (!apps.webAppMaker.vars.permissionsDenied[(msg.origin !== "null" ? msg.origin : "*")].hasOwnProperty(msg.data.action.split(":")[0])) {
										apps.webAppMaker.vars.permissionsDenied[(msg.origin !== "null" ? msg.origin : "*")][msg.data.action.split(":")[0]] = 1;
									} else {
										apps.webAppMaker.vars.permissionsDenied[(msg.origin !== "null" ? msg.origin : "*")][msg.data.action.split(":")[0]]++;
									}
									return;
								}
								if (apps.webAppMaker.vars.trustedApps[(msg.origin !== "null" ? msg.origin : "*")][msg.data.action.split(':')[0]] !== "true") {
									if (apps.webAppMaker.vars.globalPermissions.hasOwnProperty(msg.data.action.split(":")[0])) {
										if (apps.webAppMaker.vars.globalPermissions[msg.data.action.split(":")[0]] !== "true") {
											returnMessage = {
												messageType: "response",
												content: "Error - permission not granted by user"
											};
											if (msg.data.conversation) {
												returnMessage.conversation = msg.data.conversation;
											}
											apps.webAppMaker.vars.postReply(returnMessage, (msg.origin !== "null" ? msg.origin : "*"), msg.source);
											if (!apps.webAppMaker.vars.permissionsDenied[(msg.origin !== "null" ? msg.origin : "*")].hasOwnProperty(msg.data.action.split(":")[0])) {
												apps.webAppMaker.vars.permissionsDenied[(msg.origin !== "null" ? msg.origin : "*")][msg.data.action.split(":")[0]] = 1;
											} else {
												apps.webAppMaker.vars.permissionsDenied[(msg.origin !== "null" ? msg.origin : "*")][msg.data.action.split(":")[0]]++;
											}
											return;
										}
									} else {
										returnMessage = {
											messageType: "response",
											content: "Error - permission not granted by user"
										};
										if (msg.data.conversation) {
											returnMessage.conversation = msg.data.conversation;
										}
										apps.webAppMaker.vars.postReply(returnMessage, (msg.origin !== "null" ? msg.origin : "*"), msg.source);
										if (!apps.webAppMaker.vars.permissionsDenied[(msg.origin !== "null" ? msg.origin : "*")].hasOwnProperty(msg.data.action.split(":")[0])) {
											apps.webAppMaker.vars.permissionsDenied[(msg.origin !== "null" ? msg.origin : "*")][msg.data.action.split(":")[0]] = 1;
										} else {
											apps.webAppMaker.vars.permissionsDenied[(msg.origin !== "null" ? msg.origin : "*")][msg.data.action.split(":")[0]]++;
										}
										return;
									}
								}
							}

							if (!apps.webAppMaker.vars.permissionsUsed[(msg.origin !== "null" ? msg.origin : "*")].hasOwnProperty(msg.data.action.split(":")[0])) {
								apps.webAppMaker.vars.permissionsUsed[(msg.origin !== "null" ? msg.origin : "*")][msg.data.action.split(":")[0]] = 1;
							} else {
								apps.webAppMaker.vars.permissionsUsed[(msg.origin !== "null" ? msg.origin : "*")][msg.data.action.split(":")[0]]++;
							}

							returnMessage.messageType = "response";
							if (msg.data.conversation) {
								returnMessage.conversation = msg.data.conversation;
							}
							returnMessage.content = apps.webAppMaker.vars.actions[msg.data.action.split(":")[0]][msg.data.action.split(":")[1]](msg.data, (apps.webAppMaker.vars.verifiedFrames[msg.data.devToolsFrameID] || msg.data.devToolsFrameID), (msg.origin !== "null" ? msg.origin : "*"));
							if (returnMessage.content !== "APPMAKER_DO_NOT_REPLY") {
								apps.webAppMaker.vars.postReply(returnMessage, (msg.origin !== "null" ? msg.origin : "*"), msg.source);
							}
						} else {
							doLog("Incorrectly formatted postMessage from " + (msg.origin !== "null" ? msg.origin : "*") + ". Check Developer Tools.", "#ACE");
							console.log(msg.data);
						}
					} else {
						doLog("Incorrectly formatted postMessage from " + (msg.origin !== "null" ? msg.origin : "*") + ". Check Developer Tools.", "#ACE");
						console.log(msg.data);
					}
				} else {
					doLog("Incorrectly formatted postMessage from " + (msg.origin !== "null" ? msg.origin : "*") + ". Check Developer Tools.", "#ACE");
					console.log(msg.data);
				}
			}
		},
		postReply: function (message, origin, src) {
			src.postMessage(message, origin);
		},
		askPermission: function (permission, origin, source, conv) {
			if (permission) {
				apps.prompt.vars.confirm(origin + " is requesting permission to " + this.actionDesc[permission] + "." + "<br><br>Permission Code: " + permission, ['Deny', 'Allow'], (btn) => {
					if (!apps.webAppMaker.vars.trustedApps.hasOwnProperty(origin)) {
						apps.webAppMaker.vars.trustedApps[origin] = {};
					}
					apps.webAppMaker.vars.trustedApps[origin][permission] = "" + !!btn;
					apps.webAppMaker.vars.updatePermissions();
					if (btn) {
						apps.webAppMaker.vars.postReply({
							messageType: "response",
							conversation: (conv || ""),
							content: "granted"
						}, origin, source);
					} else {
						apps.webAppMaker.vars.postReply({
							messageType: "response",
							conversation: (conv || ""),
							content: "denied"
						}, origin, source);
					}
				}, 'AaronOS');
			} else {
				apps.prompt.vars.notify(origin + " is added to the permissions list.", 'Okay', () => {
					apps.webAppMaker.vars.trustedApps[origin] = {};
					apps.webAppMaker.vars.updatePermissions();
					apps.webAppMaker.vars.postReply({
						messageType: "response",
						conversation: (conv || ""),
						content: "granted"
					}, origin, source);
				}, 'AaronOS');
			}
		},
		sanitize: function (text) {
			return String(text).split("<").join("&lt;").split(">").join("&gt;");
		},
		numberOfApps: 0,
		addApp: function() {
			var tempObj = {
				url: getId('WAPurl').value,
				name: getId('WAPname').value,
				abbr: getId('WAPletters').value,
				icon: getId('WAPicon').value || undefined,
				sizeX: parseFloat(getId('WAPsizeX').value),
				sizeY: parseFloat(getId('WAPsizeY').value)
			};
			var invalid = 0;
			for (var app in apps) {
				if (apps[app].dsktpIcon === tempObj.abbr) {
					invalid = 1;
				}
			}
			if (!invalid) {
				ufsave('aos_system/wap_apps/webApp' + apps.webAppMaker.vars.numberOfApps, JSON.stringify(tempObj));
				apps.webAppMaker.vars.numberOfApps++;
				apps.prompt.vars.alert('Finished. Restart aOS to use your new app!', 'Okay', function() {}, 'Web App Maker');
			} else {
				apps.prompt.vars.alert('Failed! Your app\'s abbreviation is already in use on your system. Please choose a different one.', 'Okay', function() {}, 'Web App Maker');
			}
		},
		compileApp: function (str, appFileName) {
			tempObj = JSON.parse(str);
			apps['webApp' + apps.webAppMaker.vars.numberOfApps] = new Application({
				title: tempObj.name,
				abbreviation: tempObj.abbr,
				codeName: 'webApp' + apps.webAppMaker.vars.numberOfApps,
				image: tempObj.icon,
				hideApp: 0,
				main: function() {
					this.appWindow.setCaption(this.appDesc);
					if (!this.appWindow.appIcon) {
						this.appWindow.paddingMode(0);
						this.appWindow.setContent('<iframe data-parent-app="' + this.objName + '" style="width:100%;height:100%;border:none;" src="' + this.vars.appURL + '"></iframe>');
						this.appWindow.setDims("auto", "auto", this.vars.sizeX, this.vars.sizeY);
					}
					this.appWindow.openWindow();
				},
				vars: {
					appInfo: 'This app was made using the Web App Maker app.<br><br>Home URL:<br>' + tempObj.url + '<br><br>File path:<br>USERFILES/aos_system/wap_apps/' + appFileName + '<br><br>App object name:<br>apps.webApp' + apps.webAppMaker.vars.numberOfApps,
					appURL: tempObj.url,
					sizeX: tempObj.sizeX,
					sizeY: tempObj.sizeY
				}
			});
			apps.webAppMaker.vars.numberOfApps++;
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
					//doLog("Initializing WAP apps...", "#ACE");
					if (safeMode) {
						doLog("Failed initializing WAP apps because Safe Mode is enabled.", "#F00");
					} else {
						for (var file in ufload("aos_system/wap_apps")) {
							try {
								apps.webAppMaker.vars.compileApp(ufload("aos_system/wap_apps/" + file), file);
							} catch (err) {
								doLog("Failed initializing " + file + ":", "#F00");
								doLog(err, "#F00");
							}
						}
						// alphabetized array of apps
						appsSorted = [];
						for (var i in apps) {
							appsSorted.push(apps[i].appDesc.toLowerCase() + "|WAP_apps_sort|" + i);
						}
						appsSorted.sort();
						for (var i in appsSorted) {
							var tempStr = appsSorted[i].split("|WAP_apps_sort|");
							tempStr = tempStr[tempStr.length - 1];
							appsSorted[i] = tempStr;
						}
					}

					if (safeMode) {
						doLog("Failed WAP Message Listener because Safe Mode is enabled.", "#F00");
					} else {
						window.addEventListener("message", apps.webAppMaker.vars.recieveMessage);
					}

					if (ufload("aos_system/apps/webAppMaker/trusted_apps")) {
						try {
							var tempobj = JSON.parse(ufload("aos_system/apps/webAppMaker/trusted_apps"));
							var fail = 0;
							for (var i in tempobj) {
								for (var j in tempobj[i]) {
									if (tempobj[i][j] !== "true" && tempobj[i][j] !== "false") {
										fail = 1;
									}
								}
							}
							if (fail) {
								doLog("Failed Permissions: Not in correct format.", "#F00");
							} else {
								apps.webAppMaker.vars.trustedApps = tempobj;
							}
						} catch (err) {
							doLog("Failed initializing WAP Permissions: " + err, "#F00");
						}
					}
					break;
				case 'shutdown':

					break;
				default:
					doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'", "#F00");
		}
	}
});

} // End initial variable declaration