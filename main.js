/* global buildSmartIcon, getId, ufsave */

// skipcq JS-0128
const bootTime = new Date().getTime();
const websiteTitle = "KaraOS";
document.title = websiteTitle;

if (typeof console === "undefined") {
	console = {
		log: function () {
			/* IE compatibility because console doesn't exist */
		},
	};
}

// Substitute performance.now if not intact
if (window.performance === undefined) {
	window.performance = {
		now: function () {
			return new Date().getTime() * 1000;
		},
	};
} else if (window.performance.now === undefined) {
	window.performance.now = function () {
		return new Date().getTime() * 1000;
	};
}

// Approximately how long it took to load the page
const timeToPageLoad = Math.round(performance.now() * 10) / 10; // skipcq JS-0128

// See if animationframe is supported - if not, substitute it
if (window.requestAnimationFrame === undefined) {
	window.requestAnimationFrame = function (func) {
		window.setTimeout(func, 0);
	};
}

(function (win, doc) {
	// No need to polyfill
	if (win.addEventListener) return;

	function docHijack(p) {
		const old = doc[p];
		doc[p] = function (v) {
			return addListen(old(v));
		};
	}

	function addEvent(on, fn, self) {
		return (self = this).attachEvent("on" + on, function (e) {
			if (!e) e = win.event;
			e.preventDefault =
				e.preventDefault ||
				function () {
					e.returnValue = false;
				};
			e.stopPropagation =
				e.stopPropagation ||
				function () {
					e.cancelBubble = true;
				};
			fn.call(self, e);
		});
	}

	function addListen(obj, i) {
		if ((i = obj.length)) {
			while (i--) obj[i].addEventListener = addEvent;
		} else obj.addEventListener = addEvent;
		return obj;
	}

	addListen([doc, win]);
	if ("Element" in win) win.Element.prototype.addEventListener = addEvent;
	// IE8
	else {
		// IE < 8
		doc.attachEvent("onreadystatechange", function () {
			addListen(doc.all);
		}); // Make sure we also init at domReady
		docHijack("getElementsByTagName");
		docHijack("getElementById");
		docHijack("createElement");
		addListen(doc.all);
	}
})(window, document);

if (typeof document.getElementsByClassName === "undefined") {
	document.getElementsByClassName = function () {
		return [];
	};
}

// End of IE compatibility fixes

function doLog(msg, clr) {
	console.log("%c" + msg, "color:" + clr);
}

// 0 is smaller, 1 is same size, 2 is bigger
const winFadeDistance = 0;
const winBorder = 3;

const darkMode = false;
const darkSwitch = (light, dark) => (darkMode ? dark : light); // skipcq JS-0128
if (darkMode) {
	document.body.classList.add("darkMode");
} else {
	document.body.classList.remove("darkMode");
}

// Sanitize a string to make HTML safe
function cleanStr(str) {
	return str
		.split("&")
		.join("&amp;")
		.split("<")
		.join("&lt;")
		.split(">")
		.join("&gt;");
}

// Make sure monitor doesn't get scrolled away
function checkMonitorMovement() {
	getId("monitor").scrollTop = 0;
	getId("monitor").scrollLeft = 0;
	requestAnimationFrame(checkMonitorMovement);
}
requestAnimationFrame(checkMonitorMovement);

// Error handler itself
window.onerror = function (errorMsg, url, lineNumber) {
	const errorModule = module;
	try {
		doLog("");
		doLog("You found an error! " + randomPhrase, "#F00");
		doLog("");
		doLog("Error in " + url, "#F00");
		doLog("Module '" + errorModule + "' at [" + lineNumber + "]:", "#F00");
		doLog(errorMsg, "#F00");
		doLog("");
	} catch (err) {
		console.log("");
		console.error("Error in " + url);
		console.error("Module '" + module + "' at [" + lineNumber + "]:");
		console.error(errorMsg);
		console.log("");
	}
};

let modulelast = `init ${websiteTitle}`;
var module = modulelast;

// Changes the current module
function m(msg) {
	d(2, "Module changed: " + msg);
	if (module !== msg) {
		modulelast = module;
		module = msg;
		// Reset module to idle so it is ready for next one
		if (msg !== "unknown") {
			window.setTimeout(function () {
				m("unknown");
			}, 0);
		}
	}
}

// Dynamic debug logging
const dbgLevel = 0;
var d = function (level, message) {
	// Level must be higher than the debuglevel set by Settings in order to log
	if (level <= dbgLevel) {
		doLog('<span style="color:#80F">Dbg:</span> ' + message);
	}
};

// Performance-measuring functions
m("init performance measure");
const perfObj = {};

// Start measuring a certain performance block
function perfStart(name) {
	d(2, "Started Performance: " + name);
	perfObj[name] = [window.performance.now(), 0, 0];
	return Math.round(perfObj[name][0] * 1000);
}
// Check performance of a block
function perfCheck(name) {
	perfObj[name][1] = window.performance.now();
	perfObj[name][2] = perfObj[name][1] - perfObj[name][0];
	d(2, "Checked Performance: " + name);
	return Math.round(perfObj[name][2] * 1000);
}
// Start measuring boot time
perfStart("masterInit");

// this is where the user's files go
let USERFILES = [];

// Make the desktop invisible to speed up boot
getId("desktop").style.display = "none";
getId("taskbar").style.display = "none";

// Find client scrollbar size
m("init Scrollsize");
getId("findScrollSize").style.display = "none";
getId("icons").innerHTML = "";

// Live elements allow dynamic content to be placed on the page w/o manual updating
let liveElements = [];

// Checks for live elements
function checkLiveElements() {
	liveElements = document.getElementsByClassName("liveElement");
	for (const elem in liveElements) {
		if (elem === parseInt(elem)) {
			if (liveElements[elem].getAttribute("data-live-target") === null) {
				try {
					liveElements[elem].innerHTML = eval(
						liveElements[elem].getAttribute("data-live-eval")
					);
				} catch (err) {
					liveElements[elem].innerHTML = "LiveElement Error: " + err;
				}
			} else {
				try {
					eval(
						"liveElements[" +
							elem +
							"]." +
							liveElements[elem].getAttribute("data-live-target") +
							' = "' +
							eval(liveElements[elem].getAttribute("data-live-eval")) +
							'"'
					);
				} catch (err) {
					// continue regardless of error
				}
			}
		}
	}
	requestAnimationFrame(checkLiveElements);
}
requestAnimationFrame(checkLiveElements);

// Application class
m("init Application class");
const apps = {};
window.apps = apps;

let appPosX = 8;
let appPosY = 8;

