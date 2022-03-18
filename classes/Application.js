const defaultSignalHandler = function (signal) {
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
			return Boolean(this.appWindow.abbreviation);
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
};

class Application {
	constructor({
		name,
		title = "Application",
		abbreviation = "App",
		description = "No description available.",
		launchTypes = 0,
		main = function () {},
		signalHandler = defaultSignalHandler,
		vars = {},
		hideApp = 1,
		image = "logo.png",
		resizeable = true
	}) {
		// TODO: Finish figuring out this migration
		this.abbreviation = abbreviation;
		this.name = name;
		this.title = title;
		this.description = description;
		this.main = main;
		this.signalHandler = signalHandler;
		this.launchTypes = Boolean(launchTypes);
		this.vars = vars;
		this.resizeable = resizeable;
		this.appWindow = this.appWindow(abbreviation, image, name);
		if (typeof this.appWindow.image === "string") {
			this.appWindow.image = {
				// TODO: See if this is still necessary without Smart Icons
				foreground: this.appWindow.image,
			};
		}

		this.hideApp = hideApp;
		if (!this.hideApp) {
			new DesktopIcon(
				this.name,
				this.title,
				this.appWindow.image,
				["arg", 'openapp(apps[arg], "dsktp");'],
				[this.name],
				[
					"arg1",
					"arg2",
					"ctxMenu(baseCtx.appXXX, 1, event, [event, arg1, arg2]);",
				],
				[this.name, this.abbreviation]
			);
		}

		getId("desktop").innerHTML +=
			`<div class="window closedWindow" id="win_${name}_top">` +
			`<div class="winAero" id="win_${name}_aero"></div>` +
			`<div class="winBimg" id="win_${name}_img"></div>` +
			`<div class="winRes cursorOpenHand" id="win_${name}_size"></div>` +
			`<div class="winCap cursorOpenHand noselect" id="win_${name}_cap"></div>` +
			`<div class="winFld cursorPointer noselect" id="win_${name}_fold">^</div>` +
			`<div class="winHTML" id="win_${name}_html"></div>` +
			`<div class="winBig cursorPointer noselect" id="win_${name}_big">o</div>` +
			`<div class="winShrink cursorPointer noselect" id="win_${name}_shrink">v</div>` +
			`<div class="winExit cursorPointer noselect" id="win_${name}_exit">x</div>` +
			"</div>";

		if (this.appWindow.image) {
			getId("icons").innerHTML +=
				`<div class="icon cursorPointer" id="icn_${name}">` +
				'<div class="iconOpenIndicator"></div>' +
				buildSmartIcon(32, this.appWindow.image, "margin-left:6px") +
				`<div class="taskbarIconTitle" id="icntitle_${name}">` +
				title +
				"</div>" +
				"</div>";
		} else {
			getId("icons").innerHTML +=
				`<div class="icon cursorPointer" id="icn_${name}">` +
				'<div class="iconOpenIndicator"></div>' +
				`<div class="iconImg">${abbreviation}</div>` +
				"</div>";
		}

		if (this.resizeable) {
			getId("win_" + name + "_size").setAttribute(
				"onmousedown",
				"if(event.button!==2){toTop(apps." +
					name +
					");winres(event);}event.preventDefault();return false;"
			);
		}

		getId("win_" + name + "_cap").setAttribute(
			"onmousedown",
			"if(event.button!==2){toTop(apps." +
				name +
				");winmove(event);}event.preventDefault();return false;"
		);
		getId("icn_" + name).setAttribute(
			"onClick",
			`openapp(apps.${name}, function() {` +
				`if (apps.${name}.appWindow.abbreviation) { return "tskbr" }` +
				'else { return "dsktp" }' +
				"}())"
		);
		getId("win_" + name + "_top").setAttribute(
			"onClick",
			"toTop(apps." + name + ")"
		);

		if (name !== "startMenu") {
			const icon = getId("icn_" + name);
			icon.setAttribute(
				"oncontextmenu",
				`ctxMenu(baseCtx.icnXXX, 1, event, "${name}")`
			);
			icon.setAttribute(
				"onmouseenter",
				`if (apps.${name}.appWindow.abbreviation)` +
					`{ highlightWindow("${name}") }`
			);
			icon.setAttribute("onmouseleave", "highlightHide()");
		}

		getId("win_" + name + "_exit").setAttribute(
			"onClick",
			`apps.${name}.signalHandler('close');event.stopPropagation()`
		);
		getId("win_" + name + "_shrink").setAttribute(
			"onClick",
			`apps.${name}.signalHandler("shrink");event.stopPropagation()`
		);
		getId("win_" + name + "_big").setAttribute(
			"onClick",
			`apps.${name}.appWindow.toggleFullscreen()`
		);
		getId("win_" + name + "_fold").setAttribute(
			"onClick",
			`apps.${name}.appWindow.foldWindow()`
		);
		getId("win_" + name + "_cap").setAttribute(
			"oncontextmenu",
			`ctxMenu(baseCtx.winXXXc, 1, event, "${name}")`
		);
	}

