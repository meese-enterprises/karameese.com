const WebAppMaker = () => {

apps.webAppMaker = new Application({
	title: "Web App Maker",
	abbreviation: "WAP",
	codeName: "webAppMaker",
	image: "appicons/APM.png",
	hideApp: 0,
	launchTypes: 1,
	main: function (launchtype) {},
	vars: {
		appInfo: '',
		actions: {
			context: {
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
								"ctxMenu/" + input.options[i].image + ".png"
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
				darkmode: "Get the state of dark mode."
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
		postReply: function (message, origin, src) {
			src.postMessage(message, origin);
		},
	},
	signalHandler: function(signal) {
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

					if (ufload("system/apps/webAppMaker/trusted_apps")) {
						try {
							var tempobj = JSON.parse(ufload("system/apps/webAppMaker/trusted_apps"));
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