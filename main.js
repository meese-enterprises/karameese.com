var bootTime = new Date().getTime();

if (typeof console === "undefined") {
	console = {
		log: function() {
			/* IE compatibility because console doesn't exist */
		}
	};
}

// Check if backdrop filter blur and others are supported by the browser
var backdropFilterSupport = false;
var backgroundBlendSupport = false;
var cssFilterSupport = false;
if (typeof CSS !== "undefined") {
	if (typeof CSS.supports !== "undefined") {

		if (CSS.supports("(backdrop-filter: blur(5px))")) {
			backdropFilterSupport = true;
		}

		if (CSS.supports("(background-blend-mode: screen)")) {
			backgroundBlendSupport = true;
		}

		if (CSS.supports("(filter: blur(5px))")) {
			cssFilterSupport = true;
		}
	}
}

// Substitute performance.now if not intact
var windowperformancenowIntact = 1;
if (window.performance === undefined) {
	window.performance = {
		now: function() {
			return (new Date).getTime() * 1000;
		}
	};
	window.requestAnimationFrame(function() {
		console.log('performance.now is not supported by your browser. It has been replaced by function(){return (new Date).getTime() * 1000}', '#F00')
	});
} else if (window.performance.now === undefined) {
	window.performance.now = function() {
		return (new Date).getTime() * 1000;
	};
	window.requestAnimationFrame(function() {
		console.log('performance.now is not supported by your browser. It has been replaced by function(){return (new Date).getTime() * 1000}', '#F00')
	});
}

// Approximately how long it took to load the page
var timeToPageLoad = Math.round(performance.now() * 10) / 10;

var noUserFiles = (window.location.href.indexOf('nofiles=true') !== -1);

// See if animationframe is supported - if not, substitute it
var requestAnimationFrameIntact = 1;
if (window.requestAnimationFrame === undefined) {
	requestAnimationFrameIntact = 0;
	window.requestAnimationFrame = function (func) {
		window.setTimeout(func, 0);
	};
	window.requestAnimationFrame(function() {
		console.log('requestAnimationFrame is not supported by your browser. It has been replaced by function(func){setTimeout(func, 0)}', '#F00')
	});
}

(function (win, doc) {
	// No need to polyfill
	if (win.addEventListener) return;

	function docHijack(p) {
		var old = doc[p];
		doc[p] = function (v) {
			return addListen(old(v))
		}
	}

	function addEvent(on, fn, self) {
		return (self = this).attachEvent('on' + on, function (e) {
			var e = e || win.event;
			e.preventDefault = e.preventDefault || function() {
				e.returnValue = false
			}
			e.stopPropagation = e.stopPropagation || function() {
				e.cancelBubble = true
			}
			fn.call(self, e);
		});
	}

	function addListen(obj, i) {
		if (i = obj.length)
			while (i--) obj[i].addEventListener = addEvent;
		else obj.addEventListener = addEvent;
		return obj;
	}

	addListen([doc, win]);
	if ('Element' in win) win.Element.prototype.addEventListener = addEvent; // IE8
	else { // IE < 8
		doc.attachEvent('onreadystatechange', function() {
			addListen(doc.all)
		}); // Make sure we also init at domReady
		docHijack('getElementsByTagName');
		docHijack('getElementById');
		docHijack('createElement');
		addListen(doc.all);
	}
})(window, document);

if (typeof document.getElementsByClassName === 'undefined') {
	document.getElementsByClassName = function() {
		return [];
	}
}

// End of IE compatibility fixes

// Safe mode
var safeMode = (window.location.href.indexOf('safe=true') > -1);
var safe = !safeMode;

var darkMode = 0;
function darkSwitch(light, dark) {
	if (darkMode) {
		return dark;
	} else {
		return light;
	}
}
var autoMobile = 1;

function checkMobileSize() {
	if (autoMobile) {
		if (!mobileMode && (!window.matchMedia("(pointer: fine)").matches || parseInt(getId("monitor").style.width, 10) < 768)) {
			setMobile(1);
		} else if (mobileMode && (window.matchMedia("(pointer: fine)").matches && parseInt(getId("monitor").style.width, 10) >= 768)) {
			setMobile(0);
		}
	}
}

var mobileMode = 0;
const mobileSwitch = (no, yes) => !!mobileMode ? yes : no;

function setMobile(type) {
	if (type) {
		mobileMode = 1;
		getId('monitor').classList.add('mobileMode');
	} else {
		mobileMode = 0;
		getId('monitor').classList.remove('mobileMode');
	}
}

// Sanitize a string to make HTML safe
function cleanStr(str) {
	return str.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;');
}

// Make sure monitor doesn't get scrolled away
function checkMonitorMovement() {
	getId('monitor').scrollTop = 0;
	getId('monitor').scrollLeft = 0;
	requestAnimationFrame(checkMonitorMovement);
}
requestAnimationFrame(checkMonitorMovement);

// This section helps to handle errors, assuming the browser supports it.
// This is user's answer to send error report - 0 or 1. 2 means never been asked
var lasterrorconfirmation = 0;
// List of error messages
var errorMessages = [
	'Ouch!',
	'Fried the motherboard!',
	'Who released the singularity?', // Space Station 13 joke!
	'That\'ll leave a mark.',
	'Oh noes!',
	'It wasn\'t me!', // Rocketman joke!
	'I didn\'t do it!', // Mr. Krabs joke!
	'Suppermatter engine is melting down!', // Space Station 13 joke!
	'Congratulations!',
	'WHY ME?!',
	'You\'ve got two empty halves of a coconut and you\'re banging them together!', // Monty Python joke!
	'Augh! Message for you, sir!', // Monty Python joke!
];

// Error handler itself
window.onerror = function (errorMsg, url, lineNumber) {
	// Just in case it has been destroyed, vartry is rebuilt - check function vartry(...){...} for commentation on it
	vartry = function (varname) {
		try {
			return eval(varname);
		} catch (err) {
			return '-failed vartry(' + varname + ') ' + err + '-'
		}
	}
	var randomPhrase = errorMessages[Math.floor(Math.random() * errorMessages.length)];
	var errorModule = module;
	if (formDate('YMDHmSs') - lasterrorconfirmation > 30000) {
		lasterrorconfirmation = formDate('YMDHmSs');
		try {
			apps.prompt.vars.notify('Error in ' + errorModule + '<br>[' + lineNumber + '] ' + errorMsg + '<br><br>' + randomPhrase, ['Open Console', 'Dismiss'], function (btn) {
				if (!btn) openapp(apps.jsConsole, 'dsktp');
			}, 'Uncaught Error', 'appicons/ds/redx.png');
		} catch (err) {
			console.log("Could not prompt error!");
		}
	}
	try {
		doLog("");
		doLog("You found an error! " + randomPhrase, '#F00');
		doLog("");
		doLog("Error in " + url, "#F00");
		doLog("Module '" + errorModule + "' at [" + lineNumber + "]:", "#F00");
		doLog(errorMsg, "#F00");
		doLog("");
	} catch (err) {
		console.log("");
		console.log("You found an error! " + errorMessages[Math.floor(Math.random() * errorMessages.length)]);
		console.log("");
		console.log("Error in " + url);
		console.log("Module '" + module + "' at [" + lineNumber + "]:");
		console.log(errorMsg);
		console.log("");
	}
};

// Scale of screen, for HiDPI compatibility
var screenScale = 1;

// Debugging psuedo-module system
// The last used module
var modulelast = 'init aOS';
// The current running module
var module = 'init aOS';
// Variable used to tell the file loader that aos is ready to load USERFILES
var initStatus = 0;
// Changes the current module
function m(msg) {
	d(2, 'Module changed: ' + msg);
	if (module !== msg) {
		modulelast = module;
		module = msg;
		// Reset module to idle so it is ready for next one
		if (msg !== "unknown") {
			window.setTimeout(function() {
				m('unknown');
			}, 0);
		}
	}
}

// Dynamic debug logging
var dbgLevel = 0;
var d = function (level, message) {
	// Level must be higher than the debuglevel set by Settings in order to log
	if (level <= dbgLevel) {
		doLog('<span style="color:#80F">Dbg:</span> ' + message);
	}
};

var dirtyLoadingEnabled = 0;
if (localStorage.getItem("aosdirtyloading") === "1") {
	dirtyLoadingEnabled = 1;
}

// Counts the length of an object
var tempObjLengthCount

function objLength(target) {
	tempObjLengthCount = 0;
	for (var i in target) {
		tempObjLengthCount++;
	}
	return tempObjLengthCount;
}

// Formats a number with commas
var tempNCnumber = "";
var tempNCresult = "";

function numberCommas(number) {
	tempNCnumber = number + "";
	tempNCresult = '';
	// Adds commas every third character from right
	for (let i = tempNCnumber.length - 3; i > 0; i -= 3) {
		tempNCresult = ',' + tempNCnumber.substring(i, i + 3) + tempNCresult;
		tempNCnumber = tempNCnumber.substring(0, i);
	}
	tempNCresult = tempNCnumber + tempNCresult;
	return tempNCresult;
}

var cursors = {
	def: 'url(./cursors/default.png) 3 3, default',
	loadLightGif: 'url(./cursors/loadLight.gif) 16 16, url(./cursors/loadLight.png) 16 16, wait',
	loadDarkGif: 'url(./cursors/loadDark.gif) 16 16, url(./cursors/loadDark.png) 16 16, wait',
	loadLight: 'url(./cursors/loadLight.png) 16 16, wait',
	loadDark: 'url(./cursors/loadDark.png) 16 16, wait',
	move: 'url(./cursors/move.png) 14 14, move',
	pointer: 'url(./cursors/pointer.png) 9 3, pointer'
}

// Performance-measuring functions
m('init performance measure');
var perfObj = {};

// Start measuring a certain performance block
function perfStart(name) {
	d(2, 'Started Performance: ' + name);
	perfObj[name] = [window.performance.now(), 0, 0];
	return Math.round(perfObj[name][0] * 1000);
}
// Check performance of a block
function perfCheck(name) {
	perfObj[name][1] = window.performance.now();
	perfObj[name][2] = perfObj[name][1] - perfObj[name][0];
	d(2, 'Checked Performance: ' + name);
	return Math.round(perfObj[name][2] * 1000);
}
// Start measuring aos boot time (lol, 220 lines in)
perfStart('masterInitAOS');