	/*
		these are the elements that make up a window...
		pretend in this case the app is called "settings"
		anything below that says "settings" can be replaced with the name of your app

		div .window    #win_settings_top        Topmost window div, contains entire window
		div .winBimg   #win_settings_img        Texture of window borders
		div .winres    #win_settings_size       Handle to resize window
		div .winCap    #win_settings_cap        Window caption with title and icon
		div .winFld    #win_settings_fold       Button to fold window (compare to Shade in linux)
		div .winHTML   #win_settings_html       HTML content of window, this is where your actual content goes
		div .winBig    #win_settings_big        Button to maximize the window (make the window "big"ger)
		div .winShrink #win_settings_shrink     Button to shrink, or hide, the window
		div .winExit   #win_settings_exit       Button to close window
	*/
	appWindow(abbreviation, image, name) {
		// TODO: See if I can return implicitly
		return {
			abbreviation: abbreviation,
			name: name,
			image: image,
			windowX: 100,
			windowY: 50,
			windowH: 525,
			windowV: 300,
			fullscreen: 0,
			abbreviation: 0,
			dimsSet: 0,
			onTop: 0,
			alwaysOnTop: function (setTo) {
				if (setTo && !this.onTop) {
					getId("win_" + this.name + "_top").style.zIndex = "100";
					this.onTop = 1;
				} else if (!setTo && this.onTop) {
					getId("win_" + this.name + "_top").style.zIndex = "90";
					this.onTop = 0;
				}
			},
			paddingMode: function (mode) {
				if (mode) {
					getId("win_" + this.name + "_html").classList.remove("noPadding");
				} else {
					getId("win_" + this.name + "_html").classList.add("noPadding");
				}
			},
			setDims: function (xOff, yOff, xSiz, ySiz, ignoreDimsSet) {
				d(2, "Setting dims of window.");
				if (!this.fullscreen) {
					const windowCentered = [0, 0];
					if (xOff === "auto") {
						xOff = Math.round(
							parseInt(getId("desktop").style.width) / 2 - xSiz / 2
						);
						windowCentered[0] = 1;
					}
					if (yOff === "auto") {
						yOff = Math.round(
							parseInt(getId("desktop").style.height) / 2 - ySiz / 2
						);
						windowCentered[1] = 1;
					}
					xOff = Math.round(xOff);
					yOff = Math.round(yOff);
					if (this.windowX !== xOff) {
						getId("win_" + this.name + "_top").style.left = xOff + "px";
						this.windowX = Math.round(xOff);
					}
					if (this.windowY !== yOff) {
						getId("win_" + this.name + "_top").style.top =
							yOff * (yOff > -1) + "px";
						this.windowY = Math.round(yOff);
					}
					if (this.windowH !== xSiz) {
						getId("win_" + this.name + "_top").style.width = xSiz + "px";
						getId("win_" + this.name + "_aero").style.width =
							xSiz + 80 + "px";
						this.windowH = xSiz;
					}
					if (this.windowV !== ySiz) {
						if (!this.folded) {
							getId("win_" + this.name + "_top").style.height = ySiz + "px";
						}

						getId("win_" + this.name + "_aero").style.height =
							ySiz + 80 + "px";
						this.windowV = ySiz;
					}
					const aeroOffset = [0, -32];
					try {
						window.calcWindowblur(this.name);
					} catch (err) {
						getId("win_" + this.name + "_aero").style.backgroundPosition =
							-1 * xOff +
							40 +
							aeroOffset[0] +
							"px " +
							(-1 * (yOff * (yOff > -1)) + 40 + aeroOffset[1]) +
							"px";
					}

					if (typeof this.dimsSet === "function" && !ignoreDimsSet) {
						this.dimsSet();
					}
					if (
						!this.fullscreen &&
						((windowCentered[0] &&
							xSiz > parseInt(getId("desktop").style.width, 10)) ||
							(windowCentered[1] &&
								ySiz > parseInt(getId("desktop").style.height, 10)))
					) {
						this.toggleFullscreen();
					}
				}
			},
			openWindow: function () {
				this.abbreviation = 1;
				getId("win_" + this.name + "_top").classList.remove("closedWindow");
				getId("win_" + this.name + "_top").style.display = "block";
				getId("icn_" + this.name).style.display = "inline-block";
				getId("icn_" + this.name).classList.add("openAppIcon");
				getId("win_" + this.name + "_top").style.pointerEvents = "";

				requestAnimationFrame(
					function () {
						getId("win_" + this.name + "_top").style.transform = "scale(1)";
						getId("win_" + this.name + "_top").style.opacity = "1";
					}.bind(this)
				);
				setTimeout(
					function () {
						if (this.abbreviation) {
							getId("win_" + this.name + "_top").style.display = "block";
							getId("win_" + this.name + "_top").style.opacity = "1";
						}
					}.bind(this),
					300
				);
			},
			closeWindow: function () {
				this.abbreviation = 0;

				const top = getId("win_" + this.name + "_top");
				top.classList.add("closedWindow");
				top.style.transformOrigin = "";
				top.style.transform = `scale(${winFadeDistance})`;
				top.style.opacity = "0";
				top.style.pointerEvents = "none";

				setTimeout(
					function () {
						if (!this.abbreviation) {
							top.style.display = "none";
							top.style.width = "";
							top.style.height = "";
							this.windowH = -1;
							this.windowV = -1;
						}
					}.bind(this),
					300
				);

				getId("icn_" + this.name).style.display = "none";
				getId("icn_" + this.name).classList.remove("openAppIcon");
				this.fullscreen = 0;
				if (this.folded) {
					this.foldWindow();
				}
				toTop(
					{
						abbreviation: "CLOSING",
					},
					1
				);
			},
			closeIcon: function () {
				getId("icn_" + this.name).style.display = "none";
			},
			folded: 0,
			foldWindow: function () {
				if (this.folded) {
					getId("win_" + this.name + "_html").style.display = "block";
					getId("win_" + this.name + "_top").style.height =
						this.windowV + "px";
					this.folded = 0;
				} else {
					getId("win_" + this.name + "_html").style.display = "none";
					getId("win_" + this.name + "_top").style.height =
						32 + winBorder + "px";
					this.folded = 1;
				}
			},
			closeKeepTask: function () {
				if (this.name !== "startMenu") {
					console.log("closeKeepTask NOT start menu:", this.name);
					if (!mobileMode) {
						try {
							getId("win_" + this.name + "_top").style.transformOrigin =
								getId("icn_" + this.name).getBoundingClientRect().left -
								this.windowX +
								23 +
								"px " +
								(0 - this.windowY) +
								"px";
						} catch (err) {
							getId("win_" + this.name + "_top").style.transformOrigin =
								"50% -" + window.innerHeight + "px";
						}
					} else {
						try {
							getId("win_" + this.name + "_top").style.transformOrigin =
								getId("icn_" + this.name).getBoundingClientRect().left +
								23 +
								"px 0px";
						} catch (err) {
							getId("win_" + this.name + "_top").style.transformOrigin =
								"50% -" + window.innerHeight + "px";
						}
					}
					getId("win_" + this.name + "_top").style.transform = "scale(0.1)";
					getId("win_" + this.name + "_top").style.opacity = "0";
					setTimeout(
						function () {
							getId("win_" + this.name + "_top").style.display = "none";
						}.bind(this),
						300
					);
				} else {
					console.log("Should be hiding start menu...");
					getId("win_startMenu_top").style.display = "none";
				}

				setTimeout(
					"getId('icn_" + this.name + "').classList.remove('activeAppIcon')",
					0
				);
			},
			setCaption: function (newCap) {
				d(1, "Changing caption.");
				if (this.image) {
					getId("win_" + this.name + "_cap").innerHTML =
						buildSmartIcon(32, this.image) +
						'<div class="winCaptionTitle">' +
						newCap +
						"</div>";
				} else {
					getId("win_" + this.name + "_cap").innerHTML =
						'<div class="winCaptionTitle">' +
						`${this.abbreviation}|${newCap}` +
						"</div>";
				}
			},
			setContent: function (newHTML) {
				getId("win_" + this.name + "_html").innerHTML = newHTML;
			},
			toggleFullscreen: function () {
				d(1, "Setting Maximise.");
				if (this.fullscreen) {
					this.fullscreen = 0;
					getId("win_" + this.name + "_top").classList.remove(
						"maximizedWindow"
					);
				} else {
					this.fullscreen = 1;
					getId("win_" + this.name + "_top").classList.add(
						"maximizedWindow"
					);
				}
			},
		};
	}
}