// skipcq JS-0128
const Application = function (
	appIcon,
	appName,
	appDesc,
	handlesLaunchTypes,
	mainFunction,
	signalHandlerFunction,
	appVariables,
	keepOffDesktop,
	appPath,
	appImg,
	resizeable = true
) {
	try {
		if (typeof appIcon === "object") {
			if (Object.prototype.hasOwnProperty.call(appIcon, "resizeable")) {
				resizeable = appIcon.resizeable;
			}
			appImg = appIcon.image || "appicons/aOS.png";
			appPath = appIcon.codeName;
			keepOffDesktop =
				typeof appIcon.hideApp === "number" ? appIcon.hideApp : 1;
			appVariables = appIcon.vars || {};
			signalHandlerFunction =
				appIcon.signalHandler ||
				function (signal) {
					switch (signal) {
						case "forceclose":
							this.appWindow.closeWindow();
							this.appWindow.closeIcon();
							break;
						case "close":
							this.appWindow.closeWindow();
							setTimeout(
								function () {
									if (
										getId("win_" + this.objName + "_top").style.opacity === "0"
									) {
										this.appWindow.setContent("");
									}
								}.bind(this),
								300
							);
							break;
						case "checkrunning":
							return this.appWindow.appIcon ? 1 : 0;
						case "shrink":
							this.appWindow.closeKeepTask();
							break;
						case "USERFILES_DONE":
							break;
						default:
							doLog(
								"No case found for '" +
									signal +
									"' signal in app '" +
									this.dsktpIcon +
									"'",
								"#F00"
							);
					}
				};
			mainFunction = appIcon.main || function () {};
			handlesLaunchTypes = appIcon.launchTypes || 0;
			appName = appIcon.title || "Application";
			appDesc = appIcon.desc || "No description available.";
			appIcon = appIcon.abbreviation || "App";
		}

		// this used to be used in HTML elements but now is just an abbreviation
		this.dsktpIcon = appIcon;
		// now HTML elements match the codename of apps
		this.objName = appPath;
		this.appName = appName;
		this.appDesc = appDesc;
		this.main = mainFunction;
		this.signalHandler = signalHandlerFunction;
		this.launchTypes = handlesLaunchTypes ? 1 : 0;
		this.vars = appVariables;
		this.resizeable = resizeable;
		this.appWindow = {
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
			dsktpIcon: appIcon,
			objName: appPath,
			appImg: appImg,
			windowX: 100,
			windowY: 50,
			windowH: 525,
			windowV: 300,
			fullscreen: 0,
			appIcon: 0,
			dimsSet: 0,
			onTop: 0,
			alwaysOnTop: function (setTo) {
				if (setTo && !this.onTop) {
					getId("win_" + this.objName + "_top").style.zIndex = "100";
					this.onTop = 1;
				} else if (!setTo && this.onTop) {
					getId("win_" + this.objName + "_top").style.zIndex = "90";
					this.onTop = 0;
				}
			},
			paddingMode: function (mode) {
				if (mode) {
					getId("win_" + this.objName + "_html").classList.remove("noPadding");
				} else {
					getId("win_" + this.objName + "_html").classList.add("noPadding");
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
						getId("win_" + this.objName + "_top").style.left = xOff + "px";
						this.windowX = Math.round(xOff);
					}
					if (this.windowY !== yOff) {
						getId("win_" + this.objName + "_top").style.top =
							yOff * (yOff > -1) + "px";
						this.windowY = Math.round(yOff);
					}
					if (this.windowH !== xSiz) {
						getId("win_" + this.objName + "_top").style.width = xSiz + "px";
						getId("win_" + this.objName + "_aero").style.width =
							xSiz + 80 + "px";
						this.windowH = xSiz;
					}
					if (this.windowV !== ySiz) {
						if (!this.folded) {
							getId("win_" + this.objName + "_top").style.height = ySiz + "px";
						}

						getId("win_" + this.objName + "_aero").style.height =
							ySiz + 80 + "px";
						this.windowV = ySiz;
					}
					const aeroOffset = [0, -32];
					try {
						window.calcWindowblur(this.objName, 1);
					} catch (err) {
						getId("win_" + this.objName + "_aero").style.backgroundPosition =
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
				this.appIcon = 1;
				getId("win_" + this.objName + "_top").classList.remove("closedWindow");
				getId("win_" + this.objName + "_top").style.display = "block";
				getId("icn_" + this.objName).style.display = "inline-block";
				getId("icn_" + this.objName).classList.add("openAppIcon");
				getId("win_" + this.objName + "_top").style.pointerEvents = "";

				requestAnimationFrame(
					function () {
						getId("win_" + this.objName + "_top").style.transform = "scale(1)";
						getId("win_" + this.objName + "_top").style.opacity = "1";
					}.bind(this)
				);
				setTimeout(
					function () {
						if (this.appIcon) {
							getId("win_" + this.objName + "_top").style.display = "block";
							getId("win_" + this.objName + "_top").style.opacity = "1";
						}
					}.bind(this),
					300
				);
			},
			closeWindow: function () {
				this.appIcon = 0;
				getId("win_" + this.objName + "_top").classList.add("closedWindow");

				getId("win_" + this.objName + "_top").style.transformOrigin = "";
				getId(
					"win_" + this.objName + "_top"
				).style.transform = `scale(${winFadeDistance})`;
				getId("win_" + this.objName + "_top").style.opacity = "0";
				getId("win_" + this.objName + "_top").style.pointerEvents = "none";
				setTimeout(
					function () {
						if (!this.appIcon) {
							getId("win_" + this.objName + "_top").style.display = "none";
							getId("win_" + this.objName + "_top").style.width = "";
							getId("win_" + this.objName + "_top").style.height = "";
							this.windowH = -1;
							this.windowV = -1;
						}
					}.bind(this),
					300
				);

				getId("icn_" + this.objName).style.display = "none";
				getId("icn_" + this.objName).classList.remove("openAppIcon");
				this.fullscreen = 0;
				if (this.folded) {
					this.foldWindow();
				}
				toTop(
					{
						dsktpIcon: "CLOSING",
					},
					1
				);
			},
			closeIcon: function () {
				getId("icn_" + this.objName).style.display = "none";
			},
			folded: 0,
			foldWindow: function () {
				if (this.folded) {
					getId("win_" + this.objName + "_html").style.display = "block";
					getId("win_" + this.objName + "_top").style.height =
						this.windowV + "px";
					this.folded = 0;
				} else {
					getId("win_" + this.objName + "_html").style.display = "none";
					getId("win_" + this.objName + "_top").style.height =
						32 + winBorder + "px";
					this.folded = 1;
				}
			},
			closeKeepTask: function () {
				if (this.objName !== "startMenu") {
					if (!mobileMode) {
						try {
							getId("win_" + this.objName + "_top").style.transformOrigin =
								getId("icn_" + this.objName).getBoundingClientRect().left -
								this.windowX +
								23 +
								"px " +
								(0 - this.windowY) +
								"px";
						} catch (err) {
							getId("win_" + this.objName + "_top").style.transformOrigin =
								"50% -" + window.innerHeight + "px";
						}
					} else {
						try {
							getId("win_" + this.objName + "_top").style.transformOrigin =
								getId("icn_" + this.objName).getBoundingClientRect().left +
								23 +
								"px 0px";
						} catch (err) {
							getId("win_" + this.objName + "_top").style.transformOrigin =
								"50% -" + window.innerHeight + "px";
						}
					}
					getId("win_" + this.objName + "_top").style.transform = "scale(0.1)";
					getId("win_" + this.objName + "_top").style.opacity = "0";
					setTimeout(
						function () {
							getId("win_" + this.objName + "_top").style.display = "none";
						}.bind(this),
						300
					);
				} else {
					getId("win_" + this.objName + "_top").style.display = "none";
				}

				setTimeout(
					"getId('icn_" + this.objName + "').classList.remove('activeAppIcon')",
					0
				);
			},
			setCaption: function (newCap) {
				d(1, "Changing caption.");
				if (this.appImg) {
					getId("win_" + this.objName + "_cap").innerHTML =
						buildSmartIcon(32, this.appImg) +
						'<div class="winCaptionTitle">' +
						newCap +
						"</div>";
				} else {
					getId("win_" + this.objName + "_cap").innerHTML =
						'<div class="winCaptionTitle">' +
						this.dsktpIcon +
						"|" +
						newCap +
						"</div>";
				}
			},
			setContent: function (newHTML) {
				getId("win_" + this.objName + "_html").innerHTML = newHTML;
			},
			toggleFullscreen: function () {
				d(1, "Setting Maximise.");
				if (this.fullscreen) {
					this.fullscreen = 0;
					getId("win_" + this.objName + "_top").classList.remove(
						"maximizedWindow"
					);
				} else {
					this.fullscreen = 1;
					getId("win_" + this.objName + "_top").classList.add(
						"maximizedWindow"
					);
				}
			},
		};
		if (typeof this.appWindow.appImg === "string") {
			this.appWindow.appImg = {
				foreground: this.appWindow.appImg,
			};
		}

		this.keepOffDesktop = keepOffDesktop;
		if (!this.keepOffDesktop) {
			newDsktpIcon(
				appPath,
				appPath,
				null,
				this.appName,
				this.appWindow.appImg,
				["arg", 'openapp(apps[arg], "dsktp");'],
				[appPath],
				[
					"arg1",
					"arg2",
					"ctxMenu(baseCtx.appXXX, 1, event, [event, arg1, arg2]);",
				],
				[appPath, appIcon],
				1
			);
		}

		getId("desktop").innerHTML +=
			'<div class="window closedWindow" id="win_' +
			appPath +
			'_top">' +
			'<div class="winAero" id="win_' +
			appPath +
			'_aero"></div>' +
			'<div class="winBimg" id="win_' +
			appPath +
			'_img"></div>' +
			'<div class="winRes cursorOpenHand" id="win_' +
			appPath +
			'_size"></div>' +
			'<div class="winCap cursorOpenHand noselect" id="win_' +
			appPath +
			'_cap">' +
			"</div>" +
			'<div class="winFld cursorPointer noselect" id="win_' +
			appPath +
			'_fold">^' +
			"</div>" +
			'<div class="winHTML" id="win_' +
			appPath +
			'_html">' +
			"</div>" +
			'<div class="winBig cursorPointer noselect" id="win_' +
			appPath +
			'_big">o' +
			"</div>" +
			'<div class="winShrink cursorPointer noselect" id="win_' +
			appPath +
			'_shrink">v' +
			"</div>" +
			'<div class="winExit cursorPointer noselect" id="win_' +
			appPath +
			'_exit">x' +
			"</div></div>";
		if (this.appWindow.appImg) {
			getId("icons").innerHTML +=
				'<div class="icon cursorPointer" id="icn_' +
				appPath +
				'">' +
				'<div class="iconOpenIndicator"></div>' +
				buildSmartIcon(32, this.appWindow.appImg, "margin-left:6px") +
				'<div class="taskbarIconTitle" id="icntitle_' +
				appPath +
				'">' +
				appName +
				"</div>" +
				"</div>";
		} else {
			getId("icons").innerHTML +=
				'<div class="icon cursorPointer" id="icn_' +
				appPath +
				'">' +
				'<div class="iconOpenIndicator"></div>' +
				'<div class="iconImg">' +
				appIcon +
				"</div></div>";
		}

		if (this.resizeable) {
			getId("win_" + appPath + "_size").setAttribute(
				"onmousedown",
				"if(event.button!==2){toTop(apps." +
					appPath +
					");winres(event);}event.preventDefault();return false;"
			);
		}

		getId("win_" + appPath + "_cap").setAttribute(
			"onmousedown",
			"if(event.button!==2){toTop(apps." +
				appPath +
				");winmove(event);}event.preventDefault();return false;"
		);
		getId("icn_" + appPath).setAttribute(
			"onClick",
			"openapp(apps." +
				appPath +
				", function(){if(apps." +
				appPath +
				".appWindow.appIcon){return 'tskbr'}else{return 'dsktp'}}())"
		);
		getId("win_" + appPath + "_top").setAttribute(
			"onClick",
			"toTop(apps." + appPath + ")"
		);
		if (appPath !== "startMenu") {
			getId("icn_" + appPath).setAttribute(
				"oncontextmenu",
				"ctxMenu(baseCtx.icnXXX, 1, event, '" + appPath + "')"
			);
			getId("icn_" + appPath).setAttribute(
				"onmouseenter",
				"if(apps." +
					appPath +
					".appWindow.appIcon){highlightWindow('" +
					appPath +
					"')}"
			);
			getId("icn_" + appPath).setAttribute("onmouseleave", "highlightHide()");
		}
		getId("win_" + appPath + "_exit").setAttribute(
			"onClick",
			"apps." + appPath + ".signalHandler('close');event.stopPropagation()"
		);
		getId("win_" + appPath + "_shrink").setAttribute(
			"onClick",
			"apps." + appPath + ".signalHandler('shrink');event.stopPropagation()"
		);
		getId("win_" + appPath + "_big").setAttribute(
			"onClick",
			"apps." + appPath + ".appWindow.toggleFullscreen()"
		);
		getId("win_" + appPath + "_fold").setAttribute(
			"onClick",
			"apps." + appPath + ".appWindow.foldWindow()"
		);
		getId("win_" + appPath + "_cap").setAttribute(
			"oncontextmenu",
			"ctxMenu(baseCtx.winXXXc, 1, event, '" + appPath + "')"
		);
	} catch (err) {
		if (doLog) doLog(err, "#F00");
	}
};

// Desktop vars
const dsktp = {};
function newDsktpIcon(
	id,
	owner,
	position,
	title,
	icon,
	action,
	actionArgs,
	ctxAction,
	ctxActionArgs
) {
	if (!id) id = "uico_" + new Date().getTime();
	if (!title) {
		title = apps[owner] ? apps[owner].appName : "Icon";
	}
	if (!icon) {
		icon = apps[owner]
			? {
					...apps[owner].appWindow.appImg,
			  }
			: {
					...apps.startMenu.appWindow.appImg,
			  };
	}
	if (typeof icon === "string") {
		icon = { foreground: icon };
	}

	if (!action) {
		if (apps[owner]) {
			action = ["arg", 'openapp(apps[arg], "dsktp");'];
			actionArgs = [owner];
		} else {
			action = [
				'apps.prompt.vars.alert("This icon has no assigned action.", "Okay.", function(){}, "");',
			];
			actionArgs = [];
		}
	}

	if (typeof action === "string") action = [action];
	if (!actionArgs) actionArgs = [];
	if (!ctxAction) {
		if (apps[owner]) {
			ctxAction = [
				"arg1",
				"arg2",
				"ctxMenu(baseCtx.appXXX, 1, event, [event, arg1, arg2]);",
			];
			ctxActionArgs = [id, apps[owner].dsktpIcon];
		} else {
			ctxAction = [
				"arg1",
				'ctxMenu(baseCtx.appXXX, 1, event, [event, arg1, "site"]);',
			];
			ctxActionArgs = [id];
		}
	}

	if (typeof ctxAction === "string") ctxAction = [ctxAction];
	if (!ctxActionArgs) ctxActionArgs = [];
	dsktp[id] = {
		id: id,
		owner: owner,
		position: position,
		title: title,
		icon: icon,
		action: action,
		actionArgs: actionArgs || [],
		ctxAction: ctxAction,
		ctxActionArgs: ctxActionArgs || [],
	};
	if (getId("app_" + id)) {
		getId("desktop").removeChild(getId("app_" + id));
	}
	const tempIco = document.createElement("div");
	tempIco.classList.add("app");
	tempIco.classList.add("cursorPointer");
	tempIco.classList.add("noselect");
	tempIco.id = "app_" + id;
	tempIco.setAttribute("data-icon-id", id);
	tempIco.setAttribute(
		"onclick",
		'Function(...dsktp[this.getAttribute("data-icon-id")].action)(...dsktp[this.getAttribute("data-icon-id")].actionArgs)'
	);
	tempIco.setAttribute(
		"oncontextmenu",
		'Function(...dsktp[this.getAttribute("data-icon-id")].ctxAction)(...dsktp[this.getAttribute("data-icon-id")].ctxActionArgs)'
	);
	tempIco.innerHTML =
		'<div class="appIcon" id="ico_' +
		id +
		'" style="pointer-events:none">' +
		buildSmartIcon(64, icon) +
		"</div>" +
		'<div class="appName" id="dsc_' +
		id +
		'">' +
		title +
		"</div>";
	getId("desktop").appendChild(tempIco);
	arrangeDesktopIcons();
}

function arrangeDesktopIcons() {
	appPosX = 8;
	appPosY = 8;
	for (const ico in dsktp) {
		if (!dsktp[ico].position) {
			getId("app_" + ico).style.left = appPosX + "px";
			getId("app_" + ico).style.top = appPosY + "px";
			appPosY += 98;
			if (appPosY > parseInt(getId("monitor").style.height) - 138) {
				appPosY = 8;
				appPosX += 108;
			}
		} else {
			getId("app_" + ico).style.left = dsktp[ico].position[0] + "px";
			getId("app_" + ico).style.top = dsktp[ico].position[1] + "px";
		}
	}
}

FlowWidget();
NotificationsWidget();
TimeWidget();

/** Text-editing functionality */
// skipcq JS-0128
function showEditContext(event) {
	textEditorTools.tempvar = currentSelection.length === 0 ? "-" : " ";
	let canPasteHere = 0;
	if (
		(event.target.tagName === "INPUT" &&
			(event.target.getAttribute("type") === "text" ||
				event.target.getAttribute("type") === "password" ||
				event.target.getAttribute("type") === null)) ||
		event.target.tagName === "TEXTAREA"
	) {
		canPasteHere = 1;
	}
	textEditorTools.tmpGenArray = [
		[event.pageX, event.pageY, "ctxMenu/happy.png"],
		textEditorTools.tempvar +
			"Speak '" +
			currentSelection
				.substring(0, 5)
				.split("\n")
				.join(" ")
				.split("<")
				.join("&lt;")
				.split(">")
				.join("&gt;") +
			"...'",
		"textspeech('" +
			currentSelection
				.split("\n")
				.join("<br>")
				.split("\\")
				.join("\\\\")
				.split('"')
				.join("&quot;")
				.split("'")
				.join("&quot;")
				.split("<")
				.join("&lt;")
				.split(">")
				.join("&gt;") +
			"');getId('ctxMenu').style.display = 'none'",
	];
	if (currentSelection.length === 0) {
		textEditorTools.tempvar = "-";
		textEditorTools.tempvar2 = "_";
	} else {
		textEditorTools.tempvar = " ";
		textEditorTools.tempvar2 = "+";
	}
	textEditorTools.tmpGenArray.push(
		textEditorTools.tempvar2 +
			"Copy (" +
			cleanStr(currentSelection.substring(0, 5)) +
			"...)"
	);
	textEditorTools.tmpGenArray[0].push("ctxMenu/load.png");
	textEditorTools.tmpGenArray.push(
		"textEditorTools.copy();getId('ctxMenu').style.display = 'none'"
	);

	if (canPasteHere) {
		if (
			textEditorTools.clipboard.length === 0 ||
			typeof event.target.id !== "string" ||
			event.target.id === "" ||
			event.target.getAttribute("disabled") !== null
		) {
			textEditorTools.tmpGenArray.push(
				`_Paste (${cleanStr(textEditorTools.clipboard.substring(0, 5))}...)`
			);
			textEditorTools.tmpGenArray.push("");
		} else {
			textEditorTools.tmpGenArray.push(
				`+Paste (${cleanStr(textEditorTools.clipboard.substring(0, 5))}...)`
			);
			textEditorTools.tmpGenArray.push(
				"textEditorTools.paste('" +
					event.target.id +
					"', " +
					event.target.selectionStart +
					"," +
					event.target.selectionEnd +
					");getId('ctxMenu').style.display = 'none'"
			);
		}
		textEditorTools.tmpGenArray[0].push("ctxMenu/save.png");
	}
	textEditorTools.tempvar3 = currentSelection;
	ctxMenu(textEditorTools.tmpGenArray);
}

var textEditorTools = {
	tempvar: "",
	tempvar2: "",
	tempvar3: "",
	clipboard: "",
	tmpGenArray: [],
	copy: function () {
		this.clipboard = this.tempvar3;
		ufsave("system/clipboard", JSON.stringify(this.clipboard));
	},
	paste: function (element, cursorpos, endselect) {
		getId(element).value =
			getId(element).value.substring(0, cursorpos) +
			this.clipboard +
			getId(element).value.substring(endselect, getId(element).value.length);
	},
	swap: function (element, cursorpos) {
		const tempCopy = this.clipboard;
		this.clipboard = this.tempvar3;
		ufsave("system/clipboard", JSON.stringify(this.clipboard));
		getId(element).value =
			getId(element).value.substring(0, cursorpos) +
			tempCopy +
			getId(element).value.substring(cursorpos, getId(element).value.length);
	},
};

// Start menu
m("init DsB");
const codeToRun = [];

function c(code, args) {
	if (typeof code === "function") {
		if (args) {
			codeToRun.push([code, args]);
		} else {
			codeToRun.push(code);
		}
	}
}

let workingcodetorun = [];
let finishedWaitingCodes = 0; // skipcq JS-0128
window.setInterval(checkWaitingCode, 0);

function checkWaitingCode() {
	if (codeToRun.length === 0) return;

	m("Running Waiting Code");
	workingcodetorun = codeToRun.shift();
	if (typeof workingcodetorun === "function") {
		workingcodetorun();
	} else {
		workingcodetorun[0](workingcodetorun[1]);
	}

	finishedWaitingCodes++;
}

// getId("loadingInfo").innerHTML = "Applications List";
c(function () {
	Dashboard();
});

c(function () {
	NORA();
});

c(function () {
	AppInfo();
});

var currentSelection = "";
function setCurrentSelection() {
	currentSelection = window.getSelection().toString();
	requestAnimationFrame(setCurrentSelection);
}

requestAnimationFrame(setCurrentSelection);
c(function () {
	AppPrompt();
});

c(function () {
	SmartIconSettings();
});

c(function () {
	JSPaint();
});

c(function () {
	PropertiesViewer();
});

c(function () {
	FileManager();
});

c(function () {
	window.SRVRKEYWORD = window.SRVRKEYWORD || "";
	SaveMaster();
});

c(function () {
	Messaging();
});

c(function () {
	MusicPlayer();
});

c(function () {
	OldSite();
});

c(function () {
	Help();
});

c(function () {
	Accreditation();
});

c(function () {
	ViewCount();
	getId("loadingInfo").innerHTML = "Finalizing...";
});

// Function to open apps
let currTopApp = "";
function toTop(appToNudge, dsktpClick) {
	if (!appToNudge) return;
	m("Moving App " + appToNudge.dsktpIcon + " to Top");
	currTopApp = "";
	if (dsktpClick !== 2) {
		for (const appLication in apps) {
			if (
				getId("win_" + apps[appLication].objName + "_top").style.zIndex !==
				"100"
			) {
				getId("win_" + apps[appLication].objName + "_top").style.zIndex =
					parseInt(
						getId("win_" + apps[appLication].objName + "_top").style.zIndex,
						10
					) - 1;
			}
			getId("win_" + apps[appLication].objName + "_cap").style.opacity = "1";
			getId("win_" + apps[appLication].objName + "_aero").style.opacity = "1";
			getId("icn_" + apps[appLication].objName).classList.remove(
				"activeAppIcon"
			);
		}
	}

	if (!dsktpClick) {
		if (
			appToNudge.appWindow.appIcon &&
			getId("win_" + appToNudge.objName + "_top").style.opacity !== "1"
		) {
			appToNudge.appWindow.openWindow();
		}
		if (getId("win_" + appToNudge.objName + "_top").style.zIndex !== "100") {
			getId("win_" + appToNudge.objName + "_top").style.zIndex = "90";
		}
		getId("win_" + appToNudge.objName + "_cap").style.opacity = "1";
		getId("win_" + appToNudge.objName + "_aero").style.opacity = "1";
		getId("icn_" + appToNudge.objName).classList.add("activeAppIcon");
		try {
			currTopApp = appToNudge.objName;
			document.title = appToNudge.appName + " | " + websiteTitle;
		} catch (err) {
			document.title = websiteTitle;
		}
	} else {
		document.title = websiteTitle;
	}

	if (appToNudge !== apps.startMenu && apps.startMenu.appWindow.appIcon) {
		apps.startMenu.signalHandler("shrink");
	}
	getId("ctxMenu").style.display = "none";

	if (appToNudge.dsktpIcon !== "CLOSING") {
		const tempAppsList = [];
		for (const appLication in apps) {
			if (
				getId("win_" + apps[appLication].objName + "_top").style.zIndex !==
					"100" &&
				apps[appLication].appWindow.appIcon
			) {
				tempAppsList.push([
					appLication,
					getId("win_" + apps[appLication].objName + "_top").style.zIndex,
				]);
			}
		}
		tempAppsList.sort(function (a, b) {
			return b[1] - a[1];
		});
		for (let i = 0; i < tempAppsList.length; i++) {
			getId("win_" + apps[tempAppsList[i][0]].objName + "_top").style.zIndex =
				90 - i;
		}
	}
}

function openapp(appToOpen, launchTypeUsed) {
	if (!appToOpen) return;
	m("Opening App " + appToOpen.dsktpIcon);
	if (appToOpen.launchTypes) {
		appToOpen.main(launchTypeUsed);
	} else {
		appToOpen.main();
	}
	toTop(appToOpen);
}

// Function to remove broken text warning
function fadeResizeText() {
	getId("timesUpdated").style.display = "none";
}

let icomoveSelect = "";
let icomovex = 0;
let icomovey = 0;
let icomoveOrX = 0;
let icomoveOrY = 0;

function icomove(e, elem) {
	if (elem) {
		getId("icomove").style.display = "block";
		icomoveSelect = "app_" + elem;
		icomovex = e.pageX;
		icomovey = e.pageY;
		icomoveOrX = parseInt(getId(icomoveSelect).style.left, 10);
		icomoveOrY = parseInt(getId(icomoveSelect).style.top, 10);
		toTop(
			{
				dsktpIcon: "DESKTOP",
			},
			1
		);
	} else {
		getId("icomove").style.display = "none";
		let newXCoord = icomoveOrX + (e.pageX - icomovex);
		let newYCoord = icomoveOrY + (e.pageY - icomovey);
		newXCoord = Math.round(newXCoord / 108) * 108 + 8;
		newYCoord = Math.round(newYCoord / 98) * 98 + 8;
		dsktp[icomoveSelect.substring(4)].position = [newXCoord, newYCoord];
		ufsave(
			"system/desktop/user_icons/ico_" + icomoveSelect.substring(4),
			JSON.stringify(dsktp[icomoveSelect.substring(4)])
		);
		getId(icomoveSelect).style.left = newXCoord + "px";
		getId(icomoveSelect).style.top = newYCoord + "px";
	}
}

getId("icomove").addEventListener("click", icomove);

// skipcq JS-0128
function icomoving(e) {
	getId(icomoveSelect).style.left = icomoveOrX + (e.pageX - icomovex) + "px";
	getId(icomoveSelect).style.top = icomoveOrY + (e.pageY - icomovey) + "px";
}

// Custom icons; TODO
function icnmove(e, elem) {
	if (elem) {
		getId("icnmove").style.display = "block";
		icomoveSelect = "app" + elem;
		icomovex = e.pageX;
		icomovey = e.pageY;
		icomoveOrX = parseInt(getId(icomoveSelect).style.left, 10);
		icomoveOrY = parseInt(getId(icomoveSelect).style.top, 10);
		toTop(
			{
				dsktpIcon: "DESKTOP",
			},
			1
		);
	} else {
		getId("icnmove").style.display = "none";
		let newXCoord = icomoveOrX + (e.pageX - icomovex);
		let newYCoord = icomoveOrY + (e.pageY - icomovey);
		newXCoord = Math.round(newXCoord / 108) * 108 + 8;
		newYCoord = Math.round(newYCoord / 98) * 98 + 8;
		getId(icomoveSelect).style.left = newXCoord + "px";
		getId(icomoveSelect).style.top = newYCoord + "px";
	}
}

getId("icnmove").addEventListener("click", icnmove);

// skipcq JS-0128
function icnmoving(e) {
	getId(icomoveSelect).style.left = icomoveOrX + (e.pageX - icomovex) + "px";
	getId(icomoveSelect).style.top = icomoveOrY + (e.pageY - icomovey) + "px";
}

function scrollHorizontally(event) {
	this.scrollBy({
		left: event.deltaY,
		behavior: "smooth",
	});
}
getId("icons").addEventListener("wheel", scrollHorizontally);

// skipcq JS-0128
function highlightHide() {
	getId("windowFrameOverlay").style.display = "none";
}

let ctxSetup = [
	[0, 0, "appicons/redx.png", "appicons/redx.png"],
	" Context",
	'alert("Context Menu Not Correctly Initialized")',
	" Menu",
	'alert("Context Menu Not Correctly Initialized")',
];
let newCtxSetup = [
	[
		" Context",
		function () {
			alert("context");
		},
		"appicons/redx.png",
	],
	[
		" Menu",
		function () {
			alert("menu");
		},
		"appicons/redx.png",
	],
];
let newCtxCoord = [10, 10];
let newCtxArgs = [];
let ctxMenuImg = "";
let showingCtxMenu = 0;

function ctxMenu(setupArray, version, event, args) {
	m("Opening ctxMenu");

	if (!showingCtxMenu) {
		version
			? versionCtxMenu(setupArray, event, args)
			: unversionedCtxMenu(setupArray);
	}
}

function versionCtxMenu(setupArray, event, args) {
	let tempCtxContent = "";
	showingCtxMenu = 1;
	requestAnimationFrame(function () {
		showingCtxMenu = 0;
	});
	newCtxCoord = [event.pageX, event.pageY];
	newCtxArgs = args;
	newCtxSetup = setupArray;
	getId("ctxMenu").style.display = "block";
	if (newCtxCoord[0] > window.innerWidth / 2) {
		getId("ctxMenu").style.removeProperty("left");
		getId("ctxMenu").style.right =
			window.innerWidth - newCtxCoord[0] - 1 + "px";
	} else {
		getId("ctxMenu").style.removeProperty("right");
		getId("ctxMenu").style.left = newCtxCoord[0] + "px";
	}
	if (newCtxCoord[1] > window.innerHeight / 2) {
		getId("ctxMenu").style.removeProperty("top");
		getId("ctxMenu").style.bottom =
			window.innerHeight - newCtxCoord[1] - 1 + "px";
	} else {
		getId("ctxMenu").style.removeProperty("bottom");
		getId("ctxMenu").style.top = newCtxCoord[1] + "px";
	}
	getId("ctxMenu").innerHTML = "";

	for (const i in newCtxSetup) {
		if (typeof newCtxSetup[i][0] === "function") {
			if (
				newCtxSetup[i][0](newCtxArgs)[0] === "+" ||
				newCtxSetup[i][0](newCtxArgs)[0] === "_"
			) {
				tempCtxContent += "<hr>";
			}

			// skipcq JS-D009
			if (newCtxSetup[i][2]) {
				ctxMenuImg =
					'<img src="' +
					newCtxSetup[i][2] +
					"\" style=\"width:10px; height:10px; margin-top:1px; margin-bottom:-2px; margin-left:1px;\" onerror=\"this.style.marginLeft = '0';this.style.marginRight = '1px';this.src = 'ctxMenu/simple.png'\">";
			} else {
				ctxMenuImg =
					'<img src="ctxMenu/simple.png" style="width:10px; height:10px; margin-top:1px; margin-bottom:-2px; margin-right:1px">';
			}

			// skipcq JS-D009
			if (
				newCtxSetup[i][0](newCtxArgs)[0] === "-" ||
				newCtxSetup[i][0](newCtxArgs)[0] === "_"
			) {
				tempCtxContent +=
					'<p class="hiddenCtxOption">' +
					ctxMenuImg +
					"&nbsp;" +
					newCtxSetup[i][0](newCtxArgs).substring(
						1,
						newCtxSetup[i][0](newCtxArgs).length
					) +
					"&nbsp;</p>";
			} else {
				tempCtxContent +=
					'<p class="cursorPointer" onClick="newCtxSetup[' +
					i +
					'][1](newCtxArgs)">' +
					ctxMenuImg +
					"&nbsp;" +
					newCtxSetup[i][0](newCtxArgs).substring(
						1,
						newCtxSetup[i][0](newCtxArgs).length
					) +
					"&nbsp;</p>";
			}
		} else {
			if (newCtxSetup[i][0][0] === "+" || newCtxSetup[i][0][0] === "_") {
				tempCtxContent += "<hr>";
			}

			// skipcq JS-D009
			if (newCtxSetup[i][2]) {
				ctxMenuImg =
					'<img src="' +
					newCtxSetup[i][2] +
					"\" style=\"width:10px; height:10px; margin-top:1px; margin-bottom:-2px; margin-left:1px;\" onerror=\"this.style.marginLeft = '0';this.style.marginRight = '1px';this.src = 'ctxMenu/simple.png'\">";
			} else {
				ctxMenuImg =
					'<img src="ctxMenu/simple.png" style="width:10px; height:10px; margin-top:1px; margin-bottom:-2px; margin-right:1px">';
			}

			// skipcq JS-D009
			if (newCtxSetup[i][0][0] === "-" || newCtxSetup[i][0][0] === "_") {
				tempCtxContent +=
					'<p class="hiddenCtxOption">' +
					ctxMenuImg +
					"&nbsp;" +
					newCtxSetup[i][0].substring(1, newCtxSetup[i][0].length) +
					"&nbsp;</p>";
			} else {
				tempCtxContent +=
					'<p class="cursorPointer" onClick="newCtxSetup[' +
					i +
					'][1](newCtxArgs)">' +
					ctxMenuImg +
					"&nbsp;" +
					newCtxSetup[i][0].substring(1, newCtxSetup[i][0].length) +
					"&nbsp;</p>";
			}
		}
	}
	getId("ctxMenu").innerHTML = tempCtxContent;
}

function unversionedCtxMenu(setupArray) {
	let tempCtxContent = "";
	showingCtxMenu = 1;
	requestAnimationFrame(function () {
		showingCtxMenu = 0;
	});
	ctxSetup = setupArray;
	getId("ctxMenu").style.display = "block";
	if (ctxSetup[0][0] > window.innerWidth / 2) {
		getId("ctxMenu").style.removeProperty("left");
		getId("ctxMenu").style.right =
			window.innerWidth - ctxSetup[0][0] - 1 + "px";
	} else {
		getId("ctxMenu").style.removeProperty("right");
		getId("ctxMenu").style.left = ctxSetup[0][0] + "px";
	}
	if (ctxSetup[0][1] > window.innerHeight / 2) {
		getId("ctxMenu").style.removeProperty("top");
		getId("ctxMenu").style.bottom =
			window.innerHeight - ctxSetup[0][1] - 1 + "px";
	} else {
		getId("ctxMenu").style.removeProperty("bottom");
		getId("ctxMenu").style.top = ctxSetup[0][1] + "px";
	}

	getId("ctxMenu").innerHTML = "";

	// First char of name of element: + means new group | - means cannot click | _ means new group and cannot click
	for (let i = 1; i < ctxSetup.length - 1; i += 2) {
		if (i !== 1) {
			if (ctxSetup[i][0] === "+" || ctxSetup[i][0] === "_") {
				tempCtxContent += "<hr>";
			}
		}

		// // skipcq JS-D009
		if (ctxSetup[0][2]) {
			ctxMenuImg =
				'<img src="' +
				ctxSetup[0][Math.floor(i / 2) + 2] +
				"\" style=\"width:10px; height:10px; margin-top:1px; margin-bottom:-2px; margin-left:1px;\" onerror=\"this.style.marginLeft = '0';this.style.marginRight = '1px';this.src = 'ctxMenu/simple.png'\">";
		} else {
			ctxMenuImg =
				'<img src="ctxMenu/simple.png" style="width:10px; height:10px; margin-top:1px; margin-bottom:-2px; margin-right:1px">';
		}

		// skipcq JS-D009
		if (ctxSetup[i][0] === "-" || ctxSetup[i][0] === "_") {
			tempCtxContent +=
				'<p class="hiddenCtxOption">' +
				ctxMenuImg +
				"&nbsp;" +
				ctxSetup[i].substring(1, ctxSetup[i].length) +
				"&nbsp;</p>";
		} else {
			tempCtxContent +=
				'<p class="cursorPointer" onClick="' +
				ctxSetup[i + 1] +
				'">' +
				ctxMenuImg +
				"&nbsp;" +
				ctxSetup[i].substring(1, ctxSetup[i].length) +
				"&nbsp;</p>";
		}
	}
	getId("ctxMenu").innerHTML = tempCtxContent;
}

// skipcq JS-0128
const baseCtx = {
	hideall: [
		[
			"+Change Screen Resolution",
			function () {
				openapp(apps.settings, "dsktp");
			},
			"ctxMenu/gear.png",
		],
	],
	desktop: [
		[
			function () {
				return "+Speak" + ' "' + currentSelection.substring(0, 5) + '..."';
			},
			function () {
				textspeech(currentSelection);
			},
			"ctxMenu/happy.png",
		],
	],
	taskbar: [],
	appXXX: [
		[
			" Open",
			function (args) {
				openapp(apps[args[1]], "dsktp");
			},
			"ctxMenu/window.png",
		],
		[
			"+Move Icon",
			function (args) {
				icomove(args[0], args[1]);
			},
		],
	],
	appXXXjs: [
		[
			" Execute",
			function (args) {
				Function(...dsktp[args[1]].action)(...dsktp[args[1]].actionArgs);
			},
			"ctxMenu/window.png",
		],
		[
			"+Move Icon",
			function (args) {
				icomove(args[0], args[1]);
			},
		],
	],
	icnXXX: [
		[
			function (arg) {
				return apps[arg].appWindow.appIcon ? " Show" : " Open";
			},
			function (arg) {
				if (apps[arg].appWindow.appIcon) {
					openapp(apps[arg], "tskbr");
				} else {
					openapp(apps[arg], "dsktp");
				}
			},
			"ctxMenu/window.png",
		],
		[
			function (arg) {
				return apps[arg].appWindow.appIcon ? " Hide" : "-Hide";
			},
			function (arg) {
				apps[arg].signalHandler("shrink");
			},
			"ctxMenu/minimize.png",
		],
		[
			"+Close",
			function (arg) {
				apps[arg].signalHandler("close");
			},
			"ctxMenu/x.png",
		],
	],
	winXXXc: [
		[
			" About This App",
			function (arg) {
				openapp(apps.appInfo, arg);
			},
			"ctxMenu/file.png",
		],
		[
			"+Fold",
			function (arg) {
				apps[arg].appWindow.foldWindow();
			},
			"ctxMenu/less.png",
		],
		[
			"+Hide",
			function (arg) {
				apps[arg].signalHandler("shrink");
			},
			"ctxMenu/minimize.png",
		],
		[
			" Fullscreen",
			function (arg) {
				apps[arg].appWindow.toggleFullscreen();
				toTop(apps[arg]);
			},
			"ctxMenu/add.png",
		],
		[
			" Close",
			function (arg) {
				apps[arg].signalHandler("close");
			},
			"ctxMenu/x.png",
		],
		[
			function (arg) {
				return apps[arg].appWindow.onTop === 0
					? "+Stay On Top"
					: "_Stay On Top";
			},
			function (arg) {
				apps[arg].appWindow.alwaysOnTop(1);
			},
			"ctxMenu/add.png",
		],
		[
			function (arg) {
				return apps[arg].appWindow.onTop === 1
					? " Stay On Top"
					: "-Stay On Top";
			},
			function (arg) {
				apps[arg].appWindow.alwaysOnTop(0);
			},
			"ctxMenu/less.png",
		],
	],
};
getId("hideall").setAttribute(
	"oncontextmenu",
	"ctxMenu(baseCtx.hideall, 1, event);"
);
getId("taskbar").setAttribute(
	"oncontextmenu",
	"ctxMenu(baseCtx.taskbar, 1, event);"
);
getId("monitor").setAttribute(
	"oncontextmenu",
	'if(event.target !== getId("ctxMenu")){return false}'
);

try {
	if (typeof sessionStorage === "undefined") {
		sessionStorage = {
			getItem: function () {
				return false;
			},
			setItem: function () {
				return false;
			},
			removeItem: function () {
				return false;
			},
		};
	}
} catch (err) {
	sessionStorage = {
		getItem: function () {
			return false;
		},
		setItem: function () {
			return false;
		},
		removeItem: function () {
			return false;
		},
	};
}
try {
	if (typeof localStorage === "undefined") {
		localStorage = {
			getItem: function () {
				return false;
			},
			setItem: function () {
				return false;
			},
			removeItem: function () {
				return false;
			},
		};
	}
} catch (err) {
	localStorage = {
		getItem: function () {
			return false;
		},
		setItem: function () {
			return false;
		},
		removeItem: function () {
			return false;
		},
	};
}
fadeResizeText();

c(function () {
	getId("loadingInfo").innerHTML = "Loading your files...";

	doLog("Took " + perfCheck("masterInit") / 1000 + "ms to initialize.");
	perfStart("masterInit");
});

let bootFileHTTP = new XMLHttpRequest();
bootFileHTTP.onreadystatechange = function () {
	if (bootFileHTTP.readyState === 4) {
		if (bootFileHTTP.status === 200) {
			USERFILES = JSON.parse(bootFileHTTP.responseText);
			if (USERFILES === null) USERFILES = {};
		} else {
			alert("Failed to fetch your files. Web error " + bootFileHTTP.status);
		}

		doLog("Took " + perfCheck("masterInit") / 1000 + "ms to fetch USERFILES.");
		perfStart("masterInit");
		m("init fileloader");
		getId("loadingInfo").innerHTML += "<br>Your OS key is " + SRVRKEYWORD;
		for (const app in apps) {
			getId("loadingInfo").innerHTML =
				"Loading your files...<br>Loading " + app;
			try {
				apps[app].signalHandler("USERFILES_DONE");
			} catch (err) {
				alert("Error initializing " + app + ":\n\n" + err);
			}
		}

		try {
			updateBgSize();
		} catch (err) {
			// continue regardless of error
		}

		requestAnimationFrame(function () {
			bootFileHTTP = null;
		});
		doLog("Took " + perfCheck("masterInit") / 1000 + "ms to run startup apps.");
		doLog(
			"Took " +
				Math.round(performance.now() * 10) / 10 +
				"ms grand total to reach desktop."
		);
		doLog(" ");
	}
};

c(function () {
	USERFILES = {};
	doLog("Took " + perfCheck("masterInit") / 1000 + "ms to fetch USERFILES.");
	perfStart("masterInit");
	m("init fileloader");
	getId("loadingInfo").innerHTML += "<br>Your OS key is " + SRVRKEYWORD;
	for (const app in apps) {
		getId("loadingInfo").innerHTML =
			"Loading your files...<br>Your OS key is" +
			SRVRKEYWORD +
			"<br>Loading " +
			app;
		try {
			apps[app].signalHandler("USERFILES_DONE");
		} catch (err) {
			alert("Error initializing " + app + ":\n\n" + err);
		}
	}

	try {
		updateBgSize();
	} catch (err) {
		// continue regardless of error
	}
	requestAnimationFrame(function () {
		bootFileHTTP = null;
	});
	doLog(
		"Took " + perfCheck("masterInit") / 1000 + "ms to exec USERFILES_DONE."
	);
	doLog(
		"Took " +
			Math.round(performance.now() * 10) / 10 +
			"ms grand total to reach desktop."
	);
});

c(function () {
	window.iframeblurcheck = function () {
		try {
			if (document.activeElement.getAttribute("data-parent-app")) {
				if (
					currTopApp !== document.activeElement.getAttribute("data-parent-app")
				) {
					toTop(apps[document.activeElement.getAttribute("data-parent-app")]);
				}
			}
		} catch (err) {
			// continue regardless of error
		}
	};

	setInterval(iframeblurcheck, 500);
	addEventListener("blur", iframeblurcheck);
});

window.resetOS = function () {
	// TODO: Call this somewhere
	document.cookie = "keyword=; Max-Age=-99999999;";
	window.location = "index.php";
};

// Function to allow app windows to be moved
let winmoveSelect = "";
let winmovex = 0;
let winmovey = 0;
let winmoveOrX = 0;
let winmoveOrY = 0;
let winmovecurrapp = "";

function winmove(e) {
	if (e.currentTarget !== getId("winmove")) {
		getId("winmove").style.display = "block";
		winmoveSelect = e.currentTarget.id.substring(
			0,
			e.currentTarget.id.length - 4
		);
		winmovex = e.pageX;
		winmovey = e.pageY;
		for (const app in apps) {
			if (
				apps[app].objName === winmoveSelect.substring(4, winmoveSelect.length)
			) {
				winmovecurrapp = app;
				break;
			}
		}
		winmoveOrX = apps[winmovecurrapp].appWindow.windowX;
		winmoveOrY = apps[winmovecurrapp].appWindow.windowY;
		if (document.activeElement.tagName === "IFRAME") {
			if (document.activeElement.getAttribute("data-parent-app")) {
				if (e.currentTarget.id) {
					if (
						"win_" +
							document.activeElement.getAttribute("data-parent-app") +
							"_cap" !==
						e.currentTarget.id
					) {
						document.activeElement.blur();
					}
				} else {
					if (
						"win_" +
							document.activeElement.getAttribute("data-parent-app") +
							"_cap" !==
						e.currentTarget.parentNode.id
					) {
						document.activeElement.blur();
					}
				}
			}
		}
	} else {
		getId("winmove").style.display = "none";
		if (!mobileMode) {
			apps[winmovecurrapp].appWindow.setDims(
				winmoveOrX + (e.pageX - winmovex),
				winmoveOrY + (e.pageY - winmovey),
				apps[winmovecurrapp].appWindow.windowH,
				apps[winmovecurrapp].appWindow.windowV
			);
		}
	}
}
getId("winmove").addEventListener("click", winmove);

// skipcq JS-0128
function winmoving(e) {
	winmovelastx = e.pageX;
	winmovelasty = e.pageY;
	if (!mobileMode) {
		apps[winmovecurrapp].appWindow.setDims(
			winmoveOrX + (e.pageX - winmovex),
			winmoveOrY + (e.pageY - winmovey),
			apps[winmovecurrapp].appWindow.windowH,
			apps[winmovecurrapp].appWindow.windowV
		);
	}
}

let tempwinresmode = [1, 1];
let winresOrX = 0;
let winresOrY = 0;

// skipcq JS-0128
function winres(e) {
	if (e.currentTarget !== getId("winres")) {
		getId("winres").style.display = "block";
		winmoveSelect = e.currentTarget.id.substring(
			0,
			e.currentTarget.id.length - 5
		);
		winmovex = e.pageX;
		winmovey = e.pageY;
		for (const app in apps) {
			if (
				apps[app].objName === winmoveSelect.substring(4, winmoveSelect.length)
			) {
				winmovecurrapp = app;
				break;
			}
		}

		winmoveOrX = apps[winmovecurrapp].appWindow.windowH;
		winmoveOrY = apps[winmovecurrapp].appWindow.windowV;

		tempwinresmode = [1, 1];
		if (winmovex - apps[winmovecurrapp].appWindow.windowX < winBorder * 5) {
			tempwinresmode[0] = 0;
			winresOrX = apps[winmovecurrapp].appWindow.windowX;
		} else if (
			winmovex -
				apps[winmovecurrapp].appWindow.windowX -
				apps[winmovecurrapp].appWindow.windowH >
			winBorder * -5
		) {
			tempwinresmode[0] = 2;
		}
		if (winmovey - apps[winmovecurrapp].appWindow.windowY < winBorder * 5) {
			tempwinresmode[1] = 0;
			winresOrY = apps[winmovecurrapp].appWindow.windowY;
		} else if (
			winmovey -
				apps[winmovecurrapp].appWindow.windowY -
				apps[winmovecurrapp].appWindow.windowV >
			winBorder * -5
		) {
			tempwinresmode[1] = 2;
		}

		if (document.activeElement.tagName === "IFRAME") {
			if (document.activeElement.getAttribute("data-parent-app")) {
				if (e.currentTarget.id) {
					if (
						"win_" +
							document.activeElement.getAttribute("data-parent-app") +
							"_size" !==
						e.currentTarget.id
					) {
						document.activeElement.blur();
					}
				}
			}
		}
	} else {
		getId("winres").style.display = "none";
		let newWidth = apps[winmovecurrapp].appWindow.windowH;
		let newHeight = apps[winmovecurrapp].appWindow.windowV;
		let newLeft = apps[winmovecurrapp].appWindow.windowX;
		let newTop = apps[winmovecurrapp].appWindow.windowY;
		if (tempwinresmode[0] === 2) {
			newWidth = winmoveOrX + (e.pageX - winmovex);
		} else if (tempwinresmode[0] === 0) {
			newWidth = winmoveOrX - (e.pageX - winmovex);
			newLeft = winresOrX + (e.pageX - winmovex);
		}

		if (tempwinresmode[1] === 2) {
			newHeight = winmoveOrY + (e.pageY - winmovey);
		} else if (tempwinresmode[1] === 0) {
			newHeight = winmoveOrY - (e.pageY - winmovey);
			newTop = winresOrY + (e.pageY - winmovey);
		}

		apps[winmovecurrapp].appWindow.setDims(
			newLeft,
			newTop,
			newWidth,
			newHeight
		);
	}
}
getId("winres").addEventListener("click", winres);

// skipcq JS-0128
function winresing(e) {
	let newWidth = apps[winmovecurrapp].appWindow.windowH;
	let newHeight = apps[winmovecurrapp].appWindow.windowV;
	let newLeft = apps[winmovecurrapp].appWindow.windowX;
	let newTop = apps[winmovecurrapp].appWindow.windowY;
	if (tempwinresmode[0] === 2) {
		newWidth = winmoveOrX + (e.pageX - winmovex);
	} else if (tempwinresmode[0] === 0) {
		newWidth = winmoveOrX - (e.pageX - winmovex);
		newLeft = winresOrX + (e.pageX - winmovex);
	}
	if (tempwinresmode[1] === 2) {
		newHeight = winmoveOrY + (e.pageY - winmovey);
	} else if (tempwinresmode[1] === 0) {
		newHeight = winmoveOrY - (e.pageY - winmovey);
		newTop = winresOrY + (e.pageY - winmovey);
	}

	apps[winmovecurrapp].appWindow.setDims(newLeft, newTop, newWidth, newHeight);
}

// skipcq JS-0128
function highlightWindow(app) {
	getId("windowFrameOverlay").style.display = "block";
	// The 32 is to compensate for the absoltely positioned top bar, which isn't factored in by default
	getId("windowFrameOverlay").style.top =
		apps[app].appWindow.windowY + 32 + "px";
	getId("windowFrameOverlay").style.left = apps[app].appWindow.windowX + "px";
	getId("windowFrameOverlay").style.width = apps[app].appWindow.windowH + "px";
	getId("windowFrameOverlay").style.height = apps[app].appWindow.windowV + "px";
}

window.bgNaturalSize = [1920, 1080];
window.bgSize = [1920, 1080];
window.bgPosition = [0, 0];

const bgFit = "center";
function updateBgSize(noWinblur) {
	bgNaturalSize = [
		getId("bgSizeElement").naturalWidth,
		getId("bgSizeElement").naturalHeight,
	];
	const monsize = [
		parseInt(getId("monitor").style.width),
		parseInt(getId("monitor").style.height),
	];
	const sizeratio = [
		monsize[0] / bgNaturalSize[0],
		monsize[1] / bgNaturalSize[1],
	];

	switch (bgFit) {
		case "corner":
			bgSize = [bgNaturalSize[0], bgNaturalSize[1]];
			bgPosition = [0, 0];
			break;
		case "stretch":
			bgSize = [
				parseInt(getId("monitor").style.width),
				parseInt(getId("monitor").style.height),
			];
			bgPosition = [0, 0];
			break;
		case "center":
			bgSize = [bgNaturalSize[0], bgNaturalSize[1]];
			bgPosition = [
				monsize[0] / 2 - bgSize[0] / 2,
				monsize[1] / 2 - bgSize[1] / 2,
			];
			break;
		case "fit":
			if (sizeratio[0] <= sizeratio[1]) {
				bgSize = [
					monsize[0],
					Math.round(bgNaturalSize[1] * (monsize[0] / bgNaturalSize[0])),
				];
				bgPosition = [0, Math.round((monsize[1] - bgSize[1]) / 2)];
			} else {
				bgSize = [
					Math.round(bgNaturalSize[0] * (monsize[1] / bgNaturalSize[1])),
					monsize[1],
				];
				bgPosition = [Math.round((monsize[0] - bgSize[0]) / 2), 0];
			}
			break;
		case "cover":
			if (sizeratio[0] >= sizeratio[1]) {
				bgSize = [
					monsize[0],
					Math.round(bgNaturalSize[1] * (monsize[0] / bgNaturalSize[0])),
				];
				bgPosition = [0, Math.round((monsize[1] - bgSize[1]) / 2)];
			} else {
				bgSize = [
					Math.round(bgNaturalSize[0] * (monsize[1] / bgNaturalSize[1])),
					monsize[1],
				];
				bgPosition = [Math.round((monsize[0] - bgSize[0]) / 2), 0];
			}
			break;
		default:
			bgSize = [bgNaturalSize[0], bgNaturalSize[1]];
			bgPosition = [0, 0];
	}
	getId("monitor").style.backgroundSize = bgSize[0] + "px " + bgSize[1] + "px";
	getId("monitor").style.backgroundPosition =
		bgPosition[0] + "px " + bgPosition[1] + "px";
	if (!noWinblur) calcWindowblur(null, 1);
}

function calcWindowblur(win, noBgSize) {
	if (!noBgSize) updateBgSize(1);
	const aeroOffset = [0, -32];
	getId("monitor").style.transform = "";
	if (win === "taskbar") {
		getId("tskbrAero").style.backgroundSize =
			bgSize[0] + "px " + bgSize[1] + "px";
		getId("tskbrAero").style.backgroundPosition =
			20 + bgPosition[0] + "px " + (20 + bgPosition[1]) + "px";
	} else if (win) {
		getId("win_" + win + "_aero").style.backgroundPosition =
			-1 * apps[win].appWindow.windowX +
			40 +
			aeroOffset[0] +
			bgPosition[0] +
			"px " +
			(-1 * (apps[win].appWindow.windowY * (apps[win].appWindow.windowY > -1)) +
				40 +
				aeroOffset[1] +
				bgPosition[1]) +
			"px";
	} else {
		for (const i in apps) {
			getId("win_" + i + "_aero").style.backgroundSize =
				bgSize[0] + "px " + bgSize[1] + "px";
			getId("win_" + i + "_aero").style.backgroundPosition =
				-1 * apps[i].appWindow.windowX +
				40 +
				aeroOffset[0] +
				bgPosition[0] +
				"px " +
				(-1 * (apps[i].appWindow.windowY * (apps[i].appWindow.windowY > -1)) +
					40 +
					aeroOffset[1] +
					bgPosition[1]) +
				"px";
		}
		getId("tskbrAero").style.backgroundSize =
			bgSize[0] + "px " + bgSize[1] + "px";
		getId("tskbrAero").style.backgroundPosition =
			20 + bgPosition[0] + "px " + (20 + bgPosition[1]) + "px";
	}
}
window.calcWindowblur = calcWindowblur;

function setMobile(newSetting) {
	mobileMode = newSetting;
	if (newSetting) {
		getId("monitor").classList.add("mobileMode");
	} else {
		getId("monitor").classList.remove("mobileMode");
	}
}

const autoMobile = true;
function checkMobileSize() {
	if (!autoMobile) return;
	if (
		!mobileMode &&
		(!window.matchMedia("(pointer: fine)").matches ||
			parseInt(getId("monitor").style.width, 10) < 768)
	) {
		setMobile(true);
	} else if (
		mobileMode &&
		window.matchMedia("(pointer: fine)").matches &&
		parseInt(getId("monitor").style.width, 10) >= 768
	) {
		setMobile(false);
	}
}

function fitWindow() {
	getId("monitor").style.width = window.innerWidth + "px";
	getId("monitor").style.height = window.innerHeight + "px";
	getId("desktop").style.width = window.innerWidth + "px";
	getId("desktop").style.height = window.innerHeight - 32 + "px";
	getId("taskbar").style.width = window.innerWidth + "px";
	getId("tskbrAero").style.backgroundPosition =
		"20px " + (-1 * window.innerHeight + 52) + "px";
	getId("tskbrAero").style.width = window.innerWidth + 40 + "px";
	getId("tskbrAero").style.height = "";
	getId("tskbrAero").style.transform = "";
	getId("tskbrAero").style.transformOrigin = "";

	getId("desktop").style.left = "";
	getId("desktop").style.top = "32px";
	getId("desktop").style.width = getId("monitor").style.width;
	getId("desktop").style.height =
		parseInt(getId("monitor").style.height, 10) - 32 + "px";
	getId("taskbar").style.top = "0";
	getId("taskbar").style.left = "";
	getId("taskbar").style.right = "";
	getId("taskbar").style.bottom = "auto";
	getId("taskbar").style.transform = "";
	getId("taskbar").style.width = getId("monitor").style.width;
	getId("tskbrAero").style.backgroundPosition = "20px 20px";

	checkMobileSize();
	arrangeDesktopIcons();
	try {
		updateBgSize();
	} catch (err) {
		// continue regardless of error
	}
}

// Auto-resize display on window change
window.addEventListener("resize", fitWindow);
fitWindow();

// Open apps on startup
c(function () {
	// openapp(apps.accreditation, 'dsktp');
	// openapp(apps.viewCount, 'dsktp');
	// openapp(apps.musicPlayer, 'dsktp');
});