// Screensaver system
var screensaverRunning = 0;
// Screensaver blockers
var screensaverBlocks = [];

function countScreensaverBlocks(name) {
	if (!name) name = "";
	name = cleanStr(String(name));

	let temp = 0;
	for (let i in screensaverBlocks) {
		if (screensaverBlocks[i] === name) temp++;
	}

	return temp;
}

function blockScreensaver(name) {
	if (!name) name = "";
	name = cleanStr(String(name));
	screensaverBlocks.push(name);
	return countScreensaverBlocks(name);
}

function unblockScreensaver(name, purge) {
	if (!name) name = "";
	name = cleanStr(String(name));
	if (screensaverBlocks.indexOf(name) === -1) return -1;

	if (purge) {
		while (screensaverBlocks.indexOf(name) > -1) {
			screensaverBlocks.splice(screensaverBlocks.indexOf(name), 1);
		}

		return 0;
	}

	screensaverBlocks.splice(screensaverBlocks.indexOf(name), 1);
	return countScreensaverBlocks(name);
}

// Previous mouse position
var lastPageX = 0;
var lastPageY = 0;
// User has moved their mouse
function markUserMouseActive(event) {
	if (event.pageX !== lastPageX || event.pageY !== lastPageY) {
		// TODO: CHANGE
		perfStart('userActivity');
		if (screensaverRunning) {
			getId('screensaverLayer').style.display = "none";
			getId('screensaverLayer').innerHTML = "";
			apps.settings.vars.screensavers[apps.settings.vars.currScreensaver].end();
			screensaverRunning = 0;
		}
		lastPageX = event.pageX;
		lastPageY = event.pageY;
	}
}

// User has used their keyboard
function markUserKeyboardActive() {
	perfStart('userActivity');
	if (!screensaverRunning) return;
	getId('screensaverLayer').style.display = "none";
	getId('screensaverLayer').innerHTML = "";
	apps.settings.vars.screensavers[apps.settings.vars.currScreensaver].end();
	screensaverRunning = 0;
}

// Pretend the keyboard was clicked - they just logged in so they must have been active
markUserKeyboardActive();

// Add the event listeners to the monitor
getId("monitor").addEventListener('click', markUserKeyboardActive);
getId("monitor").addEventListener('mousemove', markUserMouseActive);
getId("monitor").addEventListener('keypress', markUserKeyboardActive);

// Vartry is used when something might not work
m('init onerror and USERFILES and getId');
var vartryArray = {};
var vartry = function (varname) {
	try {
		return eval(varname);
	} catch (err) {
		return '-failed vartry(' + varname + ') ' + err + '-';
	}
}

// Convert number to true/false
const numEnDis = (num) => !!num ? 'Enabled' : 'Disabled';

const currentlanguage = 'en';
var langContent = {
	en: {
		aOS: {
			failedVarTry: 'failed', // lowercase
			fatalError1: 'You found an error! ',
			fatalError2: 'Error in',
			fatalError3: 'Module', // lowercase
			fatalError4: 'at', // lowercase
			fatalError5: 'Send error report to the developer?',
			errorReport: 'Failed to save the report. The OS has either failed to initialize or crucial components have been deleted. Please email mineandcraft12@gmail.com with the details of your issue if you would like it fixed.'
		},
		appNames: {
			startMenu: "AaronOS Dashboard",
			nora: "NORAA",
			jsConsole: "JavaScript Console",
			bash: "Psuedo-Bash Terminal",
			prompt: "Application Prompt",
			settings: "Settings",
			windowTest: "Window Test Application",
			testTwo: "Test App 2",
			ragdoll: "Rag Doll",
			notepad: "Text Editor",
			properties: "Properties Viewer",
			files: "File Manager",
			flashCards: "Flash Cards",
			pngSave: "PNG Saver",
			canvasGame: "Canvas Video Games",
			internet: "The Internet",
			savemaster: "SaveMaster",
			ti: "TI-83+ Simulator",
			appAPI: "aOS API",
			search: "Search",
			image: "aOSimg Editor",
			messaging: "Messaging",
			musicVis: "Music Visualiser",
			perfMonitor: "Performance Monitor",
			mathway: "Mathway",
			appsbrowser: "Apps Browser",
			housegame: "House Game",
			simon: "Simon",
			postit: "Sticky Note",
			bootScript: "Boot Script Editor",
			rdp: "Remote Desktop Host",
			rdpViewer: "Remote Desktop Viewer",
			extDebug: "External Debug",
			mouseControl: "Alternate Mouse Control",
			onlineDebug: "Online Debug Connection",
			jana: "Jana"
		},
		startMenu: {
			power: 'Power',
			jsConsole: 'JavaScript Console',
			settings: 'Settings',
			files: 'Files',
			allApps: 'All Apps',
			aosHelp: 'aOS Help',
			search: 'Search',
			shutDown: 'Shut Down',
			restart: 'Restart'
		},
		ctxMenu: {
			settings: 'Settings',
			jsConsole: 'JavaScript Console',
			screenResolution: 'Change Screen Resolution',
			addIcon: 'Add Icon',
			speak: 'Speak',
			taskbarSettings: 'Taskbar Settings',
			openApp: 'Open',
			moveIcon: 'Move Icon',
			showApp: 'Show',
			hideApp: 'Hide',
			closeApp: 'Close',
			fold: 'Fold',
			stayOnTop: 'Stay On Top',
			stopOnTop: 'Stop Staying On Top',
			copyText: 'Copy',
			pasteText: 'Paste'
		},
		jsConsole: {
			caption: 'Javascript Console',
			runCode: 'Run Code',
			input: 'Input'
		},
		prompt: {
			caption: 'Application Prompt',
			genericAlert: 'This app is used for alerts and prompts in aOS apps.',
			ok: 'OK',
			alertText: 'wants to tell you', // lowercase
			alertUnnamed: 'Alert from an anonymous app',
			confirmText: 'wants a choice from you', // lowercase
			confirmUnnamed: 'Pick a choice for an anonymous app',
			promptText: 'wants some info from you', // lowercase
			promptUnnamed: 'Enter some info for an anonymous app'
		},
		notepad: {
			caption: 'Text Editor',
			// these are all buttons...
			save: 'Save',
			load: 'Load',
			file: 'File',
			tools: 'Tools'
		}
	}
}

function lang(appCode, langPiece) {
	if (typeof langContent.en[appCode] !== "undefined") {
		if (typeof langContent.en[appCode][langPiece] !== "undefined") {
			return langContent.en[appCode][langPiece];
		} else {
			return 'LanguageError: No translation for ' + langPiece + ' of app ' + appCode + ' in language en.';
		}
	} else {
		return 'LanguageError: Language en does not support app ' + appCode + '.';
	}
}

// this is where the user's files go
var USERFILES = [];

// Make the desktop invisible to speed up boot
if (dirtyLoadingEnabled) {
	getId('aOSloadingBg').style.display = 'none';
} else {
	getId('desktop').style.display = 'none';
	getId('taskbar').style.display = 'none';
}

// Find client scrollbar size
m('init Scrollsize');
var scrollWidth = getId("findScrollSize").offsetWidth - getId("findScrollSize").clientWidth;
var scrollHeight = getId("findScrollSize").offsetHeight - getId("findScrollSize").clientHeight;
getId('findScrollSize').style.display = 'none';

// Taskbar settings
var tskbrToggle = {
	perfMode: 0,
	tskbrPos: 1
};

var showTimeColon = 0;
var timeElement = getId("time");
var doLog;

getId("icons").innerHTML = "";

// Function to ping the aOS server
m('init ping functions');
function aOSping(callbackScript) {
	d(1, 'Pinging aOS...');
	var aOSpingxhttp = {};
	aOSpingxhttp = new XMLHttpRequest();
	aOSpingxhttp.onreadystatechange = function() {
		if (aOSpingxhttp.readyState === 4) {
			apps.savemaster.vars.saving = 0;
			taskbarShowHardware();
			callbackScript([perfCheck('aOSping'), aOSpingxhttp.status]);
		}
	};
	aOSpingxhttp.open('GET', 'xmlping.php', 'true');
	perfStart('aOSping');
	apps.savemaster.vars.saving = 1;
	taskbarShowHardware();
	aOSpingxhttp.send();
}

// Ping the CORS proxy
var corspingxhttp = {};
function corsPing(callbackScript) {
	d(2, 'Pinging CORS...');
	corspingxhttp = new XMLHttpRequest();
	corspingxhttp.onreadystatechange = function() {
		if (corspingxhttp.readyState === 4) {
			apps.savemaster.vars.saving = 0;
			taskbarShowHardware();
			callbackScript([perfCheck('corsping'), corspingxhttp.status]);
		}
	};
	corspingxhttp.open('GET', apps.settings.vars.corsProxy + 'https://duckduckgo.com/', 'true');
	perfStart('corsping');
	apps.savemaster.vars.saving = 1;
	taskbarShowHardware();
	corspingxhttp.send();
}

// Live elements allow dynamic content to be placed on the page w/o manual updating
var liveElements = [];

// Checks for live elements
function checkLiveElements() {
	liveElements = document.getElementsByClassName('liveElement');
	for (var elem in liveElements) {
		if (elem == parseInt(elem)) {
			if (liveElements[elem].getAttribute('data-live-target') === null) {
				try {
					liveElements[elem].innerHTML = eval(liveElements[elem].getAttribute('data-live-eval'));
				} catch (err) {
					liveElements[elem].innerHTML = 'LiveElement Error: ' + err;
				}
			} else {
				try {
					eval('liveElements[' + elem + '].' + liveElements[elem].getAttribute('data-live-target') + ' = "' + eval(liveElements[elem].getAttribute('data-live-eval')) + '"');
				} catch (err) {
					//doLog(' ');
					//doLog('LiveElement Error: ' + err, '#F00');
					//doLog('Element #' + elem, '#F00');
					//doLog('Target ' + liveElements[elem].getAttribute('data-live-target'), '#F00');
					//doLog('Value ' + liveElements[elem].getAttribute('data-live-eval'), '#F00');
				}
			}
		}
	}
	requestAnimationFrame(checkLiveElements);
}
requestAnimationFrame(checkLiveElements);

function logLiveElement(str) {
	doLog('<span class="liveElement" data-live-eval="' + str + '"></span>');
};

function makeLiveElement(str) {
	return '<span class="liveElement" data-live-eval="' + str + '"></span>';
}

// List of pinned apps
var pinnedApps = [];

function pinApp(app) {
	if (pinnedApps.indexOf(app) === -1) {
		pinnedApps.push(app);
	} else {
		pinnedApps.splice(pinnedApps.indexOf(app), 1);
	}
	ufsave('aos_system/taskbar/pinned_apps', JSON.stringify(pinnedApps));
}

// Application class
m('init Application class');
var apps = {};
window.apps = apps;
var appsSorted = [];
var appsSortedSafe = [];
var appTotal = 0;
var appPosX = 8;
var appPosY = 8;
var finishedMakingAppClicks = 0;
var Application = function (appIcon, appDesc, handlesLaunchTypes, mainFunction, signalHandlerFunction, appVariables, keepOffDesktop, appPath, appImg) {
	try {
		if (typeof appIcon === "object") {
			appImg = appIcon.image || "appicons/ds/aOS.png";
			appPath = appIcon.codeName;
			if (typeof appIcon.hideApp === "number") {
				keepOffDesktop = appIcon.hideApp;
			} else {
				keepOffDesktop = 1;
			}
			appVariables = appIcon.vars || {};
			signalHandlerFunction = appIcon.signalHandler || function (signal) {
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

							break;
						case 'shutdown':

							break;
						default:
							doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'", "#F00");
				}
			};
			mainFunction = appIcon.main || function() {};
			handlesLaunchTypes = appIcon.launchTypes || 0;
			appDesc = appIcon.title || "Application";
			appIcon = appIcon.abbreviation || "App";
		}
		
		// this used to be used in HTML elements but now is just an abbreviation
		this.dsktpIcon = appIcon;
		// now HTML elements match the codename of apps
		this.objName = appPath;
		if (typeof langContent.en.appNames[appPath] === 'string') {
			this.appDesc = lang('appNames', appPath);
		} else {
			this.appDesc = appDesc;
		}
		this.main = mainFunction;
		this.signalHandler = signalHandlerFunction;
		if (handlesLaunchTypes) {
			this.launchTypes = 1;
		} else {
			this.launchTypes = 0;
		}
		this.vars = appVariables;
		this.appWindow = {
			/*
					these are the elements that make up a window...
					pretend in this case the app is called "settings"
					anything below that says "settings" can be replaced with the name of your app
					
					div .window #win_settings_top           Topmost window div, contains entire window
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
					getId('win_' + this.objName + '_top').style.zIndex = '100';
					this.onTop = 1;
				} else if (!setTo && this.onTop) {
					getId('win_' + this.objName + '_top').style.zIndex = '90';
					this.onTop = 0;
				}
			},
			paddingMode: function (mode) {
				if (mode) {
					getId("win_" + this.objName + "_html").classList.remove('noPadding');
				} else {
					getId("win_" + this.objName + "_html").classList.add('noPadding');
				}
			},
			setDims: function (xOff, yOff, xSiz, ySiz, ignoreDimsSet) {
				d(2, 'Setting dims of window.');
				if (!this.fullscreen) {
					var windowCentered = [0, 0];
					if (xOff === "auto") {
						xOff = Math.round(parseInt(getId('desktop').style.width) / 2 - (xSiz / 2));
						windowCentered[0] = 1;
					}
					if (yOff === "auto") {
						yOff = Math.round(parseInt(getId('desktop').style.height) / 2 - (ySiz / 2));
						windowCentered[1] = 1;
					}
					xOff = Math.round(xOff);
					yOff = Math.round(yOff);
					if (this.windowX !== xOff) {
						getId("win_" + this.objName + "_top").style.left = xOff + "px";
						this.windowX = Math.round(xOff);
					}
					if (this.windowY !== yOff) {
						getId("win_" + this.objName + "_top").style.top = (yOff * (yOff > -1)) + "px";
						this.windowY = Math.round(yOff);
					}
					if (this.windowH !== xSiz) {
						getId("win_" + this.objName + "_top").style.width = xSiz + "px";
						getId("win_" + this.objName + "_aero").style.width = xSiz + 80 + "px";
						this.windowH = xSiz;
					}
					if (this.windowV !== ySiz) {
						if (!this.folded) {
							getId("win_" + this.objName + "_top").style.height = ySiz + "px";
						}
						
						getId("win_" + this.objName + "_aero").style.height = ySiz + 80 + "px";
						this.windowV = ySiz;
					}
					var aeroOffset = [0, -32];
					try {
						calcWindowblur(this.objName, 1);
					} catch (err) {
						getId("win_" + this.objName + "_aero").style.backgroundPosition = (-1 * xOff + 40 + aeroOffset[0]) + "px " + (-1 * (yOff * (yOff > -1)) + 40 + aeroOffset[1]) + "px";
					}
					
					if (typeof this.dimsSet === 'function' && !ignoreDimsSet) {
						this.dimsSet();
					}
					if (
						!this.fullscreen && (
							(windowCentered[0] && xSiz > parseInt(getId("desktop").style.width, 10)) ||
							(windowCentered[1] && ySiz > parseInt(getId("desktop").style.height, 10))
						)
					) {
						this.toggleFullscreen();
					}
				}
			},
			openWindow: function() {
				this.appIcon = 1;
				getId("win_" + this.objName + "_top").classList.remove('closedWindow');
				getId("win_" + this.objName + "_top").style.display = "block";
				getId("icn_" + this.objName).style.display = "inline-block";
				getId("icn_" + this.objName).classList.add("openAppIcon");
				getId("win_" + this.objName + "_top").style.pointerEvents = "";

				requestAnimationFrame(function() {
					getId("win_" + this.objName + "_top").style.transform = 'scale(1)';
					getId("win_" + this.objName + "_top").style.opacity = "1";
				}.bind(this));
				setTimeout(function() {
					if (this.appIcon) {
						getId("win_" + this.objName + "_top").style.display = "block";
						getId("win_" + this.objName + "_top").style.opacity = "1";
					}
				}.bind(this), 300);
			},
			closeWindow: function() {
				this.appIcon = 0;
				getId("win_" + this.objName + "_top").classList.add('closedWindow');

				getId('win_' + this.objName + '_top').style.transformOrigin = '';
				try {
					getId("win_" + this.objName + "_top").style.transform = 'scale(' + apps.settings.vars.winFadeDistance + ')';
				} catch (err) {
					getId("win_" + this.objName + "_top").style.transform = 'scale(0.8)';
				}
				getId("win_" + this.objName + "_top").style.opacity = "0";
				getId("win_" + this.objName + "_top").style.pointerEvents = "none";
				setTimeout(function() {
					if (!this.appIcon) {
						getId("win_" + this.objName + "_top").style.display = "none";
						getId("win_" + this.objName + "_top").style.width = "";
						getId("win_" + this.objName + "_top").style.height = "";
						this.windowH = -1;
						this.windowV = -1;
					}
				}.bind(this), 300);

				if (pinnedApps.indexOf(this.objName) === -1) {
					getId("icn_" + this.objName).style.display = "none";
				}
				getId("icn_" + this.objName).classList.remove("openAppIcon");
				this.fullscreen = 0;
				if (this.folded) {
					this.foldWindow();
				}
				toTop({
					dsktpIcon: 'CLOSING'
				}, 1);
			},
			closeIcon: function() {
				if (pinnedApps.indexOf(this.objName) === -1) {
					getId("icn_" + this.objName).style.display = "none";
				}
			},
			folded: 0,
			foldWindow: function() {
				if (this.folded) {
					getId('win_' + this.objName + '_html').style.display = 'block';
					getId('win_' + this.objName + '_top').style.height = this.windowV + 'px';
					this.folded = 0;
				} else {
					getId('win_' + this.objName + '_html').style.display = 'none';
					getId('win_' + this.objName + '_top').style.height = 32 + apps.settings.vars.winBorder + 'px';
					this.folded = 1;
				}
			},
			closeKeepTask: function() {
				if (this.objName !== 'startMenu') {
					if (!mobileMode) {
						try {
							getId("win_" + this.objName + "_top").style.transformOrigin = getId("icn_" + this.objName).getBoundingClientRect().left - this.windowX + 23 + 'px ' + (0 - this.windowY) + 'px';
						} catch (err) {
							getId("win_" + this.objName + "_top").style.transformOrigin = '50% -' + window.innerHeight + 'px';
						}
					} else {
						try {
							getId("win_" + this.objName + "_top").style.transformOrigin = getId("icn_" + this.objName).getBoundingClientRect().left + 23 + 'px 0px';
						} catch (err) {
							getId("win_" + this.objName + "_top").style.transformOrigin = '50% -' + window.innerHeight + 'px';
						}
					}
					getId("win_" + this.objName + "_top").style.transform = 'scale(0.1)';
					getId("win_" + this.objName + "_top").style.opacity = "0";
					setTimeout(function() {
						getId("win_" + this.objName + "_top").style.display = "none";
					}.bind(this), 300);
				} else {
					getId("win_" + this.objName + "_top").style.display = "none";
				}

				setTimeout("getId('icn_" + this.objName + "').classList.remove('activeAppIcon')", 0);
			},
			setCaption: function (newCap) {
				d(1, 'Changing caption.');
				if (this.appImg) {
					getId("win_" + this.objName + "_cap").innerHTML = buildSmartIcon(32, this.appImg) + '<div class="winCaptionTitle">' + newCap + '</div>';
				} else {
					getId("win_" + this.objName + "_cap").innerHTML = '<div class="winCaptionTitle">' + this.dsktpIcon + '|' + newCap + '</div>';
				}
			},
			setContent: function (newHTML) {
				getId("win_" + this.objName + "_html").innerHTML = newHTML;
			},
			toggleFullscreen: function() {
				d(1, 'Setting Maximise.');
				if (this.fullscreen) {
					this.fullscreen = 0;
					getId("win_" + this.objName + "_top").classList.remove("maximizedWindow");
				} else {
					this.fullscreen = 1;
					getId("win_" + this.objName + "_top").classList.add("maximizedWindow");
				}
			}
		};
		if (typeof this.appWindow.appImg === "string") {
			this.appWindow.appImg = {
				foreground: this.appWindow.appImg
			};
		}

		this.keepOffDesktop = keepOffDesktop;
		if (!this.keepOffDesktop) {
			newDsktpIcon(appPath, appPath, null, this.appDesc, this.appWindow.appImg,
				['arg', 'openapp(apps[arg], "dsktp");'], [appPath],
				['arg1', 'arg2', 'ctxMenu(baseCtx.appXXX, 1, event, [event, arg1, arg2]);'], [appPath, appIcon],
				1
			);
		}

		getId("desktop").innerHTML +=
			'<div class="window closedWindow" id="win_' + appPath + '_top">' +
			'<div class="winAero" id="win_' + appPath + '_aero"></div>' +
			'<div class="winBimg" id="win_' + appPath + '_img"></div>' +
			'<div class="winRes cursorOpenHand" id="win_' + appPath + '_size"></div>' +
			'<div class="winCap cursorOpenHand noselect" id="win_' + appPath + '_cap">' +
			'</div>' +
			'<div class="winFld cursorPointer noselect" id="win_' + appPath + '_fold">^' +
			'</div>' +
			'<div class="winHTML" id="win_' + appPath + '_html">' +
			'</div>' +
			'<div class="winBig cursorPointer noselect" id="win_' + appPath + '_big">o' +
			'</div>' +
			'<div class="winShrink cursorPointer noselect" id="win_' + appPath + '_shrink">v' +
			'</div>' +
			'<div class="winExit cursorPointer noselect" id="win_' + appPath + '_exit">x' +
			'</div></div>';
		if (this.appWindow.appImg) {
			getId("icons").innerHTML +=
				'<div class="icon cursorPointer" id="icn_' + appPath + '">' +
				'<div class="iconOpenIndicator"></div>' +
				buildSmartIcon(32, this.appWindow.appImg, "margin-left:6px") +
				'<div class="taskbarIconTitle" id="icntitle_' + appPath + '">' + appDesc + '</div>' +
				'</div>';
		} else {
			getId("icons").innerHTML +=
				'<div class="icon cursorPointer" id="icn_' + appPath + '">' +
				'<div class="iconOpenIndicator"></div>' +
				'<div class="iconImg">' + appIcon +
				'</div></div>';
		}
		getId("win_" + appPath + "_cap").setAttribute("onmousedown", "if(!apps.settings.vars.clickToMove){if(event.button!==2){toTop(apps." + appPath + ");winmove(event);}event.preventDefault();return false;}");
		getId("win_" + appPath + "_size").setAttribute("onmousedown", "if(!apps.settings.vars.clickToMove){if(event.button!==2){toTop(apps." + appPath + ");winres(event);}event.preventDefault();return false;}");
		getId("win_" + appPath + "_cap").setAttribute("onclick", "if(apps.settings.vars.clickToMove){if(event.button!==2){toTop(apps." + appPath + ");winmove(event);}event.preventDefault();return false;}");
		getId("win_" + appPath + "_size").setAttribute("onclick", "if(apps.settings.vars.clickToMove){if(event.button!==2){toTop(apps." + appPath + ");winres(event);}event.preventDefault();return false;}");
		getId("icn_" + appPath).setAttribute("onClick", "openapp(apps." + appPath + ", function(){if(apps." + appPath + ".appWindow.appIcon){return 'tskbr'}else{return 'dsktp'}}())");
		getId("win_" + appPath + "_top").setAttribute("onClick", "toTop(apps." + appPath + ")");
		if (appPath !== 'startMenu' && appPath !== 'nora') {
			getId("icn_" + appPath).setAttribute("oncontextmenu", "ctxMenu(baseCtx.icnXXX, 1, event, '" + appPath + "')");
			getId("icn_" + appPath).setAttribute("onmouseenter", "if(apps." + appPath + ".appWindow.appIcon){highlightWindow('" + appPath + "')}");
			getId("icn_" + appPath).setAttribute("onmouseleave", "highlightHide()");
		}
		getId("win_" + appPath + "_exit").setAttribute("onClick", "apps." + appPath + ".signalHandler('close');event.stopPropagation()");
		getId("win_" + appPath + "_shrink").setAttribute("onClick", "apps." + appPath + ".signalHandler('shrink');event.stopPropagation()");
		getId("win_" + appPath + "_big").setAttribute("onClick", "apps." + appPath + ".appWindow.toggleFullscreen()");
		getId("win_" + appPath + "_fold").setAttribute("onClick", "apps." + appPath + ".appWindow.foldWindow()");
		getId("win_" + appPath + "_cap").setAttribute("oncontextmenu", "ctxMenu(baseCtx.winXXXc, 1, event, '" + appPath + "')");
	} catch (err) {
		if (doLog) {
			doLog(err, '#F00');
		}
	}
};

// Desktop vars
var dsktp = {};
function newDsktpIcon(id, owner, position, title, icon, action, actionArgs, ctxAction, ctxActionArgs, nosave) {
	if (!id) id = "uico_" + (new Date().getTime());
	if (!title) {
		// TODO: TEST THE || SYNTAX HERE
		title = apps[owner] ? apps[owner].appDesc : "Icon";
	}
	if (!icon) {
		if (apps[owner]) {
			icon = {
				...apps[owner].appWindow.appImg
			};
		} else {
			icon = {
				...apps.startMenu.appWindow.appImg
			};
		}
	}
	if (typeof icon === "string") {
		icon = { foreground: icon };
	}

	if (!action) {
		if (apps[owner]) {
			action = [
				'arg',
				'openapp(apps[arg], "dsktp");'
			];
			actionArgs = [owner];
		} else {
			action = [
				'apps.prompt.vars.alert("This icon has no assigned action.", "Okay.", function(){}, "AaronOS");'
			];
			actionArgs = [];
		}
	}

	if (typeof action === "string") action = [action];
	if (!actionArgs) actionArgs = [];
	if (!ctxAction) {
		if (apps[owner]) {
			ctxAction = [
				'arg1', 'arg2',
				'ctxMenu(baseCtx.appXXX, 1, event, [event, arg1, arg2]);'
			]
			ctxActionArgs = [id, apps[owner].dsktpIcon];
		} else {
			ctxAction = [
				'arg1',
				'ctxMenu(baseCtx.appXXX, 1, event, [event, arg1, "aOS"]);'
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
		ctxActionArgs: ctxActionArgs || []
	};
	if (getId("app_" + id)) {
		getId("desktop").removeChild(getId("app_" + id));
	}
	let tempIco = document.createElement("div");
	tempIco.classList.add("app");
	tempIco.classList.add("cursorPointer");
	tempIco.classList.add("noselect");
	tempIco.id = "app_" + id;
	tempIco.setAttribute("data-icon-id", id);
	tempIco.setAttribute("onclick", 'Function(...dsktp[this.getAttribute("data-icon-id")].action)(...dsktp[this.getAttribute("data-icon-id")].actionArgs)');
	tempIco.setAttribute('oncontextmenu', 'Function(...dsktp[this.getAttribute("data-icon-id")].ctxAction)(...dsktp[this.getAttribute("data-icon-id")].ctxActionArgs)');
	tempIco.innerHTML = '<div class="appIcon" id="ico_' + id + '" style="pointer-events:none">' +
		buildSmartIcon(64, icon) +
		'</div>' +
		'<div class="appDesc" id="dsc_' + id + '">' + title + '</div>';
	getId("desktop").appendChild(tempIco);
	if (!nosave) {
		ufsave("aos_system/desktop/user_icons/ico_" + id, JSON.stringify(dsktp[id]));
	}
	arrangeDesktopIcons();
}

function removeDsktpIcon(id, nosave) {
	if (dsktp[id]) {
		delete dsktp[id];
		getId("desktop").removeChild(getId("app_" + id));
		if (!nosave) {
			if (ufload("aos_system/desktop/user_icons/ico_" + id)) {
				ufdel("aos_system/desktop/user_icons/ico_" + id);
			} else {
				ufsave("aos_system/desktop/user_icons/ico_" + id, JSON.stringify({
					"removed": "true",
					"id": id
				}));
			}
		}
		arrangeDesktopIcons();
	}
};

function arrangeDesktopIcons() {
	appTotal = 0;
	appPosX = 8;
	appPosY = 8;
	for (let ico in dsktp) {
		if (!dsktp[ico].position) {
			appTotal++;
			getId("app_" + ico).style.left = appPosX + "px";
			getId("app_" + ico).style.top = appPosY + "px";
			appPosY += 98;
			if (appPosY > parseInt(getId('monitor').style.height) - 138) {
				appPosY = 8;
				appPosX += 108;
			}
		} else {
			getId("app_" + ico).style.left = dsktp[ico].position[0] + "px";
			getId("app_" + ico).style.top = dsktp[ico].position[1] + "px";
		}
	}
}

var widgetsList = {};
FlowWidget();
NotificationsWidget();
TimeWidget();

// Text-editing functionality
function showEditContext(event, fromWebApp, webAppPosition, webAppConversation, webAppFrame, webAppOrigin, webAppPaste) {
	textEditorTools.tempvar = currentSelection.length === 0 ? '-' : ' ';
	let canPasteHere = 0;
	if (!fromWebApp) {
		if ((event.target.tagName === "INPUT" && (event.target.getAttribute("type") === "text" || event.target.getAttribute("type") === "password" || event.target.getAttribute("type") === null)) || event.target.tagName === "TEXTAREA") {
			canPasteHere = 1;
		}
	} else {
		canPasteHere = webAppPaste;
		textEditorTools.webAppInfo = [webAppConversation, webAppFrame, webAppOrigin];
	}
	if (!fromWebApp) {
		textEditorTools.tmpGenArray = [
			[event.pageX, event.pageY, "ctxMenu/beta/happy.png"], textEditorTools.tempvar + "Speak \'" + currentSelection.substring(0, 5).split("\n").join(' ').split('<').join('&lt;').split('>').join('&gt;') + "...\'", "textspeech(\'" + currentSelection.split("\n").join('<br>').split('\\').join('\\\\').split('"').join("&quot;").split("'").join("&quot;").split('<').join('&lt;').split('>').join('&gt;') + "\');getId(\'ctxMenu\').style.display = \'none\'"
		];
	} else {
		let framePosition = webAppFrame.getBoundingClientRect();
		textEditorTools.tmpGenArray = [
			[webAppPosition[0] + framePosition.x, webAppPosition[1] + framePosition.y, "ctxMenu/beta/happy.png"], textEditorTools.tempvar + "Speak \'" + currentSelection.substring(0, 5).split("\n").join(' ').split('<').join('&lt;').split('>').join('&gt;') + "...\'", "textspeech(\'" + currentSelection.split("\n").join('<br>').split('\\').join('\\\\').split('"').join("&quot;").split("'").join("&quot;").split('<').join('&lt;').split('>').join('&gt;') + "\');apps.webAppMaker.vars.postReply({messageType:\'response\',content:\'spoken\',conversation:textEditorTools.webAppInfo[0]}, textEditorTools.webAppInfo[2], textEditorTools.webAppInfo[1].contentWindow);getId(\'ctxMenu\').style.display = \'none\'"
		];
	}
	for (let i = 1; i <= textEditorTools.slots; i++) {
		if (currentSelection.length === 0) {
			textEditorTools.tempvar = '-';
			textEditorTools.tempvar2 = '_';
		} else {
			textEditorTools.tempvar = ' ';
			textEditorTools.tempvar2 = '+';
		}
		if (i === 1) {
			textEditorTools.tmpGenArray.push(textEditorTools.tempvar2 + 'Copy 1 (' + cleanStr(currentSelection.substring(0, 5)) + '...)');
		} else {
			textEditorTools.tmpGenArray.push(textEditorTools.tempvar + 'Copy ' + i + ' (' + cleanStr(currentSelection.substring(0, 5)) + '...)');
		}
		textEditorTools.tmpGenArray[0].push('ctxMenu/beta/load.png');
		// TODO: Clean up
		if (!fromWebApp) {
			textEditorTools.tmpGenArray.push('textEditorTools.copy(' + (i - 0) + ');getId(\'ctxMenu\').style.display = \'none\'');
		} else {
			textEditorTools.tmpGenArray.push('textEditorTools.copy(' + (i - 0) + ');apps.webAppMaker.vars.postReply({messageType:\'response\',content:\'copied\',conversation:textEditorTools.webAppInfo[0]}, textEditorTools.webAppInfo[2], textEditorTools.webAppInfo[1].contentWindow);getId(\'ctxMenu\').style.display = \'none\'');
		}
	}

	if (canPasteHere) {
		for (let i = 1; i <= textEditorTools.slots; i++) {
			if (!fromWebApp) {
				if (textEditorTools.clipboard[i - 1].length === 0 || (typeof event.target.id !== "string" || event.target.id === "") || event.target.getAttribute("disabled") !== null) {
					textEditorTools.tmpGenArray.push(`${i === 1 ? '_' : '-'}Paste ${i} (${cleanStr(textEditorTools.clipboard[i - 1].substring(0, 5))}...)`);
					textEditorTools.tmpGenArray.push('');
				} else {
					textEditorTools.tmpGenArray.push(`${i === 1 ? '+' : ' '}Paste ${i} (${cleanStr(textEditorTools.clipboard[i - 1].substring(0, 5))}...)`);
					textEditorTools.tmpGenArray.push('textEditorTools.paste(\'' + event.target.id + '\', ' + i + ', ' + event.target.selectionStart + ',' + event.target.selectionEnd + ');getId(\'ctxMenu\').style.display = \'none\'');
				}
			} else {
				if (textEditorTools.clipboard[i - 1].length === 0) {
					textEditorTools.tmpGenArray.push(`${i === 1 ? '_' : '-'}Paste ${i} (${cleanStr(textEditorTools.clipboard[i - 1].substring(0, 5))}...)`);
					textEditorTools.tmpGenArray.push('');
				} else {
					textEditorTools.tmpGenArray.push(`${i === 1 ? '+' : ' '}Paste ${i} (${cleanStr(textEditorTools.clipboard[i - 1].substring(0, 5))}...)`);
					textEditorTools.tmpGenArray.push('apps.webAppMaker.vars.postReply({messageType:\'response\',content:\'pasted\',pastedText:textEditorTools.clipboard[' + (i - 1) + '],conversation:textEditorTools.webAppInfo[0]}, textEditorTools.webAppInfo[2], textEditorTools.webAppInfo[1].contentWindow);getId(\'ctxMenu\').style.display = \'none\'');
				}
			}
			textEditorTools.tmpGenArray[0].push('ctxMenu/beta/save.png');
		}
	}
	textEditorTools.tempvar3 = currentSelection;
	ctxMenu(textEditorTools.tmpGenArray);
}

var textEditorTools = {
	tempvar: '',
	tempvar2: '',
	tempvar3: '',
	webAppInfo: {},
	slots: 2,
	updateSlots: function() {
		clipboard = [];
		for (let i = 0; i < this.slots; i++) {
			this.clipboard.push("");
		}
	},
	clipboard: ["", ""],
	tmpGenArray: [],
	copy: function (slot) {
		this.clipboard[slot - 1] = this.tempvar3;
		ufsave("aos_system/clipboard", JSON.stringify(this.clipboard));
	},
	paste: function (element, slot, cursorpos, endselect) {
		getId(element).value = getId(element).value.substring(0, cursorpos) + this.clipboard[slot - 1] + getId(element).value.substring(endselect, getId(element).value.length);
	},
	swap: function (element, slot, cursorpos) {
		var tempCopy = this.clipboard[slot - 1];
		this.clipboard[slot - 1] = this.tempvar3;
		ufsave("aos_system/clipboard", JSON.stringify(this.clipboard));
		getId(element).value = getId(element).value.substring(0, cursorpos) + tempCopy + getId(element).value.substring(cursorpos, getId(element).value.length);
	}
};

// Start menu
m('init DsB');
var codeToRun = [];

function c(code, args) {
	if (typeof code === 'function') {
		if (args) {
			codeToRun.push([code, args]);
		} else {
			codeToRun.push(code);
		}
	}
}

var workingcodetorun = [];
var totalWaitingCodes = 0;
var finishedWaitingCodes = 0;

function checkWaitingCode() {
	if (codeToRun.length == 0) return;

	m('Running Waiting Code');
	workingcodetorun = codeToRun.shift();
	if (typeof workingcodetorun === 'function') {
		workingcodetorun();
	} else {
		workingcodetorun[0](workingcodetorun[1]);
	}

	finishedWaitingCodes++;
}

var waitingCodeInterval = window.setInterval(checkWaitingCode, 0);
function crashWaitingCodeInterval() {
	window.clearInterval(waitingCodeInterval);
}

function startWaitingCodeInterval() {
	waitingCodeInterval = window.setInterval(checkWaitingCode, 0);
}

getId('aOSloadingInfo').innerHTML = 'Applications List';
c(function() {
	Dashboard();
	getId('aOSloadingInfo').innerHTML = 'NORAA';
});

c(function() {
	m('init NRA');
	NORA();
	getId('aOSloadingInfo').innerHTML = 'Info Viewer...';
});

c(function() {
	m('init Nfo');
	AppInfo();
	getId('aOSloadingInfo').innerHTML = 'JavaScript Console';
});

var currentSelection = "";
function setCurrentSelection() {
	currentSelection = window.getSelection().toString();
	requestAnimationFrame(setCurrentSelection);
}

requestAnimationFrame(setCurrentSelection);
c(function() {
	m('init jsC');
	JSConsole();
	getId('aOSloadingInfo').innerHTML = 'Bash Console';
});

c(() => Bash());

c(function() {
	m('init PMT');
	AppPrompt();
	getId('aOSloadingInfo').innerHTML = 'Settings';
});

c(function() {
	m('init Settings');
	Settings();
	getId('aOSloadingInfo').innerHTML = 'Smart Icon Settings';
});

c(function() {
	SmartIconSettings();
	getId('aOSloadingInfo').innerHTML = 'Desktop Icon Maker';
})

var files;
c(function() {
	m('init NP2');
	TextEditor();
	getId('aOSloadingInfo').innerHTML = 'Files';
});
c(function() {
	m('init files');
	window.aOSversion = 'B1.6.9.2 (11/14/2021) r1';
	document.title = 'AaronOS ' + aOSversion;
	getId('aOSloadingInfo').innerHTML = 'Properties Viewer';
});
c(function() {
	m('init PPT');
	PropertiesViewer();
	getId('aOSloadingInfo').innerHTML = 'File Manager';
});
c(function() {
	m('init FIL');
	FileManager();
});

c(function() {
	window.SRVRKEYWORD = window.SRVRKEYWORD || "";
	m('init SAV');
	SaveMaster();
	getId('aOSloadingInfo').innerHTML = 'Web App Maker';
});

c(function() {
	WebAppMaker();
	getId('aOSloadingInfo').innerHTML = 'Messaging';
});

c(function() {
	m('init MSG');
	Messaging();
	getId('aOSloadingInfo').innerHTML = 'Music Player';
});

c(function() {
	m('init MSC');
	MusicPlayer();
	getId('aOSloadingInfo').innerHTML = 'Apps Browser';
});

c(function() {
	AppBrowser();
	getId('aOSloadingInfo').innerHTML = 'Sticky Note';
});

c(function() {
	StickyNote();
	getId('aOSloadingInfo').innerHTML = 'Bootscript App';
});

c(function() {
	BootScript();
});

c(function() {
	AppCenter();
	getId('aOSloadingInfo').innerHTML = 'Developer Documentation';
});

c(function() {
	m('init DD');
	DeveloperDocumentation();
	getId('aOSloadingInfo').innerHTML = 'Finalizing...';
});
m('init finalizing');

// Function to open apps
var currTopApp = '';
function toTop(appToNudge, dsktpClick) {
	m('Moving App ' + appToNudge.dsktpIcon + ' to Top');
	currTopApp = '';
	if (dsktpClick !== 2) {
		for (var appLication in apps) {
			if (getId("win_" + apps[appLication].objName + "_top").style.zIndex !== "100") {
				getId("win_" + apps[appLication].objName + "_top").style.zIndex = parseInt(getId("win_" + apps[appLication].objName + "_top").style.zIndex, 10) - 1;
			}
			getId("win_" + apps[appLication].objName + "_cap").style.opacity = "1";
			getId("win_" + apps[appLication].objName + "_aero").style.opacity = "1";
			getId('icn_' + apps[appLication].objName).classList.remove('activeAppIcon');
		}
	}
	if (!dsktpClick) {
		if (appToNudge.appWindow.appIcon && getId("win_" + appToNudge.objName + "_top").style.opacity !== "1") {
			appToNudge.appWindow.openWindow();
		}
		if (getId("win_" + appToNudge.objName + "_top").style.zIndex !== "100") {
			getId("win_" + appToNudge.objName + "_top").style.zIndex = "90";
		}
		getId("win_" + appToNudge.objName + "_cap").style.opacity = "1";
		getId("win_" + appToNudge.objName + "_aero").style.opacity = "1";
		getId('icn_' + appToNudge.objName).classList.add('activeAppIcon');
		try {
			currTopApp = appToNudge.objName;
			document.title = appToNudge.appDesc + ' | aOS ' + aOSversion;
		} catch (err) {
			document.title = 'AaronOS';
		}
	} else {
		try {
			document.title = 'AaronOS ' + aOSversion;
		} catch (err) {
			document.title = 'AaronOS';
		}
	}
	if (appToNudge !== apps.startMenu && apps.startMenu.appWindow.appIcon) {
		apps.startMenu.signalHandler('shrink');
	}
	getId("ctxMenu").style.display = "none";

	if (appToNudge.dsktpIcon !== "CLOSING") {
		var tempAppsList = [];
		for (let appLication in apps) {
			if (getId("win_" + apps[appLication].objName + "_top").style.zIndex !== "100" && apps[appLication].appWindow.appIcon) {
				tempAppsList.push([appLication, getId("win_" + apps[appLication].objName + "_top").style.zIndex]);
			}
		}
		tempAppsList.sort(function (a, b) {
			return b[1] - a[1];
		});
		for (let i = 0; i < tempAppsList.length; i++) {
			getId("win_" + apps[tempAppsList[i][0]].objName + "_top").style.zIndex = 90 - i;
		}
	}
}

function openapp(appToOpen, launchTypeUsed) {
	m('Opening App ' + appToOpen.dsktpIcon);
	if (appToOpen.launchTypes) {
		appToOpen.main(launchTypeUsed);
	} else {
		appToOpen.main();
	}
	toTop(appToOpen);
}

// Function to remove broken text warning
finishedMakingAppClicks = 1;
function fadeResizeText() {
	getId("timesUpdated").style.display = "none";
}

var icomoveSelect = "";
var icomovex = 0;
var icomovey = 0;
var icomoveOrX = 0;
var icomoveOrY = 0;

function icomove(e, elem) {
	if (elem) {
		getId("icomove").style.display = "block";
		icomoveSelect = "app_" + elem;
		icomovex = e.pageX;
		icomovey = e.pageY;
		icomoveOrX = parseInt(getId(icomoveSelect).style.left, 10);
		icomoveOrY = parseInt(getId(icomoveSelect).style.top, 10);
		toTop({
			dsktpIcon: 'DESKTOP'
		}, 1);
	} else {
		getId("icomove").style.display = "none";
		var newXCoord = icomoveOrX + (e.pageX - icomovex) * (1 / screenScale);
		var newYCoord = icomoveOrY + (e.pageY - icomovey) * (1 / screenScale);
		newXCoord = Math.round(newXCoord / 108) * 108 + 8;
		newYCoord = Math.round(newYCoord / 98) * 98 + 8;
		dsktp[icomoveSelect.substring(4)].position = [newXCoord, newYCoord];
		ufsave('aos_system/desktop/user_icons/ico_' + icomoveSelect.substring(4), JSON.stringify(dsktp[icomoveSelect.substring(4)]));
		getId(icomoveSelect).style.left = newXCoord + "px";
		getId(icomoveSelect).style.top = newYCoord + "px";
	}
}

getId("icomove").addEventListener("click", icomove);
function icomoving(e) {
	getId(icomoveSelect).style.left = icomoveOrX + (e.pageX - icomovex) * (1 / screenScale) + "px";
	getId(icomoveSelect).style.top = icomoveOrY + (e.pageY - icomovey) * (1 / screenScale) + "px";
}

// Custom icons
function icnmove(e, elem) {
	if (elem) {
		getId("icnmove").style.display = "block";
		icomoveSelect = "app" + elem;
		icomovex = e.pageX;
		icomovey = e.pageY;
		icomoveOrX = parseInt(getId(icomoveSelect).style.left, 10);
		icomoveOrY = parseInt(getId(icomoveSelect).style.top, 10);
		toTop({
			dsktpIcon: 'DESKTOP'
		}, 1);
	} else {
		getId("icnmove").style.display = "none";
		var newXCoord = icomoveOrX + (e.pageX - icomovex) * (1 / screenScale);
		var newYCoord = icomoveOrY + (e.pageY - icomovey) * (1 / screenScale);
		newXCoord = Math.round(newXCoord / 108) * 108 + 8;
		newYCoord = Math.round(newYCoord / 98) * 98 + 8;
		getId(icomoveSelect).style.left = newXCoord + "px";
		getId(icomoveSelect).style.top = newYCoord + "px";
	}
}

getId("icnmove").addEventListener("click", icnmove);
function icnmoving(e) {
	getId(icomoveSelect).style.left = icomoveOrX + (e.pageX - icomovex) * (1 / screenScale) + "px";
	getId(icomoveSelect).style.top = icomoveOrY + (e.pageY - icomovey) * (1 / screenScale) + "px";
}

function scrollHorizontally(event) {
	this.scrollBy({
		left: event.deltaY,
		behavior: 'smooth'
	});
}
getId("icons").addEventListener("wheel", scrollHorizontally);

function highlightHide() {
	getId('windowFrameOverlay').style.display = 'none';
}

c(function() {
	openapp(apps.settings);
	c(function() {
		apps.settings.signalHandler('close');
	});
});
var ctxSetup = [
	[0, 0, "appicons/ds/redx.png", "appicons/ds/redx.png"],
	' Context', 'alert("Context Menu Not Correctly Initialized")',
	' Menu', 'alert("Context Menu Not Correctly Initialized")'
];
var newCtxSetup = [
	[' Context', function() {
		alert('context')
	}, 'appicons/ds/redx.png'],
	[' Menu', function() {
		alert('menu')
	}, 'appicons/ds/redx.png']
];
var newCtxCoord = [10, 10];
var newCtxArgs = [];
var ctxMenuImg = "";
var showingCtxMenu = 0;

function ctxMenu(setupArray, version, event, args) {
	m('Opening ctxMenu');
	if (version) {
		if (!showingCtxMenu) {
			showingCtxMenu = 1;
			requestAnimationFrame(function() {
				showingCtxMenu = 0;
			});
			newCtxCoord = [event.pageX * (1 / screenScale), event.pageY * (1 / screenScale)];
			newCtxArgs = args;
			newCtxSetup = setupArray;
			getId("ctxMenu").style.display = "block";
			if (newCtxCoord[0] > window.innerWidth * (1 / screenScale) / 2) {
				getId("ctxMenu").style.removeProperty("left");
				getId("ctxMenu").style.right = window.innerWidth * (1 / screenScale) - newCtxCoord[0] - 1 + "px";
			} else {
				getId("ctxMenu").style.removeProperty("right");
				getId("ctxMenu").style.left = newCtxCoord[0] + "px";
			}
			if (newCtxCoord[1] > window.innerHeight * (1 / screenScale) / 2) {
				getId("ctxMenu").style.removeProperty("top");
				getId("ctxMenu").style.bottom = window.innerHeight * (1 / screenScale) - newCtxCoord[1] - 1 + "px";
			} else {
				getId("ctxMenu").style.removeProperty("bottom");
				getId("ctxMenu").style.top = newCtxCoord[1] + "px";
			}
			getId("ctxMenu").innerHTML = "";
			var tempCtxContent = "";
			for (var i in newCtxSetup) {
				if (typeof newCtxSetup[i][0] === 'function') {
					if (newCtxSetup[i][0](newCtxArgs)[0] === '+' || newCtxSetup[i][0](newCtxArgs)[0] === '_') {
						tempCtxContent += '<hr>';
					}
					if (newCtxSetup[i][2]) {
						ctxMenuImg = '<img src="' + newCtxSetup[i][2] + '" style="width:10px; height:10px; margin-top:1px; margin-bottom:-2px; margin-left:1px;" onerror="this.style.marginLeft = \'0\';this.style.marginRight = \'1px\';this.src = \'ctxMenu/beta/simple.png\'">';
					} else {
						ctxMenuImg = '<img src="ctxMenu/beta/simple.png" style="width:10px; height:10px; margin-top:1px; margin-bottom:-2px; margin-right:1px">';
					}
					if (newCtxSetup[i][0](newCtxArgs)[0] === '-' || newCtxSetup[i][0](newCtxArgs)[0] === '_') {
						tempCtxContent += '<p class="hiddenCtxOption">' + ctxMenuImg + "&nbsp;" + newCtxSetup[i][0](newCtxArgs).substring(1, newCtxSetup[i][0](newCtxArgs).length) + '&nbsp;</p>';
					} else {
						tempCtxContent += '<p class="cursorPointer" onClick="newCtxSetup[' + i + '][1](newCtxArgs)">' + ctxMenuImg + "&nbsp;" + newCtxSetup[i][0](newCtxArgs).substring(1, newCtxSetup[i][0](newCtxArgs).length) + '&nbsp;</p>';
					}
				} else {
					if (newCtxSetup[i][0][0] === '+' || newCtxSetup[i][0][0] === '_') {
						tempCtxContent += '<hr>';
					}
					if (newCtxSetup[i][2]) {
						ctxMenuImg = '<img src="' + newCtxSetup[i][2] + '" style="width:10px; height:10px; margin-top:1px; margin-bottom:-2px; margin-left:1px;" onerror="this.style.marginLeft = \'0\';this.style.marginRight = \'1px\';this.src = \'ctxMenu/beta/simple.png\'">';
					} else {
						ctxMenuImg = '<img src="ctxMenu/beta/simple.png" style="width:10px; height:10px; margin-top:1px; margin-bottom:-2px; margin-right:1px">';
					}
					if (newCtxSetup[i][0][0] === '-' || newCtxSetup[i][0][0] === '_') {
						tempCtxContent += '<p class="hiddenCtxOption">' + ctxMenuImg + "&nbsp;" + newCtxSetup[i][0].substring(1, newCtxSetup[i][0].length) + '&nbsp;</p>';
					} else {
						tempCtxContent += '<p class="cursorPointer" onClick="newCtxSetup[' + i + '][1](newCtxArgs)">' + ctxMenuImg + "&nbsp;" + newCtxSetup[i][0].substring(1, newCtxSetup[i][0].length) + '&nbsp;</p>';
					}
				}
			}
			getId("ctxMenu").innerHTML = tempCtxContent;
		}
	} else {
		if (!showingCtxMenu) {
			showingCtxMenu = 1;
			requestAnimationFrame(function() {
				showingCtxMenu = 0;
			});
			ctxSetup = setupArray;
			getId("ctxMenu").style.display = "block";
			ctxSetup[0][0] *= (1 / screenScale);
			ctxSetup[0][1] *= (1 / screenScale);
			if (ctxSetup[0][0] > window.innerWidth * (1 / screenScale) / 2) {
				getId("ctxMenu").style.removeProperty("left");
				getId("ctxMenu").style.right = window.innerWidth * (1 / screenScale) - ctxSetup[0][0] - 1 + "px";
			} else {
				getId("ctxMenu").style.removeProperty("right");
				getId("ctxMenu").style.left = ctxSetup[0][0] + "px";
			}
			if (ctxSetup[0][1] > window.innerHeight * (1 / screenScale) / 2) {
				getId("ctxMenu").style.removeProperty("top");
				getId("ctxMenu").style.bottom = window.innerHeight * (1 / screenScale) - ctxSetup[0][1] - 1 + "px";
			} else {
				getId("ctxMenu").style.removeProperty("bottom");
				getId("ctxMenu").style.top = ctxSetup[0][1] + "px";
			}

			getId("ctxMenu").innerHTML = "";
			var tempCtxContent = "";

			// First char of name of element: + means new group | - means cannot click | _ means new group and cannot click
			for (var i = 1; i < ctxSetup.length - 1; i += 2) {
				if (i !== 1) {
					if (ctxSetup[i][0] === '+' || ctxSetup[i][0] === '_') {
						tempCtxContent += '<hr>';
					}
				}
				if (ctxSetup[0][2]) {
					ctxMenuImg = '<img src="' + ctxSetup[0][Math.floor(i / 2) + 2] + '" style="width:10px; height:10px; margin-top:1px; margin-bottom:-2px; margin-left:1px;" onerror="this.style.marginLeft = \'0\';this.style.marginRight = \'1px\';this.src = \'ctxMenu/beta/simple.png\'">';
				} else {
					ctxMenuImg = '<img src="ctxMenu/beta/simple.png" style="width:10px; height:10px; margin-top:1px; margin-bottom:-2px; margin-right:1px">';
				}
				if (ctxSetup[i][0] === '-' || ctxSetup[i][0] === '_') {
					tempCtxContent += '<p class="hiddenCtxOption">' + ctxMenuImg + "&nbsp;" + ctxSetup[i].substring(1, ctxSetup[i].length) + '&nbsp;</p>';
				} else {
					tempCtxContent += '<p class="cursorPointer" onClick="' + ctxSetup[i + 1] + '">' + ctxMenuImg + "&nbsp;" + ctxSetup[i].substring(1, ctxSetup[i].length) + '&nbsp;</p>';
				}
			}
			getId("ctxMenu").innerHTML = tempCtxContent;
		}
	}
}

var baseCtx = {
	hideall: [
		[' ' + lang('ctxMenu', 'settings'), function() {
			openapp(apps.settings, 'dsktp');
		}, 'ctxMenu/beta/gear.png'],
		[' ' + lang('ctxMenu', 'jsConsole'), function() {
			openapp(apps.jsConsole, 'dsktp');
		}, 'ctxMenu/beta/console.png'],
		['+' + lang('ctxMenu', 'screenResolution'), function() {
			openapp(apps.settings, 'dsktp');
			apps.settings.vars.showMenu(apps.settings.vars.menus.screenRes);
		}, 'ctxMenu/beta/gear.png']
	],
	desktop: [
		[' ' + lang('ctxMenu', 'settings'), function() {
			openapp(apps.settings, 'dsktp');
		}, 'ctxMenu/beta/gear.png'],
		[' ' + lang('ctxMenu', 'jsConsole'), function() {
			openapp(apps.jsConsole, 'dsktp');
		}, 'ctxMenu/beta/console.png'],
		[function() {
			return '+' + lang('ctxMenu', 'speak') + ' "' + currentSelection.substring(0, 5) + '..."'
		}, function() {
			textspeech(currentSelection);
		}, 'ctxMenu/beta/happy.png']
	],
	taskbar: [
		[' ' + lang('ctxMenu', 'settings'), function() {
			openapp(apps.settings, 'dsktp');
		}, 'ctxMenu/beta/gear.png'],
		[' ' + lang('ctxMenu', 'jsConsole'), function() {
			openapp(apps.jsConsole, 'dsktp');
		}, 'ctxMenu/beta/console.png'],
		['+' + lang('ctxMenu', 'taskbarSettings'), function() {
			openapp(apps.settings, 'dsktp');
			apps.settings.vars.showMenu(apps.settings.vars.menus.taskbar);
		}, 'ctxMenu/beta/gear.png']
	],
	appXXX: [
		[' ' + lang('ctxMenu', 'openApp'), function (args) {
			openapp(apps[args[1]], 'dsktp');
		}, 'ctxMenu/beta/window.png'],
		['+' + lang('ctxMenu', 'moveIcon'), function (args) {
			icomove(args[0], args[1]);
		}],
		['+Delete Icon', function (args) {
			removeDsktpIcon(args[1]);
		}, 'ctxMenu/beta/x.png']
	],
	appXXXjs: [
		[' Execute', function (args) {
			Function(...dsktp[args[1]].action)(...dsktp[args[1]].actionArgs);
		}, 'ctxMenu/beta/window.png'],
		['+' + lang('ctxMenu', 'moveIcon'), function (args) {
			icomove(args[0], args[1]);
		}],
		['+Delete Icon', function (args) {
			removeDsktpIcon(args[1]);
		}, 'ctxMenu/beta/x.png']
	],
	icnXXX: [
		[function (arg) {
			if (apps[arg].appWindow.appIcon) {
				return ' ' + lang('ctxMenu', 'showApp');
			} else {
				return ' ' + lang('ctxMenu', 'openApp');
			}
		}, function (arg) {
			if (apps[arg].appWindow.appIcon) {
				openapp(apps[arg], 'tskbr');
			} else {
				openapp(apps[arg], 'dsktp');
			}
		}, 'ctxMenu/beta/window.png'],
		[function (arg) {
			if (apps[arg].appWindow.appIcon) {
				return ' ' + lang('ctxMenu', 'hideApp');
			} else {
				return '-' + lang('ctxMenu', 'hideApp');
			}
		}, function (arg) {
			apps[arg].signalHandler('shrink');
		}, 'ctxMenu/beta/minimize.png'],
		[function (arg) {
			if (pinnedApps.indexOf(arg) === -1) {
				return '+Pin App';
			} else {
				return '+Unpin App';
			}
		}, function (arg) {
			pinApp(arg);
			if (pinnedApps.indexOf(arg) === -1 && !apps[arg].appWindow.appIcon) {
				getId('icn_' + arg).style.display = 'none';
			}
		}, 'ctxMenu/beta/minimize.png'],
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
		}, 'ctxMenu/beta/add.png'],
		[function (arg) {
			if (dsktp[arg]) {
				return ' Remove Desktop Icon';
			} else {
				return '-Remove Desktop Icon';
			}
		}, function (arg) {
			if (dsktp[arg]) {
				removeDsktpIcon(arg);
			} else {
				newDsktpIcon(arg, arg);
			}
		}, 'ctxMenu/beta/x.png'],
		['+' + lang('ctxMenu', 'closeApp'), function (arg) {
			apps[arg].signalHandler('close');
		}, 'ctxMenu/beta/x.png']
	],
	winXXXc: [
		[' About This App', function (arg) {
			openapp(apps.appInfo, arg);
		}, 'ctxMenu/beta/file.png'],
		['+' + lang('ctxMenu', 'fold'), function (arg) {
			apps[arg].appWindow.foldWindow();
		}, 'ctxMenu/beta/less.png'],
		['+' + lang('ctxMenu', 'hideApp'), function (arg) {
			apps[arg].signalHandler('shrink');
		}, 'ctxMenu/beta/minimize.png'],
		[' ' + lang('ctxMenu', 'fullscreen'), function (arg) {
			apps[arg].appWindow.toggleFullscreen();
			toTop(apps[arg]);
		}, 'ctxMenu/beta/add.png'],
		[' Close', function (arg) {
			apps[arg].signalHandler('close');
		}, 'ctxMenu/beta/x.png'],
		[function (arg) {
			if (apps[arg].appWindow.onTop === 0) {
				return '+' + lang('ctxMenu', 'stayOnTop');
			} else {
				return '_' + lang('ctxMenu', 'stayOnTop');
			}
		}, function (arg) {
			apps[arg].appWindow.alwaysOnTop(1);
		}, 'ctxMenu/beta/add.png'],
		[function (arg) {
			if (apps[arg].appWindow.onTop === 1) {
				return ' ' + lang('ctxMenu', 'stopOnTop');
			} else {
				return '-' + lang('ctxMenu', 'stopOnTop');
			}
		}, function (arg) {
			apps[arg].appWindow.alwaysOnTop(0);
		}, 'ctxMenu/beta/less.png']
	]
};
getId("hideall").setAttribute('oncontextmenu', 'ctxMenu(baseCtx.hideall, 1, event);');
getId("taskbar").setAttribute('oncontextmenu', 'ctxMenu(baseCtx.taskbar, 1, event);');
getId("monitor").setAttribute('oncontextmenu', 'if(event.target !== getId("ctxMenu")){return false}');

var flowMode = 0;
function exitFlowMode() {
	if (getId("monitor").classList.contains('flowDesktop')) {
		getId("monitor").classList.remove('flowDesktop');
	}
	flowMode = 0;
}

function enterFlowMode() {
	if (!getId("monitor").classList.contains('flowDesktop')) {
		getId("monitor").classList.add('flowDesktop');
		getId("desktop").scrollTop = 0;
	}
	flowMode = 1;
}

function toggleFlowMode() {
	if (flowMode) {
		if (getId("monitor").classList.contains('flowDesktop')) {
			getId("monitor").classList.remove('flowDesktop');
		}
		flowMode = 0;
	} else {
		if (!getId("monitor").classList.contains('flowDesktop')) {
			getId("monitor").classList.add('flowDesktop');
			getId("desktop").scrollTop = 0;
		}
		flowMode = 1;
	}
}

var sessionStorageSupported = 1;
try {
	if (typeof sessionStorage === "undefined") {
		sessionStorage = {
			getItem: function() {
				return false
			},
			setItem: function() {
				return false
			},
			removeItem: function() {
				return false
			}
		};
		sessionStorageSupported = 0;
	}
} catch (err) {
	sessionStorage = {
		getItem: function() {
			return false
		},
		setItem: function() {
			return false
		},
		removeItem: function() {
			return false
		}
	};
	sessionStorageSupported = 0;
}
var localStorageSupported = 1;
try {
	if (typeof localStorage === "undefined") {
		localStorage = {
			getItem: function() {
				return false
			},
			setItem: function() {
				return false
			},
			removeItem: function() {
				return false
			}
		};
		localStorageSupported = 0;
	}
} catch (err) {
	localStorage = {
		getItem: function() {
			return false
		},
		setItem: function() {
			return false
		},
		removeItem: function() {
			return false
		}
	};
	localStorageSupported = 0;
}
c(function() {
	if (window.location.href.indexOf('GooglePlay=true') > -1 || sessionStorage.getItem('GooglePlay') === 'true') {
		doLog("Google Play Mode enabled.");
		if (screen.height >= 1080) {
			apps.settings.vars.setScale(0.5, 1);
		}
		apps.settings.vars.togClickToMove();
		sessionStorage.setItem('GooglePlay', 'true');
	} else {
		fitWindow();
	}
});
fadeResizeText();

// Set up LOCALFILES
window.LOCALFILES = {};
if (localStorageSupported) {
	if (!noUserFiles) {
		if (localStorage.hasOwnProperty("LOCALFILES")) {
			LOCALFILES = JSON.parse(localStorage.getItem("LOCALFILES"));
		}
	}
}
window.lfsave = function (file, content) {
	sh("mkdir /LOCALFILES/" + file);
	eval(apps.bash.vars.translateDir('/LOCALFILES/' + file) + ' = content');
	if (!noUserFiles) {
		localStorage.setItem("LOCALFILES", JSON.stringify(LOCALFILES));
	}
};
window.lfload = function (file, debug) {
	try {
		if (debug) {
			doLog("lfload " + file + ":", '#ABCDEF');
			doLog(apps.bash.vars.getRealDir('/LOCALFILES/' + file), '#ABCDEF');
		}
		return apps.bash.vars.getRealDir('/LOCALFILES/' + file);
	} catch (err) {
		if (debug) {
			doLog(err, '#FFCDEF');
		}
		return null;
	}
};
window.lfmkdir = function (dirname) {
	sh("mkdir /LOCALFILES/" + dirname);
	if (!noUserFiles) {
		localStorage.setItem("LOCALFILES", JSON.stringify(LOCALFILES));
	}
};
window.lfdel = function (filename) {
	eval("delete " + apps.bash.vars.translateDir("/LOCALFILES/" + filename));
	if (!noUserFiles) {
		localStorage.setItem("LOCALFILES", JSON.stringify(LOCALFILES));
	}
};

// Auto-resize display on window change
window.addEventListener('resize', fitWindowIfPermitted);
var monMouseEvent = {};
function monMouseCheck() {
	try {
		if (typeof document.elementFromPoint(monMouseEvent.pageX, monMouseEvent.pageY).oncontextmenu === 'function') {
			document.elementFromPoint(monMouseEvent.pageX, monMouseEvent.pageY).oncontextmenu(monMouseEvent);
		} else if (typeof document.elementFromPoint(monMouseEvent.pageX, monMouseEvent.pageY).oncontextmenu === 'string') {
			eval(document.elementFromPoint(monMouseEvent.pageX, monMouseEvent.pageY).oncontextmenu);
		} else {
			doLog('Failed to find ctxmenu on ' + vartry('document.elementFromPoint(monMouseEvent.pageX, monMouseEvent.pageY).id'));
		}
	} catch (err) {
		doLog('Failed to open ctxmenu on ' + vartry('document.elementFromPoint(monMouseEvent.pageX, monMouseEvent.pageY).id'));
	}
}

function monMouseDown(evt) {
	if (vartry("apps.settings.vars.longTap") === 1 && evt.touches.length > 1) {
		evt.preventDefault();
		monMouseEvent = {
			pageX: evt.touches[0].pageX,
			pageY: evt.touches[0].pageY
		};
		monMouseCheck();
		return false;
	}
}
getId("monitor").addEventListener('touchstart', monMouseDown);

c(function() {
	requestAnimationFrame(function() {
		// TODO: TALK TO KARA ABOUT WIFI ICON
		//makeInterval('aOS', 'NtwrkCheck', 'taskbarShowHardware()', 1000);
	});
})

var keepingAwake = false;

// Set up service worker
if ('serviceWorker' in navigator) {
	window.addEventListener('load', function() {
		navigator.serviceWorker.register('serviceworker.js').then(function (registration) {

		}, function (err) {
			try {
				doLog('ServiceWorker registration failed: ' + err, '#F00');
			} catch (err2) {
				console.log('ServiceWorker registration failed: ' + err);
			}
		});
	});
}

c(function() {
	getId('aOSloadingInfo').innerHTML = 'Loading your files...';
	getId('aOSisLoading').classList.remove('cursorLoadLight');
	getId('aOSisLoading').classList.add('cursorLoadDark');

	initStatus = 1;
	doLog('Took ' + (perfCheck('masterInitAOS') / 1000) + 'ms to initialize.');
	perfStart("masterInitAOS");
});

var bootFileHTTP = new XMLHttpRequest();
bootFileHTTP.onreadystatechange = function() {
	if (bootFileHTTP.readyState === 4) {
		if (bootFileHTTP.status === 200) {
			USERFILES = JSON.parse(bootFileHTTP.responseText);
			if (USERFILES === null) USERFILES = {};
		} else {
			alert("Failed to fetch your files. Web error " + bootFileHTTP.status);
		}

		doLog('Took ' + (perfCheck('masterInitAOS') / 1000) + 'ms to fetch USERFILES.');
		perfStart("masterInitAOS");
		m("init fileloader");
		getId("aOSloadingInfo").innerHTML += "<br>Your OS key is " + SRVRKEYWORD;
		for (let app in apps) {
			getId("aOSloadingInfo").innerHTML = "Loading your files...<br>Your OS key is" + SRVRKEYWORD + "<br>Loading " + app;
			try {
				apps[app].signalHandler("USERFILES_DONE");
			} catch (err) {
				alert("Error initializing " + app + ":\n\n" + err);
			}
		}

		try {
			updateBgSize();
		} catch (err) {}

		requestAnimationFrame(function() {
			bootFileHTTP = null;
		});
		doLog('Took ' + (perfCheck('masterInitAOS') / 1000) + 'ms to run startup apps.');
		doLog('Took ' + Math.round(performance.now() * 10) / 10 + 'ms grand total to reach desktop.');
		doLog(" ");
	}
};

c(function() {
	if (!noUserFiles) {
		bootFileHTTP.open('GET', 'fileloaderBeta.php');
		bootFileHTTP.send();
	} else {
		doLog("WARNING - USERFILES disallowed by ?nofiles=true", '#FF7F00');
		USERFILES = {};
		doLog('Took ' + (perfCheck('masterInitAOS') / 1000) + 'ms to fetch USERFILES.');
		perfStart("masterInitAOS");
		m("init fileloader");
		getId("aOSloadingInfo").innerHTML += "<br>Your OS key is " + SRVRKEYWORD;
		for (let app in apps) {
			getId("aOSloadingInfo").innerHTML = "Loading your files...<br>Your OS key is" + SRVRKEYWORD + "<br>Loading " + app;
			try {
				apps[app].signalHandler("USERFILES_DONE");
			} catch (err) {
				alert("Error initializing " + app + ":\n\n" + err);
			}
		}

		try {
			updateBgSize();
		} catch (err) {}
		requestAnimationFrame(function() {
			bootFileHTTP = null;
		});
		doLog('Took ' + (perfCheck('masterInitAOS') / 1000) + 'ms to exec USERFILES_DONE.');
		doLog('Took ' + Math.round(performance.now() * 10) / 10 + 'ms grand total to reach desktop.');
	}
});

c(function() {
	window.iframeblurcheck = function() {
		try {
			if (document.activeElement.getAttribute("data-parent-app")) {
				if (currTopApp !== document.activeElement.getAttribute("data-parent-app")) {
					toTop(apps[document.activeElement.getAttribute("data-parent-app")]);
				}
			}
		} catch (err) {}
	};

	setInterval(iframeblurcheck, 500);
	addEventListener("blur", iframeblurcheck);
});
totalWaitingCodes = codeToRun.length;