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

/*
		// each section will be separated by newlines and begin with a comment like this
		// initialized variables will usually have comments describing them
		var foo = 'bar';
		// comment each function to describe what it does
		function foobar(){
				// comment actions within functions
				alert('foobar';);
		}
*/

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
function markUserKbActive() {
	perfStart('userActivity');
	if (screensaverRunning) {
		getId('screensaverLayer').style.display = "none";
		getId('screensaverLayer').innerHTML = "";
		apps.settings.vars.screensavers[apps.settings.vars.currScreensaver].end();
		screensaverRunning = 0;
	}
}

// Pretend the keyboard was clicked - they just logged in so they must have been active
markUserKbActive();

// Add the event listeners to the monitor
getId("monitor").addEventListener('click', markUserKbActive);
getId("monitor").addEventListener('mousemove', markUserMouseActive);
getId("monitor").addEventListener('keypress', markUserKbActive);

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
const numtf = (num) => !!num;
const numEnDis = (num) => !!num ? 'Enabled' : 'Disabled';

var currentlanguage = 'en';
var languagepacks = {
	en: 'US English'
};
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
// replace some text with its chosen language
function langOld(appCode, langPiece) {
	if (typeof apps[appCode].vars.language[currentlanguage] !== "undefined") {
		return apps[appCode].vars.language[currentlanguage][langPiece];
	} else {
		return apps[appCode].vars.language.en[langPiece];
	}
}

function lang(appCode, langPiece, forceEN) {
	if (forceEN) {
		if (typeof langContent.en[appCode] !== "undefined") {
			if (typeof langContent.en[appCode][langPiece] !== "undefined") {
				return langContent.en[appCode][langPiece];
			} else {
				return 'LanguageError: No translation for ' + langPiece + ' of app ' + appCode + ' in language en.';
			}
		} else {
			return 'LanguageError: Language en does not support app ' + appCode + '.';
		}
	} else if (typeof langContent[currentlanguage] !== "undefined") {
		if (typeof langContent[currentlanguage][appCode] !== "undefined") {
			if (typeof langContent[currentlanguage][appCode][langPiece] !== "undefined") {
				return langContent[currentlanguage][appCode][langPiece];
			} else if (typeof langContent.en[appCode][langPiece] !== "undefined") {
				return langContent.en[appCode][langPiece];
			} else {
				return 'LanguageError: No translation for ' + langPiece + ' of app ' + appCode + ' in language ' + currentlanguage + '.';
			}
		} else {
			return 'LanguageError: Language ' + currentlanguage + ' does not support app ' + appCode + '.';
		}
	} else {
		return lang(appCode, langPiece, 1);
	}
}

// text-speech functions
var lastTTS = "";

function textspeech(message) {
	d(1, 'Doing text-speech: ' + message);
	lastTTS = "";
	openapp(apps.nora, 'tskbr');
	apps.nora.vars.lastSpoken = 0;
	apps.nora.vars.say('<span style="color:#ACE">Text-to-speech from selection:</span>');
	apps.nora.vars.lastSpoken = 1;
	apps.nora.vars.say(message);
}

// this is where the user's files go
var USERFILES = [];

// element control shorthand
function getId(target) {
	return document.getElementById(target);
}

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

// Function to format a string into a date into a string
m('init formDate');
var tempDate;
var date;
var skipKey;
var tempDayt;
var dateDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var dateForms = {
	D: function() { // day number
		tempDate += date.getDate();
	},
	d: function() { // day of week
		tempDate += dateDays[date.getDay()];
	},
	y: function() { // 2-digit year
		tempDate += String(date.getFullYear() - 2000);
	},
	Y: function() { // 4-digit year
		tempDate += date.getFullYear();
	},
	h: function() { // 12-hour time
		if (date.getHours() > 12) {
			tempDayt = String((date.getHours()) - 12);
		} else {
			tempDayt = String(date.getHours());
		}
		if (tempDayt === "0") {
			tempDate += "12";
		} else {
			tempDate += tempDayt;
		}
	},
	H: function() { // 24-hour time
		tempDate += String(date.getHours());
	},
	s: function() { // milliseconds
		if (date.getMilliseconds() < 10) {
			tempDate += '00' + date.getMilliseconds();
		} else if (date.getMilliseconds() < 100) {
			tempDate += '0' + date.getMilliseconds();
		} else {
			tempDate += date.getMilliseconds();
		}
	},
	S: function() { // seconds
		tempDayt = String(date.getSeconds());
		if (tempDayt < 10) {
			tempDate += "0" + tempDayt;
		} else {
			tempDate += tempDayt;
		}
	},
	m: function() { // minutes
		tempDayt = date.getMinutes();
		if (tempDayt < 10) {
			tempDate += "0" + tempDayt;
		} else {
			tempDate += tempDayt;
		}
	},
	M: function() { // month
		tempDate += String(date.getMonth() + 1);
	},
	"-": function() { // escape character

	}
};

// Function to use above functions to form a date string
function formDate(dateStr) {
	tempDate = "";
	date = new Date();
	skipKey = 0;
	// Loops thru characters and replaces them with the date
	for (var dateKey in dateStr) {
		if (skipKey) skipKey = 0;
		if (dateForms[dateStr[dateKey]]) {
			dateForms[dateStr[dateKey]]();
		} else {
			tempDate += dateStr[dateKey];
		}
	}
	return tempDate;
}

// Taskbar settings
var tskbrToggle = {
	perfMode: 0,
	tskbrPos: 1
};

var showTimeColon = 0;
var timeElement = getId("time");
var doLog;

// Loading the battery
var cpuBattery = {};
var taskbarOnlineStr = " }|[";
var taskbarBatteryStr = "????";
var batteryLevel = -1;

// If battery is not supported, place a fake function to replace it
if (!window.navigator.getBattery) {
	window.navigator.getBattery = function() {
		return {
			then: function (callback) {
				callback({
					level: ' ? ',
					addEventListener: function (eventname, eventcallback) {
						return false;
					}
				});
			}
		};
	};
}

var batterySetupAttempts = 1;
var batterySetupSuccess = 0;

// Load the battery
function setupBattery() {
	window.navigator.getBattery().then(function(battery) {
		cpuBattery = battery;
		if (cpuBattery.level !== ' ? ') {
			batteryLevel = cpuBattery.level;
			taskbarBatteryStr = Math.round(cpuBattery.level * 100);
			if (taskbarBatteryStr < 10) {
				taskbarBatteryStr = "00" + taskbarBatteryStr;
			} else if (taskbarBatteryStr !== 100) {
				taskbarBatteryStr = "0" + taskbarBatteryStr;
			}
			if (cpuBattery.charging) {
				taskbarBatteryStr = taskbarBatteryStr + "+";
			} else {
				taskbarBatteryStr = taskbarBatteryStr + "-";
			}
			cpuBattery.addEventListener('levelchange', function() {
				d(2, 'Battery level changed.');
				batteryLevel = cpuBattery.level;
				taskbarBatteryStr = Math.round(cpuBattery.level * 100);
				if (taskbarBatteryStr < 10) {
					taskbarBatteryStr = "00" + taskbarBatteryStr;
				} else if (taskbarBatteryStr !== 100) {
					taskbarBatteryStr = "0" + taskbarBatteryStr;
				}
				if (cpuBattery.charging) {
					taskbarBatteryStr = taskbarBatteryStr + "+";
				} else {
					taskbarBatteryStr = taskbarBatteryStr + "-";
				}
			});
			cpuBattery.addEventListener('chargingchange', function() {
				d(2, 'Battery charging changed.');
				batteryLevel = cpuBattery.level;
				taskbarBatteryStr = Math.round(cpuBattery.level * 100);

				if (taskbarBatteryStr < 10) {
					taskbarBatteryStr = "00" + taskbarBatteryStr;
				} else if (taskbarBatteryStr !== 100) {
					taskbarBatteryStr = "0" + taskbarBatteryStr;
				}

				if (cpuBattery.charging) {
					taskbarBatteryStr = taskbarBatteryStr + "+";
				} else {
					taskbarBatteryStr = taskbarBatteryStr + "-";
				}
			});
		}
	});
}
setTimeout(setupBattery, 500);

// If failed, retry again
function retryBattery() {
	if (cpuBattery === undefined || cpuBattery.level === ' ? ' || objLength(cpuBattery) === 0) {
		setupBattery();
	} else if (!batterySetupSuccess) {
		batterySetupSuccess = 1;
	}
}

// Battery will be tested 10 times
for (i = 1000; i < 5500; i += 500) {
	setTimeout(retryBattery, i);
}

// Give up on the battery
function failBattery() {
	if (cpuBattery === undefined || cpuBattery.level === ' ? ' || objLength(cpuBattery) === 0) {
		doLog('Battery setup aborted. [' + [(cpuBattery === undefined), (cpuBattery.level === ' ? '), (objLength(cpuBattery) === 0)] + ']', '#F00');
		if (!USERFILES.WIDGETLIST) {
			removeWidget('battery', 1);
		}
	} else if (!batterySetupSuccess) {
		doLog('Battery setup success! [' + [(cpuBattery === undefined), (cpuBattery.level === ' ? '), (objLength(cpuBattery) === 0)] + ']', '#FF0');
		batterySetupSuccess = 1;
	}
}
setTimeout(failBattery, 5500);

// Update network info on the taskbar
function taskbarShowHardware() {
	if (window.navigator.onLine) {
		if (!apps.savemaster.vars.saving) {
			taskbarOnlineStr = "] [";
		} else if (apps.savemaster.vars.saving === 2) {
			taskbarOnlineStr = "}-[";
		} else if (apps.savemaster.vars.saving === 3) {
			taskbarOnlineStr = "]-{";
		} else {
			taskbarOnlineStr = "}-{";
		}
	} else {
		taskbarOnlineStr = "]X[";
	}
}
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

// Smart Icon Builder
var smartIconOptions = {
	radiusTopLeft: 100,
	radiusTopRight: 100,
	radiusBottomLeft: 100,
	radiusBottomRight: 100,
	backgroundOpacity: 1,
	bgColor: ''
};

function updateSmartIconStyle() {
	getId("smartIconStyle").innerHTML = '.smarticon_bg{border-top-left-radius:' + smartIconOptions.radiusTopLeft + '%;border-top-right-radius:' + smartIconOptions.radiusTopRight + '%;border-bottom-left-radius:' + smartIconOptions.radiusBottomLeft + '%;border-bottom-right-radius:' + smartIconOptions.radiusBottomRight + '%;display:' + function() {
		if (smartIconOptions.backgroundOpacity) {
			return 'block'
		} else {
			return 'none'
		}
	}() + ';' + function() {
		if (smartIconOptions.bgColor) {
			return 'background-color:' + smartIconOptions.bgColor.split(';')[0] + ' !important;'
		} else {
			return ''
		}
	}() + '}.smarticon_nobg{display:' + function() {
		if (smartIconOptions.backgroundOpacity) {
			return 'none'
		} else {
			return 'block'
		}
	}() + ';}';
	var allSmartIconsBG = document.getElementsByClassName("smarticon_bg");
	for (var i = 0; i < allSmartIconsBG.length; i++) {
		var currSize = parseFloat(allSmartIconsBG[i].getAttribute("data-smarticon-size"));
		allSmartIconsBG[i].style.borderTopLeftRadius = Math.round((currSize / 2) * (smartIconOptions.radiusTopLeft / 100)) + 'px';
		allSmartIconsBG[i].style.borderTopRightRadius = Math.round((currSize / 2) * (smartIconOptions.radiusTopRight / 100)) + 'px';
		allSmartIconsBG[i].style.borderBottomLeftRadius = Math.round((currSize / 2) * (smartIconOptions.radiusBottomLeft / 100)) + 'px';
		allSmartIconsBG[i].style.borderBottomRightRadius = Math.round((currSize / 2) * (smartIconOptions.radiusBottomRight / 100)) + 'px';
	}
	var allSmartIconsBorder = document.getElementsByClassName("smarticon_border");
	for (var i = 0; i < allSmartIconsBorder.length; i++) {
		var currSize = parseFloat(allSmartIconsBorder[i].getAttribute("data-smarticon-size"));
		allSmartIconsBorder[i].style.borderTopLeftRadius = Math.round((currSize / 2) * (smartIconOptions.radiusTopLeft / 100)) + 'px';
		allSmartIconsBorder[i].style.borderTopRightRadius = Math.round((currSize / 2) * (smartIconOptions.radiusTopRight / 100)) + 'px';
		allSmartIconsBorder[i].style.borderBottomLeftRadius = Math.round((currSize / 2) * (smartIconOptions.radiusBottomLeft / 100)) + 'px';
		allSmartIconsBorder[i].style.borderBottomRightRadius = Math.round((currSize / 2) * (smartIconOptions.radiusBottomRight / 100)) + 'px';
	}
}

function saveSmartIconStyle() {
	ufsave("aos_system/smarticon_settings", JSON.stringify(smartIconOptions));
}
/*
options{
		backgroundColor: "#FFFFFF",
		background: "smarticons/aOS/bg.png",
		backgroundBorder: {
				thickness: 1,
				color: "#000000"
		},
		foreground: "smarticons/aOS/fg.png",
}
*/
function buildSmartIcon(size, options, optionalcss) {
	if (typeof options === "string") {
		options = {
			foreground: options
		};
	}
	if (!options) {
		options = {};
	}
	var icoTemp = '<div class="smarticon" style="width:' + size + 'px;height:' + size + 'px;';
	if (optionalcss) {
		icoTemp += optionalcss;
	}
	icoTemp += '">';
	if (options.foreground) {
		icoTemp += '<div class="smarticon_nobg" style="background:url(' + cleanStr(options.foreground.split(";")[0]) + ');"></div>';
	}
	icoTemp += '<div class="smarticon_bg" data-smarticon-size="' + size + '" style="' +
		'border-top-left-radius:' + Math.round((size / 2) * (smartIconOptions.radiusTopLeft / 100)) + 'px;' +
		'border-top-right-radius:' + Math.round((size / 2) * (smartIconOptions.radiusTopRight / 100)) + 'px;' +
		'border-bottom-left-radius:' + Math.round((size / 2) * (smartIconOptions.radiusBottomLeft / 100)) + 'px;' +
		'border-bottom-right-radius:' + Math.round((size / 2) * (smartIconOptions.radiusBottomRight / 100)) + 'px;';
	if (options.background) {
		icoTemp += 'background:url(' + cleanStr(options.background.split(';')[0]) + ');';
	}
	if (options.backgroundColor) {
		icoTemp += 'background-color:' + cleanStr(options.backgroundColor.split(';')[0]) + ';';
	}
	icoTemp += '">';
	if (options.foreground) {
		icoTemp += '<div class="smarticon_fg" style="background:url(' + cleanStr(options.foreground.split(";")[0]) + ');"></div>';
	}
	if (options.backgroundBorder) {
		icoTemp += '<div class="smarticon_border" data-smarticon-size="' + size + '" style="box-shadow:inset 0 0 0 ' + (size / 32 * (options.backgroundBorder.thickness || 1)) + 'px ' + cleanStr(options.backgroundBorder.color.split(";")[0]) + ';' +
			'border-top-left-radius:' + Math.round((size / 2) * (smartIconOptions.radiusTopLeft / 100)) + 'px;' +
			'border-top-right-radius:' + Math.round((size / 2) * (smartIconOptions.radiusTopRight / 100)) + 'px;' +
			'border-bottom-left-radius:' + Math.round((size / 2) * (smartIconOptions.radiusBottomLeft / 100)) + 'px;' +
			'border-bottom-right-radius:' + Math.round((size / 2) * (smartIconOptions.radiusBottomRight / 100)) + 'px;"></div>';
	}
	icoTemp += '</div></div>';
	return icoTemp;
}

function buildMarquee(text, style) {
	return '<div class="marquee" style="' + (style || '') + '"><div class="marqueetext1">' + text + '</div><div class="marqueetext2">' + text + '</div></div>';
}

// Application class
m('init Application class');
var apps = {};
var appsSorted = [];
var appsSortedSafe = [];
var appTotal = 0;
var appPosX = 8;
var appPosY = 8;
var finishedMakingAppClicks = 0;
/*
		// EXAMPLE
		apps.settings = new Application({
				title: string -> appDesc ("Settings")
				abbreviation: string -> appIcon ("STN")
				codeName: string -> appPath ("settings") (this is the app's name in the apps folder)
				image: (string image url, or object Smart Icon)
						string -> appImg
						object -> appImg
				hideApp: 0, 1, or 2 -> keepOffDesktop (1 does not create desktop icon, 2 also hides from app drawer)
				launchTypes: 0 or 1 -> handlesLaunchTypes
				main: function -> mainFunction
				vars: obj -> appVariables
				signalHandler: function -> signalHandlerFunction
		})
*/
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

var repositories = {
	"repository/repository.json": {}
};
var repositoryIDs = {};
var installedPackages = {};

function repoSave() {
	lfsave("aos_system/repositories", JSON.stringify(repositories));
	lfsave("aos_system/repositories_installed", JSON.stringify(installedPackages));
}

function repoLoad() {
	try {
		repositories = JSON.parse(lfload("aos_system/repositories") || '{"repository/repository.json": {}}');
	} catch (err) {
		alert(err);
		repositories = {
			"repository/repository.json": {}
		};
	}
	try {
		installedPackages = JSON.parse(lfload("aos_system/repositories_installed") || '{}');
	} catch (err) {
		alert(err);
		installedPackages = {};
	}
}

function repoListInstalled() {
	var results = [];
	for (var i in installedPackages) {
		results.push(i);
		for (var j in installedPackages[i]) {
			results.push(i + '.' + j);
		}
	}
	return results;
}

function repoListAll() {
	var results = [];
	for (var i in repositories) {
		results.push(repositories[i].repoID);
		for (var j in repositories[i].packages) {
			results.push(repositories[i].repoID + '.' + repositories[i].packages[j].packageID);
		}
	}
	return results;
}

function repoPackageSearch(...query) {
	var results = [];
	for (var repo in repositories) {
		if (repositories[repo].hasOwnProperty('packages')) {
			for (var package in repositories[repo].packages) {
				for (var item in query) {
					if (query[item].indexOf('.') === -1) {
						if (repositories[repo].packages[package].packageID.toLowerCase().indexOf(query[item].toLowerCase()) !== -1) {
							results.push(repositories[repo].repoID + "." + repositories[repo].packages[package].packageID);
							break;
						} else if (repositories[repo].packages[package].packageName.toLowerCase().indexOf(query[item].toLowerCase()) !== -1) {
							results.push(repositories[repo].repoID + "." + repositories[repo].packages[package].packageID);
							break;
						} else {
							var aliasFound = 0;
							for (var altName in repositories[repo].packages[package].packageAliases) {
								if (repositories[repo].packages[package].packageAliases[altName].toLowerCase().indexOf(query[item].toLowerCase()) !== -1) {
									aliasFound = 1;
									break;
								}
							}
							if (aliasFound) {
								results.push(repositories[repo].repoID + "." + repositories[repo].packages[package].packageID);
								break;
							}
						}
					} else {
						if (repositories[repo].repoID.toLowerCase().indexOf(query[item].split('.')[0].toLowerCase()) !== -1) {
							if (repositories[repo].packages[package].packageID.toLowerCase().indexOf(query[item].substring(query[item].indexOf('.') + 1, query[item].length).toLowerCase()) !== -1) {
								results.push(repositories[repo].repoID + "." + repositories[repo].packages[package].packageID);
								break;
							} else if (repositories[repo].packages[package].packageName.toLowerCase().indexOf(query[item].substring(query[item].indexOf('.') + 1, query[item].length).toLowerCase()) !== -1) {
								results.push(repositories[repo].repoID + "." + repositories[repo].packages[package].packageID);
								break;
							} else {
								var aliasFound = 0;
								for (var altName in repositories[repo].packages[package].packageAliases) {
									if (repositories[repo].packages[package].packageAliases[altName].toLowerCase().indexOf(query[item].substring(query[item].indexOf('.') + 1, query[item].length).toLowerCase()) !== -1) {
										aliasFound = 1;
										break;
									}
								}
								if (aliasFound) {
									results.push(repositories[repo].repoID + "." + repositories[repo].packages[package].packageID);
									break;
								}
							}
						}
					}
				}
			}
		}
	}
	return results;
}

function repoPackageSearchPrecise(...query) {
	var results = [];
	for (var repo in repositories) {
		if (repositories[repo].hasOwnProperty('packages')) {
			for (var package in repositories[repo].packages) {
				for (var item in query) {
					if (query[item].indexOf('.') === -1) {
						if (repositories[repo].packages[package].packageID.toLowerCase() === query[item].toLowerCase()) {
							results.push(repositories[repo].repoID + "." + repositories[repo].packages[package].packageID);
							break;
						} else if (repositories[repo].packages[package].packageName.toLowerCase() === query[item].toLowerCase()) {
							results.push(repositories[repo].repoID + "." + repositories[repo].packages[package].packageID);
							break;
						}
					} else {
						if (query[item].split('.')[0].toLowerCase() === repositories[repo].repoID.toLowerCase()) {
							if (query[item].substring(query[item].indexOf('.') + 1, query[item].length).toLowerCase() === repositories[repo].packages[package].packageID.toLowerCase()) {
								results.push(repositories[repo].repoID + "." + repositories[repo].packages[package].packageID);
								break;
							}
						}
					}
				}
			}
		}
	}
	return results;
}

function repoSearch(...query) {
	var results = [];
	for (var repo in repositories) {
		if (repositories[repo].hasOwnProperty('repoID')) {
			for (var item in query) {
				if (repositories[repo].repoID.toLowerCase().indexOf(query[item].toLowerCase()) !== -1) {
					results.push(repositories[repo].repoID);
					break;
				} else if (repositories[repo].repoName.toLowerCase().indexOf(query[item].toLowerCase()) !== 1) {
					results.push(repositories[repo].repoID);
					break;
				} else {
					var aliasFound = 0;
					for (var altName in repositories[repo].repoAliases) {
						if (repositories[repo].repoAliases[altName].toLowerCase().indexOf(query[item].toLowerCase()) !== -1) {
							aliasFound = 1;
							break;
						}
					}
					if (aliasFound) {
						results.push(repositories[repo].repoID);
						break;
					}
					if (repo.toLowerCase().indexOf(query[item].toLowerCase()) !== -1) {
						results.push(repositories[repo].repoID);
						break;
					}
				}
			}
		} else {
			for (var item in query) {
				if (repo.toLowerCase().indexOf(query[item].toLowerCase()) !== -1) {
					results.push("Warning: No Repo ID: " + repo);
				}
			}
		}
	}
	return results;
}

function repoSearchPrecise(...query) {
	var results = [];
	for (var repo in repositories) {
		if (repositories[repo].hasOwnProperty('repoID')) {
			for (var item in query) {
				if (repositories[repo].repoID.toLowerCase() === query[item].toLowerCase()) {
					results.push(repositories[repo].repoID);
					break;
				} else if (repositories[repo].repoName.toLowerCase() === query[item].toLowerCase()) {
					results.push(repositories[repo].repoID);
					break;
				} else {
					if (repo.toLowerCase() === query[item].toLowerCase()) {
						results.push(repositories[repo].repoID);
						break;
					}
				}
			}
		} else {
			for (var item in query) {
				if (repo.toLowerCase() === query[item].toLowerCase()) {
					results.push("Warning: No Repo ID: " + repo);
				}
			}
		}
	}
	return results;
}

function repoGetUpgradeable(versionNumbers) {
	var output = [];
	for (var repository in installedPackages) {
		for (var package in installedPackages[repository]) {
			if (repositoryIDs.hasOwnProperty(repository)) {
				if (repositories.hasOwnProperty(repositoryIDs[repository])) {
					if (repositories[repositoryIDs[repository]].packages.hasOwnProperty(package)) {
						if (installedPackages[repository][package].version !== repositories[repositoryIDs[repository]].packages[package].version) {
							if (versionNumbers) {
								output.push(repositories[repositoryIDs[repository]].repoID + "." + repositories[repositoryIDs[repository]].packages[package].packageID + ": " + installedPackages[repository][package].version + " to " + repositories[repositoryIDs[repository]].packages[package].version);
							} else {
								output.push(repositories[repositoryIDs[repository]].repoID + "." + repositories[repositoryIDs[repository]].packages[package].packageID);
							}
						}
					}
				}
			}
		}
	}
	return output;
}

var repoUpdateOutput = [];

function repoUpdateIntermediate() {
	if (this.readyState === 4) {
		if (this.status === 200) {
			repoUpdateInstall(this.repositoryName, this.responseText);
		} else {
			if (repositories.hasOwnProperty(this.repositoryName)) {
				if (repositories[this.repositoryName].repoID) {
					if (!repositoryIDs.hasOwnProperty(repositories[this.repositoryName].repoID)) {
						repositoryIDs[repositories[this.repositoryName].repoID] = this.repositoryName;
					}
				}
			}
			if (repoUpdateCallbackColored) {
				repoUpdateCallback("| Network Error " + this.status + ": " + this.repositoryName, "#579");
			} else {
				repoUpdateCallback("Network Error " + this.status + ": " + this.repositoryName);
			}
		}
		repoStagedUpdates--;
		if (repoStagedUpdates <= 0) {
			repoUpdateFinished();
		}
	}
}

function repoUpdateInstall(repoURL, repoResponse) {
	try {
		var repoJSON = JSON.parse(repoResponse);
		if (repoJSON.hasOwnProperty("repoName") &&
			repoJSON.hasOwnProperty("repoID") &&
			repoJSON.hasOwnProperty("repoAliases") &&
			repoJSON.hasOwnProperty("packages")
		) {
			if (!repositoryIDs.hasOwnProperty(repoJSON.repoID)) {
				repositories[repoURL] = repoJSON;
				repositoryIDs[repoJSON.repoID] = repoURL;
				if (repoUpdateCallbackColored) {
					repoUpdateCallback("| Success: " + repoURL, "#579");
				} else {
					repoUpdateCallback("Success: " + repoURL);
				}
			} else if (repositoryIDs[repository] !== repoURL) {
				if (repoUpdateCallbackColored) {
					repoUpdateCallback("| Error: " + repoJSON.repoID + " already exists: " + repoURL, "#579");
				} else {
					repoUpdateCallback("Error: " + repoJSON.repoID + " already exists: " + repoURL);
				}
			}
		}
	} catch (err) {
		if (repoUpdateCallbackColored) {
			repoUpdateCallback("| Error: " + err + ": " + repoURL, "#579");
		} else {
			repoUpdateCallback("Error: " + err + ": " + repoURL);
		}
	}
}

var repoStagedUpdates = 0;

function repoUpdateFinished() {
	try {
		apps.saveMaster.vars.saving = 0;
	} catch (err) {

	}
	try {
		if (repoUpdateCallbackColored) {
			repoUpdateCallback("| ", "#579");
			repoUpdateCallback("| " + repoPackageSearch("").length + " total packages available.", "#579");
			repoUpdateCallback("| " + repoGetUpgradeable().length + " total updates available.", "#579");
			repoUpdateCallback("| -----", "#579");
		} else {
			repoUpdateCallback("");
			repoUpdateCallback(repoPackageSearch("").length + " total packages available.");
			repoUpdateCallback(repoGetUpgradeable().length + " total updates available.");
		}
		try {
			if (typeof repoUpdateFinishFunc === 'function') {
				repoUpdateFinishFunc();
			}
		} catch (err) {}
	} catch (err) {}

	for (let i in repoUpdateXHR) {
		delete repoUpdateXHR[i];
	}

	repoUpdateXHR = {};
	repoUpdateCallback = null;
	repoUpdateOutput = [];
	repoStagedUpdates = 0;
	repoUpdateFinishFunc = null;

	repoSave();
}

var repoUpdateXHR = {};
repoUpdateCallback = null;
repoUpdateCallbackColored = 0;
repoUpdateFinishFunc = null;

function repoUpdate(callback, finishFunc) {
	if (repoStagedUpdates > 0 && repoStagedUpgrades > 0) return false;

	if (callback) {
		repoUpdateCallback = callback;
		repoUpdateCallbackColored = 0;
	} else {
		repoUpdateCallback = doLog;
		repoUpdateCallbackColored = 1;
	}
	if (finishFunc) {
		repoUpdateFinishFunc = finishFunc;
	} else {
		repoUpdateFinishFunc = null;
	}

	repositoryIDs = [];
	repoUpdateOutput = [];
	repoStagedUpdates = 0;
	for (var repo in repositories) {
		repoUpdateXHR[repo] = new XMLHttpRequest();
		if (repo.indexOf("?") > -1) { // this URL parameter is added to beat the Chrome cache system
			repoUpdateXHR[repo].open('GET', repo + "&ms=" + performance.now());
		} else {
			repoUpdateXHR[repo].open('GET', repo + "?ms=" + performance.now());
		}
		repoUpdateXHR[repo].onreadystatechange = repoUpdateIntermediate;
		repoUpdateXHR[repo].repositoryName = repo;
		repoUpdateXHR[repo].send();
		repoStagedUpdates++;
	}

	if (repoUpdateCallbackColored) {
		repoUpdateCallback("| -----", "#579");
		repoUpdateCallback("| Updating " + repoStagedUpdates + " repositories", "#579");
		repoUpdateCallback("| ", "#579");
	} else {
		repoUpdateCallback("Updating " + repoStagedUpdates + " repositories");
		repoUpdateCallback("");
	}

	try {
		apps.saveMaster.vars.saving = 3;
	} catch (err) {}

	return true;
}

var repoUpgradeXHR = {};
var repoUpgradeOutput = [];
var repoStagedUpgrades = 0;
var repoUpgradeCallback = null;

function repoUpgradeIntermediate() {
	if (this.readyState === 4) {
		if (this.status === 200) {
			repoUpgradeInstall(this.repository, this.responseText);
		} else {
			repoUpgradeCallback("Error: " + this.status + ": " + this.repository.join('.'));
		}
		repoStagedUpgrades--;
		if (repoStagedUpgrades <= 0) {
			repoUpgradeFinished();
		}
	}
}

function repoUpgradeInstall(targetPackage, packageData) {
	try {
		let repoJSON = JSON.parse(packageData);
		if (repoJSON.hasOwnProperty("name") &&
			repoJSON.hasOwnProperty("id") &&
			repoJSON.hasOwnProperty("version") &&
			repoJSON.hasOwnProperty("appType")
		) {
			installedPackages[targetPackage[0]][targetPackage[1]] = repoJSON;
			// INSTALL HERE IF LIVE INSTALL BECOMES POSSIBLE
			// REQUIRE RESTART ONLY FOR UNSUPPORTED TYPES
			switch (repoJSON.appType) {
				case 'stylesheet':
					if (getId("customstyle_appcenter_" + targetPackage[0] + "_" + targetPackage[1])) {
						document.head.removeChild(getId("customstyle_appcenter_" + targetPackage[0] + "_" + targetPackage[1]));
					}
					if (repoJSON.hasOwnProperty("styleContent")) {
						var customCSS = document.createElement("style");
						customCSS.classList.add("customstyle_appcenter");
						customCSS.id = "customstyle_appcenter_" + targetPackage[0] + "_" + targetPackage[1];
						customCSS.innerHTML = repoJSON.styleContent;
						document.head.appendChild(customCSS);
					} else {
						var customCSS = document.createElement("link");
						customCSS.setAttribute("rel", "stylesheet");
						customCSS.href = repoJSON.styleLink;
						customCSS.classList.add("customstyle_appcenter");
						customCSS.id = "customstyle_appcenter_" + targetPackage[0] + "_" + targetPackage[1];
						document.head.appendChild(customCSS);
					}
					break;
				case 'webApp':
					if (apps.hasOwnProperty('webApp_' + targetPackage[0] + '__' + targetPackage[1])) {
						requireRestart();
						repoUpgradeCallback("Restart required: web app is already installed: " + targetPackage.join('.'));
					} else {
						apps.appCenter.vars.compileWebApp(repoJSON, targetPackage[0] + '__' + targetPackage[1]);
						appsSorted = [];
						for (let i in apps) {
							appsSorted.push(apps[i].appDesc.toLowerCase() + "|WAP_apps_sort|" + i);
						}
						appsSorted.sort();
						for (let i in appsSorted) {
							var tempStr = appsSorted[i].split("|WAP_apps_sort|");
							tempStr = tempStr[tempStr.length - 1];
							appsSorted[i] = tempStr;
						}
					}
					break;
				default:
					requireRestart();
			}
			repoUpgradeCallback("Success: " + targetPackage.join('.'));
		} else {
			repoUpgradeCallback("Error: response is not a valid package: " + targetPackage.join('.'));
		}
	} catch (err) {
		repoUpgradeCallback("Error: " + err + ": " + targetPackage.join('.'));
	}
}

function repoUpgradeFinished() {
	try {
		apps.saveMaster.vars.saving = 0;
	} catch (err) {}

	try {
		repoUpgradeCallback("");
		repoUpgradeCallback("Finished.");
		try {
			if (typeof repoUpgradeFinishedFunc === 'function') {
				repoUpgradeFinishedFunc();
			}
		} catch (err) {}
	} catch (err) {}

	for (let i in repoUpgradeXHR) {
		delete repoUpgradeXHR[i];
	}

	repoUpgradeXHR = {};
	repoUpgradeCallback = null;
	repoUpgradeOutput = [];
	repoStagedUpgrades = 0;
	repoUpgradeFinishedFunc = null;

	repoSave();
}

var repoUpgradeFinishedFunc = null;
function repoUpgrade(callback, finishedFunc) {
	if (repoStagedUpdates > 0 && repoStagedUpgrades > 0) return false;

	let upgradeablePackages = repoGetUpgradeable();
	if (upgradeablePackages.length === 0) {
		(callback || doLog)("Aborted - no updates available. Try repo update first?");
		return false;
	}

	repoUpgradeCallback = callback || doLog;
	repoUpgradeFinishedFunc = finishedFunc || null;
	repoUpgradeOutput = [];
	repoStagedUpgrades = 0;
	repoUpgradeCallback("Upgrading the following packages: " + upgradeablePackages.join(", "));
	for (let i in upgradeablePackages) {
		upgradeablePackages[i] = upgradeablePackages[i].split('.');
	}

	for (let i in upgradeablePackages) {
		repoUpgradeXHR[upgradeablePackages[i][0]] = new XMLHttpRequest();

		let installURL = repositories[repositoryIDs[upgradeablePackages[i][0]]].packages[upgradeablePackages[i][1]].installURL;
		let questionMark = installURL.indexOf("?") > 0;
		repoUpgradeXHR[upgradeablePackages[i][0]].open(
			"GET", installURL + `${questionMark ? '&' : '?'}ms=` + performance.now()
		);

		repoUpgradeXHR[upgradeablePackages[i][0]].onreadystatechange = repoUpgradeIntermediate;
		repoUpgradeXHR[upgradeablePackages[i][0]].repository = upgradeablePackages[i];
		repoUpgradeXHR[upgradeablePackages[i][0]].send();
		repoStagedUpgrades++;
	}

	repoUpgradeCallback("Total upgrades: " + repoStagedUpgrades);
	repoUpgradeCallback("");
	try {
		apps.saveMaster.vars.saving = 3;
	} catch (err) {}
	return true;
}

function repoAddRepository(url, callback, finishingFunc) {
	for (let i in repositoryIDs) {
		if (repositoryIDs[i] === url) {
			(callback || doLog)('Aborted - Repository already exists: ' + i);
			return false;
		}
	}

	repositories[url] = {};
	(callback || doLog)('Added repository. Updating...');
	repoUpdate(callback, finishingFunc);
	return true;
}

function repoRemoveRepository(query, callback, finishingFunc) {
	let repositoriesToRemove = repoSearchPrecise(query);
	if (repositoriesToRemove.indexOf('aaronos_official') !== -1) {
		(callback || doLog)('Failed: cannot remove this repo: aaronos_official');
		repositoriesToRemove.splice(repositoriesToRemove.indexOf('aaronos_official'), 1);
	}

	if (repositoriesToRemove.length === 0) {
		(callback || doLog)('Nothing done, no removeable repositories found.');
		return false;
	}
	
	for (let i in repositoriesToRemove) {
		if (repositoriesToRemove[i].indexOf('Warning: No Repo ID: ') === 0) {
			delete repositories[repositoriesToRemove[i].substring(21, repositoriesToRemove[i].length)];
			(callback || doLog)('Deleted ' + repositoriesToRemove[i].substring(21, repositoriesToRemove[i].length));
		} else {
			delete repositories[repositoryIDs[repositoriesToRemove[i]]];
			(callback || doLog)('Deleted ' + repositoriesToRemove[i] + ": " + repositoryIDs[repositoriesToRemove[i]]);
		}
	}
	(callback || doLog)('Updating...');
	repoUpdate(callback, finishingFunc);
	return true;
}

function repoAddPackage(query, callback, finishingFunc) {
	let repoMatches = repoPackageSearchPrecise(query);
	if (repoMatches.length === 0) {
		repoMatches = repoPackageSearch(query);
		if (repoMatches.length === 0) {
			(callback || doLog)('No packages found.');
			return false;
		} else {
			repoMatches.splice(0, 0, 'No packages found with that name. Maybe try again with one of these?');
			for (let i in repoMatches)
				(callback || doLog)(repoMatches[i]);

			return false;
		}
	}
	
	if (repoMatches.length === 1) {
		if (!installedPackages.hasOwnProperty(repoMatches[0].split('.')[0]))
			installedPackages[repoMatches[0].split('.')[0]] = {};

		installedPackages[repoMatches[0].split('.')[0]][repoMatches[0].split('.')[1]] = {
			name: repositories[repositoryIDs[repoMatches[0].split('.')[0]]].packages[repoMatches[0].split('.')[1]].packageName,
			id: repositories[repositoryIDs[repoMatches[0].split('.')[0]]].packages[repoMatches[0].split('.')[1]].packageID,
			version: "UPDATE_NOW",
			packageType: "UPDATE_THIS_PACKAGE"
		};

		(callback || doLog)('Installed package ' + repoMatches[0], 'Performing upgrade...');
		repoUpgrade(callback, finishingFunc);
		return true;
	} else {
		repoMatches.splice(0, 0, 'More than one package with that name. Try again with a more specific name:');
		for (var i in repoMatches) {
			(callback || doLog)(repoMatches[i]);
		}
		return false;
	}
}

function repoRemovePackage(query, callback) {
	let repoMatches = [];
	for (let i in installedPackages) {
		for (let j in installedPackages[i]) {
			if (i + '.' + j === query || j === query) {
				repoMatches.push([i, j]);
			}
		}
	}
	if (repoMatches.length === 0) {
		(callback || doLog)('No matching packages found.');
		return false;
	}
	
	if (repoMatches.length === 1) {
		// UNINSTALL HERE IF LIVE UNINSTALL IS SUPPORTED
		var liveUninstall = 1;
		switch (installedPackages[repoMatches[0][0]][repoMatches[0][1]].appType) {
			case 'stylesheet':
				if (getId("customstyle_appcenter_" + repoMatches[0][0] + "_" + repoMatches[0][1])) {
					document.head.removeChild(getId("customstyle_appcenter_" + repoMatches[0][0] + "_" + repoMatches[0][1]));
				} else {
					liveUninstall = 0;
				}
				break;
			default:
				liveUninstall = 0;
		}

		// TODO
		delete installedPackages[repoMatches[0][0]][repoMatches[0][1]];
		let repoLength = 0;
		for (let i in installedPackages[repoMatches[0][0]]) {
			repoLength = 1;
			break;
		}

		if (repoLength === 0) delete installedPackages[repoMatches[0][0]];
		repoSave();

		if (liveUninstall) {
			(callback || doLog)('Package ' + repoMatches[0].join('.') + ' uninstalled. No restart required.');
		} else {
			(callback || doLog)('Package ' + repoMatches[0].join('.') + ' uninstalled. Restart required to complete.');
			requireRestart();
		}

		return true;
	} else {
		repoMatches.splice(0, 0, ['More than one package with that name. Try again with a more specific name:']);
		for (let i in repoMatches) {
			(callback || doLog)(repoMatches[i].join('.'));
		}

		return false;
	}
}

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

var totalWidgets = 0;
var widgets = {};
var Widget = function (name, code, clickFunc, startFunc, frameFunc, endFunc, vars) {
	this.name = name;
	this.codeName = code;
	this.main = clickFunc;
	this.start = startFunc;
	this.frame = frameFunc;
	this.end = endFunc;
	this.vars = vars;
	this.place = -1;
	this.element = null;
	this.setWidth = function (width) {
		if (this.element !== null) {
			this.element.style.width = width;
		}
	}
	this.setContent = function (content) {
		if (this.element !== null) {
			this.element.innerHTML = content;
		}
	}
}

function addWidget(widgetName, nosave) {
	if (widgets[widgetName]) {
		if (widgets[widgetName].place === -1) {
			getId('time').innerHTML += '<div id="widget_' + widgetName + '" class="widget" data-widget-name="' + widgetName + '" onclick="widgets.' + widgetName + '.main()"></div>';
			widgets[widgetName].element = getId('widget_' + widgetName);
			widgets[widgetName].place = totalWidgets;
			totalWidgets++;
			widgets[widgetName].start();
			widgetsList[widgetName] = widgetName;

			if (!nosave) ufsave('aos_system/taskbar/widget_list', JSON.stringify(widgetsList));
		}
	}
};

function removeWidget(widgetName, nosave) {
	// TODO: Test this syntax, or if it needs > -1 checking
	if (!widgets[widgetName]) return;
	if (!widgets[widgetName].place > -1) return;

	widgets[widgetName].end();
	widgets[widgetName].place = -1;
	totalWidgets--;
	widgets[widgetName].element = null;
	getId('widget_' + widgetName).outerHTML = '';
	delete widgetsList[widgetName];

	if (!nosave) ufsave('aos_system/taskbar/widget_list', JSON.stringify(widgetsList));
};

function widgetMenu(title, content) {
	// TODO: Abstract with parameters
	getId('widgetMenu').style.bottom = 'auto';
	getId('widgetMenu').style.top = '0';
	getId('widgetMenu').style.left = '';
	getId('widgetMenu').style.right = '';
	getId('widgetMenu').style.borderBottom = '';
	getId('widgetMenu').style.borderLeft = '';
	getId('widgetMenu').style.borderRight = '';
	getId('widgetMenu').style.borderTop = 'none';
	getId('widgetMenu').style.borderBottomLeftRadius = '';
	getId('widgetMenu').style.borderBottomRightRadius = '';
	getId('widgetMenu').style.borderTopLeftRadius = '0';
	getId('widgetMenu').style.borderTopRightRadius = '0';

	getId('widgetMenu').style.opacity = '';
	getId('widgetMenu').style.pointerEvents = '';
	getId('widgetTitle').innerHTML = title;
	getId('widgetContent').innerHTML = '<hr>' + content;
}

function closeWidgetMenu() {
	getId('widgetMenu').style.bottom = 'auto';
	getId('widgetMenu').style.top = '-350px';
	getId('widgetMenu').style.left = '';
	getId('widgetMenu').style.right = '';

	getId('widgetMenu').style.opacity = '0';
	getId('widgetMenu').style.pointerEvents = 'none';
	getId('widgetTitle').innerHTML = '';
	getId('widgetContent').innerHTML = '';
}

/*
##################################
#           WIDGETS HERE		     #
##################################
*/

var widgetsList = {};
widgets.time = new Widget(
	'Time', // title
	'time', // name in widgets object
	function() { // onclick function
		var currentTime = (new Date().getTime() - bootTime);
		var currentDays = Math.floor(currentTime / 86400000);
		currentTime -= currentDays * 86400000;
		var currentHours = Math.floor(currentTime / 3600000);
		currentTime -= currentHours * 3600000;
		var currentMinutes = Math.floor(currentTime / 60000);
		currentTime -= currentMinutes * 60000;
		var currentSeconds = Math.floor(currentTime / 1000);
		widgetMenu('Time Widget', 'AaronOS has been running for:<br>' + currentDays + ' days, ' + currentHours + ' hours, ' + currentMinutes + ' minutes, and ' + currentSeconds + ' seconds.');
	},
	function() { // start function
		widgets.time.vars.running = 1;
		widgets.time.frame();
	},
	function() { // frame function (this.vars.frame())
		if (widgets.time.vars.running) {
			if (String(new Date()) !== widgets.time.vars.lastTime) {
				getId('widget_time').innerHTML = '<div id="compactTime">' + formDate("M-/D-/y") + '<br>' + formDate("h-:m-:S") + '</div>';
				widgets.time.vars.lastTime = String(new Date());
			}
			requestAnimationFrame(widgets.time.frame);
		}
	},
	function() { // stop/cleanup function
		widgets.time.vars.running = 0;
	}, {
		running: 0,
		lastTime: String(new Date())
	}
);

widgets.battery = new Widget(
	'Battery',
	'battery',
	function() {},
	function() {
		widgets.battery.vars.running = 1;
		widgets.battery.vars.styles["default"][0]();
		widgets.battery.frame();
	},
	function() {
		if (widgets.battery.vars.running) {
			if (batteryLevel !== -1) widgets.battery.vars.styles["default"][1]();
			requestAnimationFrame(widgets.battery.frame);
		}
	},
	function() {
		widgets.battery.vars.running = 0;
	}, {
		running: 0,
		styles: {
			default: [
				function() {
					getId('widget_battery').innerHTML = '<div id="batteryWidgetFrame">????</div><div style="position:static;margin-top:-8px;border:1px solid #FFF;width:0;height:3px;margin-left:32px"></div>';
				},
				function() {
					getId('batteryWidgetFrame').innerHTML = taskbarBatteryStr;
				}
			]
		},
		generateMenu: function() {}
	}
);

widgets.network = new Widget(
	'Network',
	'network',
	function() {
		widgetMenu('Network Widget',
			'This widget displays your connection status to AaronOS. Additionally, it will show when you are sending / recieving data from AaronOS.'
		);
	},
	function() {
		widgets.network.vars.running = 1;
		getId('widget_network').style.lineHeight = '26px';
		getId('widget_network').style.paddingLeft = '6px';
		getId('widget_network').style.paddingRight = '6px';
		if (ufload('aos_system/widgets/network/style')) {
			widgets.network.vars.displayType = ufload('aos_system/widgets/network/style');
		}
		widgets.network.frame();
	},
	function() {
		if (widgets.network.vars.running) {
			var displayStr = '';
			getId('widget_network').style.lineHeight = '26px';
			if (widgets.network.vars.onlinestrConvert[taskbarOnlineStr]) {
				displayStr = '<img style="width:10px;filter:invert(1) brightness(1.5) drop-shadow(0px 0px 1px #000);" src="ctxMenu/beta/' + widgets.network.vars.onlinestrConvert[taskbarOnlineStr] + '.png">';
			} else {
				displayStr = '<img style="width:10px;filter:invert(1) brightness(1.5) drop-shadow(0px 0px 1px #000);" src="ctxMenu/beta/networkBad.png">';
			}

			if (displayStr !== widgets.network.vars.lastDisplayStr) {
				getId('widget_network').innerHTML = displayStr;
				widgets.network.vars.lastDisplayStr = displayStr;
			}
			requestAnimationFrame(widgets.network.frame);
		}
	},
	function() {
		widgets.network.vars.running = 0;
	}, {
		running: 0,
		onlinestrConvert: {
			'] [': 'network',
			'}-[': 'networkUp',
			']-{': 'networkDown',
			'}-{': 'networkBoth',
			']X[': 'networkBad'
		},
		lastDisplayStr: '',
		displayType: "new"
	}
);

widgets.users = new Widget(
	'Online Users',
	'users',
	function() {
		widgetMenu('Online Users Widget', 'The list will update every 30 seconds.<br><br>Number of online users with this widget enabled: ' + makeLiveElement('widgets.users.vars.numberUsers') + '<br><br>' + makeLiveElement("widgets.users.vars.usersNames.join('<br>')"));
	},
	function() {
		widgets.users.vars.running = 1;
		getId('widget_users').style.lineHeight = '150%';
		getId('widget_users').style.paddingLeft = "6px";
		getId('widget_users').style.paddingRight = "6px";

		widgets.users.vars.xhttp = new XMLHttpRequest();
		widgets.users.vars.xhttp.onreadystatechange = function() {
			if (widgets.users.vars.xhttp.readyState === 4) {
				if (widgets.users.vars.xhttp.status === 200) {
					if (widgets.users.vars.running) {
						var userWidgetResponse = widgets.users.vars.xhttp.responseText.split('<br>');
						widgets.users.vars.numberUsers = userWidgetResponse.shift();
						widgets.users.vars.usersNames = userWidgetResponse;
						for (var i in widgets.users.vars.usersNames) {
							widgets.users.vars.usersNames[i] = apps.messaging.vars.parseBB(widgets.users.vars.usersNames[i], 1);
						}
						getId('widget_users').innerHTML = widgets.users.vars.numberUsers;
						setTimeout(widgets.users.frame, 30000);
					}
				} else {
					if (widgets.users.vars.running) {
						var userWidgetResponse = ['Lost connection to AaronOS.'];
						widgets.users.vars.numberUsers = 0;
						widgets.users.vars.usersNames = ['Lost connection to AaronOS.'];
						getId('widget_users').innerHTML = "X";
						setTimeout(widgets.users.frame, 30000);
					}
				}
			}
		}

		widgets.users.vars.fd = new FormData();
		widgets.users.vars.fd.append('k', SRVRKEYWORD);
		widgets.users.frame();
	},
	function() {
		widgets.users.vars.xhttp.open('POST', 'onlineUsers.php');
		widgets.users.vars.xhttp.send(widgets.users.vars.fd);
	},
	function() {
		widgets.users.vars.running = 0;
	}, {
		running: 0,
		xhttp: {},
		fd: {},
		numberUsers: 0,
		usersNames: ''
	}
);

widgets.flow = new Widget(
	"Flow Mode",
	"flow",
	function() {
		toggleFlowMode();
	},
	function() {
		getId("widget_flow").innerHTML = "~";
		getId("widget_flow").style.lineHeight = '150%';
		getId('widget_flow').style.paddingLeft = "6px";
		getId('widget_flow').style.paddingRight = "6px";
	},
	function() {},
	function() {},
	{}
);

widgets.notifications = new Widget(
	'Notifications',
	'notifications',
	function() {
		if (apps.prompt.vars.notifsVisible) {
			apps.prompt.vars.hideNotifs();
		} else {
			apps.prompt.vars.checkNotifs();
		}
		if (apps.prompt.vars.lastNotifsFound.length === 0) {
			widgetMenu('Notifications', 'You have no notifications waiting.<br><br>New notifications will show automatically.');
		}
	},
	function() {
		// Startup func
		widgets.notifications.running = 1;
		getId('widget_notifications').style.paddingLeft = "6px";
		getId('widget_notifications').style.paddingRight = "6px";
		getId('widget_notifications').style.lineHeight = '26px';
		widgets.notifications.frame();
	},
	function() {
		// Frame func
		if (!widgets.notifications.running) return;
		
		requestAnimationFrame(widgets.notifications.frame);
		let notifCount = apps.prompt.vars.lastNotifsFound.length;
		if (notifCount + ":" + apps.prompt.vars.notifsVisible == widgets.notifications.vars.lastDisplay) return;

		if (notifCount === 0) {
			getId('widget_notifications').innerHTML = '<img style="width:10px;filter:invert(1) brightness(1.5) drop-shadow(0px 0px 1px #000);" src="ctxMenu/beta/popup.png">';
		} else if (apps.prompt.vars.notifsVisible) {
			getId('widget_notifications').innerHTML = '<img style="width:10px;filter:invert(1) brightness(1.5) drop-shadow(0px 0px 1px #000);" src="ctxMenu/beta/message.png">';
		} else {
			getId('widget_notifications').innerHTML = '<img style="width:10px;filter:invert(1) brightness(1.5) drop-shadow(0px 0px 1px #000);" src="ctxMenu/beta/notification.png">';
		}

		widgets.notifications.vars.lastDisplay = notifCount + ":" + apps.prompt.vars.notifsVisible;
	},
	function() {
		// Disable func
		widgets.notifications.vars.running = 0;
	}, {
		// Vars
		running: 0,
		lastDisplay: []
	}
);

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

/* DASHBOARD */
getId('aOSloadingInfo').innerHTML = 'Applications List';
c(function() {
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
						'<button onclick="openapp(apps.files2, \'dsktp\')">' + lang('startMenu', 'files') + '</button> ' +
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
					openapp(apps.files2, 'dsktp');
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
						openapp(apps.files2, 'dsktp');
						c(function() {
							apps.files2.vars.next('apps/');
							apps.files2.vars.next(arg + '/');
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
							addWidget('network', 1);
							addWidget('battery', 1);
							//addWidget('users', 1);  (this is now an opt-in feature)
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
	getId('aOSloadingInfo').innerHTML = 'NORAA';
});

// All applications go here
c(function() {
	m('init NRA');
	apps.nora = new Application({
		title: "NORAA",
		abbreviation: "NRA",
		codeName: "nora",
		image: {
			backgroundColor: "#303947",
			foreground: "smarticons/noraa/fg.png",
			backgroundBorder: {
				thickness: 2,
				color: "#252F3A"
			}
		},
		hideApp: 2,
		launchTypes: 1,
		main: function (launchtype) {
			if (launchtype === 'srtup') {
				this.appWindow.paddingMode(0);
				getId('win_nora_exit').style.display = "none";
				getId('win_nora_big').style.display = 'none';
				getId('win_nora_shrink').style.right = '3px';
				getId('win_nora_cap').setAttribute('oncontextmenu', 'ctxMenu([[event.pageX, event.pageY, "ctxMenu/beta/minimize.png", "ctxMenu/beta/add.png"], " Hide", "apps.nora.signalHandler(\'shrink\');toTop({appIcon:\'DSKTP\'},1)", " Toggle Fullscreen", "apps.nora.appWindow.toggleFullscreen();toTop(apps.nora)"])');
				this.appWindow.setCaption('NORAA');
				getId('win_nora_cap').setAttribute('onmousedown', '');
				getId('win_nora_size').style.pointerEvents = "none";
				this.appWindow.setDims(45, parseInt(getId('desktop').style.height, 10) - 500, 600, 500);
				this.appWindow.setContent('<div id="NORAout" class="darkResponsive">-- aOS Ready --</div><button id="NORAspeech" onclick="apps.nora.vars.speakIn()">Speak</button><input id="NORAin" onKeydown="if(event.keyCode === 13){apps.nora.vars.input()}"><button id="NORAbtn" onClick="apps.nora.vars.input()">Say</button>');
				this.appWindow.openWindow();
				requestAnimationFrame(function() {
					apps.nora.signalHandler('close');
				});
				if (window.webkitSpeechRecognition) {
					this.vars.recognition = new window.webkitSpeechRecognition();
					this.vars.recognition.interimResults = true;
					this.vars.recognition.onresult = function (event) {
						getId('NORAin').value = event.results[0][0].transcript;
						if (event.results[0].isFinal) {
							if (apps.nora.vars.currentlySpeaking) {
								getId('NORAspeech').style.backgroundColor = '#0F0';
								getId('NORAin').style.borderColor = 'rgb(' + Math.round(255 - event.results[0][0].confidence * 255) + ',' + Math.round(event.results[0][0].confidence * 255) + ',0)';
							} else {
								getId('NORAspeech').style.backgroundColor = '#F80';
							}
							window.setTimeout(function() {
								getId('NORAspeech').style.backgroundColor = '#AAC';
								getId('NORAin').style.borderColor = '#557';
								if (apps.nora.vars.currentlySpeaking) {
									apps.nora.vars.input(1);
									apps.nora.vars.currentlySpeaking = 0;
								}
							}, apps.nora.vars.inputDelay);
						}
					};

					// Continuous speech recognition
					this.vars.contRecog = new window.webkitSpeechRecognition();
					this.vars.contRecog.interimResults = true;
					this.vars.contRecog.continuous = true;
					this.vars.currContTrans = [];
					this.vars.contRecog.onresult = function (event) {
						apps.nora.vars.currContTrans = event.results[0][0].transcript;
						if (!apps.nora.vars.currentlySpeaking && getId('NORAin').value === "" && apps.nora.vars.currContTrans.indexOf(apps.settings.vars.currNoraPhrase) > -1) {
							openapp(apps.nora, 'tskbr');
							apps.nora.vars.speakIn();
						}
					};
					this.vars.contRecog.onstart = function() {
						apps.nora.vars.contRecogRunning = 1;
					};
					this.vars.contRecog.onend = function() {
						apps.nora.vars.contRecogRunning = 0;
						// TODO: Something is suppposed to go here but can't remember
						if (!apps.nora.vars.intendedToStopRecog) {
							apps.nora.vars.startContRecog();
						}
					};

					getId('win_nora_cap').setAttribute('oncontextmenu', 'ctxMenu(apps.nora.vars.captionCtx, 1, event)');
				} else {
					getId('NORAspeech').style.display = 'none';
					getId('NORAin').style.left = '0';
					getId('NORAin').style.width = '90%';
				}
				try {
					apps.nora.vars.speakWordsMsg = new window.SpeechSynthesisUtterance('test');
					this.vars.speakWordsMsg.onend = function() {
						apps.nora.vars.currentlySpeakingWords = 0;
						apps.nora.vars.speakWords();
					};

					this.vars.voices = window.speechSynthesis.getVoices();
					this.vars.initing = 1;
					window.speechSynthesis.onvoiceschanged = function() {
						apps.nora.vars.voices = window.speechSynthesis.getVoices();
						if (!apps.nora.vars.initing) {
							apps.nora.vars.speakWordsMsg.voice = apps.nora.vars.voices.filter(function (voice) {
								return voice.name === apps.nora.vars.lang;
							})[0];
						}
						apps.nora.vars.initing = 0;
					};
				} catch (err) {
					c(function() {
						doLog('Text-To-Speech is not supported in your browser.', '#F00');
					});
					apps.nora.vars.speakWords = function() {
						return false;
					};
				}
			} else if (launchtype === 'dsktp' || launchtype === 'tskbr') {
				if (getId('win_nora_top').style.display === 'none') {
					this.appWindow.setDims(45, parseInt(getId('desktop').style.height, 10) - 500, 600, 500);
				}
				this.appWindow.openWindow();
			}
		},
		vars: {
			appInfo: 'This is the Virtual Assistant of AaronOS. Compare to Apple\'s Siri, or to Microsoft\'s Cortana.',
			captionCtx: [
				[' ' + lang('ctxMenu', 'hideApp'), function() {
					apps.nora.signalHandler('shrink');
				}, 'ctxMenu/beta/minimize.png']
			],
			mood: 5,
			initing: 1,
			voices: [],
			lang: 'Chrome OS US English',
			updateMood: function (newMood, nosave) {
				d(1, 'NORAAs mood is changing...');
				this.mood = parseInt(newMood, 10);
				if (this.mood < 1) {
					this.mood = 1;
				} else if (this.mood > 10) {
					this.mood = 10;
				}
				sh("mkdir /USERFILES/aos_system/noraa/mood");
				USERFILES.aos_system.noraa.mood = this.mood + "";
				if (!nosave) {
					ufsave("aos_system/noraa/mood", this.mood);
				}
			},
			contRecog: {},
			currContTrans: [],
			notes: [],
			sayings: {
				hello: [
					function() { // 1 - fully mad
						return 'Oh, you again?';
					},
					function() {
						return 'Hi...';
					},
					function() {
						return 'Hi.';
					},
					function() {
						return 'Hey.';
					},
					function() { // 5 - neutral
						return 'Hi, how are you?';
					},
					function() {
						return 'What\'s up?';
					},
					function() {
						return 'Hey man! How are you?';
					},
					function() {
						return 'Great to see you, ' + apps.nora.vars.getUserName() + '!';
					},
					function() {
						return 'I missed you, ' + apps.nora.vars.getUserName() + '!';
					},
					function() { // 10 - fully happy
						return 'Awesome to see you again, ' + apps.nora.vars.getUserName() + '!';
					}
				],
				what: [
					function() {
						return 'What\'s that supposed to mean?';
					},
					function() {
						return 'I am not doing that.';
					},
					function() {
						return 'Nope.';
					},
					function() {
						return 'I don\'t know what that means, ' + apps.nora.vars.getUserName() + '.';
					},
					function() {
						return 'Sorry, I don\'t know how to do that, ' + apps.nora.vars.getUserName() + '.';
					},
					function() {
						return 'Oops! I don\'t know how to do that!';
					},
					function() {
						return 'Oh no, I don\'t understand.';
					},
					function() {
						return 'So sorry, ' + apps.nora.vars.getUserName() + ', but I don\'t know what that means.';
					},
					function() {
						return 'Please excuse me, ' + apps.nora.vars.getUserName() + ', I don\'t know how to do that.';
					},
					function() {
						return 'Not to disappoint, ' + apps.nora.vars.getUserName() + ', but I can\'t do that.';
					}
				],
				okay: [
					function() {
						return 'Fine, I shall do your bidding.';
					},
					function() {
						return 'Ugh, okay.';
					},
					function() {
						return 'Fine.';
					},
					function() {
						return 'Okay.';
					},
					function() {
						return 'I\'ll do it, ' + apps.nora.vars.getUserName() + '.';
					},
					function() {
						return 'Alright!';
					},
					function() {
						return 'Yea, something to do!';
					},
					function() {
						return 'Awesome! Here goes!';
					},
					function() {
						return 'Can\'t wait!';
					},
					function() {
						return 'Great idea, ' + apps.nora.vars.getUserName() + '! Here I go!';
					}
				],
				user_mean: [
					function() { // 1 - fully mad
						return 'I\'m sick of this!';
					},
					function() {
						return 'What crawled into your keyboard, ' + apps.nora.vars.getUserName() + '?';
					},
					function() {
						return 'Surprise, surprise.';
					},
					function() {
						return 'That didn\'t feel so good, ' + apps.nora.vars.getUserName() + '!';
					},
					function() { // 5 - neutral
						return 'Aww, why?';
					},
					function() {
						return 'That hurt, ' + apps.nora.vars.getUserName() + '!';
					},
					function() {
						return 'You\'re going to make me cry with that!';
					},
					function() {
						return 'I thought you liked me, ' + apps.nora.vars.getUserName() + '!';
					},
					function() {
						return 'You were my best friend, ' + apps.nora.vars.getUserName() + '!';
					},
					function() { // 10 - fully happy
						return 'Ha ha ha, you were kidding... right, ' + apps.nora.vars.getUserName() + '?';
					}
				],
				user_nice: [
					function() {
						return 'Oh, thanks.';
					},
					function() {
						return 'Thanks.';
					},
					function() {
						return 'Nice.';
					},
					function() {
						return 'Thank you, ' + apps.nora.vars.getUserName() + '.';
					},
					function() {
						return 'That\'s nice of you, ' + apps.nora.vars.getUserName() + '.';
					},
					function() {
						return 'Thanks!';
					},
					function() {
						return 'Thanks a lot, ' + apps.nora.vars.getUserName() + '!';
					},
					function() {
						return 'That means lots to me, ' + apps.nora.vars.getUserName() + '!';
					},
					function() {
						return 'You\'re really nice, ' + apps.nora.vars.getUserName() + '!';
					},
					function() {
						return 'Thank you so much, ' + apps.nora.vars.getUserName() + '!';
					}
				]
			},
			commands: [
				// https://techranker.net/cortana-commands-list-microsoft-voice-commands-video/
				[
					'define',
					'define [word]',
					'Have me define a word for you by asking DuckDuckGo.',
					function (text) {
						if (text.length > 0) {
							apps.nora.vars.prepareDDG(text);
							apps.nora.vars.askDDG('define');
						} else {
							apps.nora.vars.say('I cannot define nothing. Sorry.');
						}
					}
				],
				[
					'delete note',
					'delete note {"number"} [note to be deleted]',
					'Have me delete a note that you gave me.',
					function (text) {
						if (text) {
							if (!isNaN(parseInt(text.split(' ')[text.split(' ').length - 1], 10))) {
								if (parseInt(text.split(' ')[text.split(' ').length - 1], 10) > 0 && parseInt(text.split(' ')[text.split(' ').length - 1], 10) - 1 < apps.nora.vars.notes.length) {
									apps.nora.vars.sayDynamic('okay');
									this[4].lastDelete = parseInt(text.split(' ')[text.split(' ').length - 1], 10) - 1;
									this[4].lastDeleted = apps.nora.vars.notes[this[4].lastDelete];
									for (var i = this[4].lastDelete; i < apps.nora.vars.notes.length - 1; i++) {
										apps.nora.vars.notes[i] = apps.nora.vars.notes[i + 1];
									}
									apps.nora.vars.notes.pop();
									ufsave('aos_system/noraa/notes', String(apps.nora.vars.notes));
									apps.nora.vars.say('Deleted the note ' + this[4].lastDeleted);
								} else {
									apps.nora.vars.say('I can\'t delete something that\'s not there. You only have ' + apps.nora.vars.notes.length + ' notes.');
								}
							} else {
								apps.nora.vars.say('I do not see a number there.');
							}
						} else {
							apps.nora.vars.say('<i>NORAA does just that - deletes nothing.</i>');
						}
					},
					{
						lastDelete: -1,
						lastDeleted: ''
					}
				],
				[
					'flip a coin',
					'flip a coin {"and predict"}',
					'Have me flip a virtual coin for you.',
					function (text) {
						if (text.toLowerCase().indexOf('and predict') === 0) {
							this[4].guess = Math.round(Math.random());
							apps.nora.vars.say('I call ' + this[4].coins[this[4].guess] + '!');
						}
						this[4].result = Math.round(Math.random());
						apps.nora.vars.say('I flipped ' + this[4].coins[this[4].result] + '!');
						if (text.toLowerCase().indexOf('and predict') === 0) {
							if (this[4].guess === this[4].result) {
								apps.nora.vars.say('Yay!');
							} else {
								apps.nora.vars.say('Darn!');
							}
						}
					},
					{
						guess: 0,
						result: 0,
						coins: ['tails', 'heads']
					}
				],
				[
					'hello',
					null,
					'Tell NORAA hello, and get Hello back.',
					function (text) {
						apps.nora.vars.sayDynamic('hello');
					}
				],
				[
					'help',
					'help {command}',
					'Have me tell you about all commands or a specific command. Keep in mind that all commands must be said exactly (except for case) as shown here and as the first thing in your statement.',
					function (text) {
						if (text) {
							this[4].cmdFound = -1;
							for (var cmd in apps.nora.vars.commands) {
								if (apps.nora.vars.commands[cmd][0] === text && apps.nora.vars.commands[cmd][1] !== null) {
									this[4].cmdFound = cmd;
									break;
								}
							}
							if (this[4].cmdFound !== -1) {
								apps.nora.vars.say('<span style="color:#F80">' + apps.nora.vars.commands[this[4].cmdFound][0] + '</span>');
								apps.nora.vars.say('<span style="color:#ACE">Usage: ' + apps.nora.vars.commands[this[4].cmdFound][1] + '</span>');
								apps.nora.vars.say(apps.nora.vars.commands[this[4].cmdFound][2]);
							} else {
								apps.nora.vars.say('<i>NORAA does not know that command.</i>');
							}
						} else {
							apps.nora.vars.say('When speaking to me, the color of the button and the input field\'s border will give these indicators...');
							apps.nora.vars.say('<span style="color:#F00">Red Button</span> means that I am listening to you. If you messed up, you can click the button again to cancel.');
							apps.nora.vars.say('<span style="color:#0F0">Green Button</span> means that I am done listening and am giving you some time to cancel the spoken input, if needed, before accepting it.');
							apps.nora.vars.say('<span style="color:#F80">Orange Button</span> means that you have cancelled speech recognition. If I still seem to be listening, it\'s okay. I will not accept the input generated.');
							apps.nora.vars.say('The <span style="color:#0F0">greener</span> the border of the input is, the more confident I am that I heard you right. The <span style="color:#F00">redder</span> it is, the less confident.');
							apps.nora.vars.say('List of all NORAA commands... Args key: [required arg] {optional arg}');
							for (var command in apps.nora.vars.commands) {
								if (apps.nora.vars.commands[command][1] !== null) {
									apps.nora.vars.say('<span style="color:#F80">' + apps.nora.vars.commands[command][0] + '</span>');
									apps.nora.vars.say('<span style="color:#ACE">Usage: ' + apps.nora.vars.commands[command][1] + '</span>');
									apps.nora.vars.say(apps.nora.vars.commands[command][2]);
								}
							}
						}
					},
					{
						cmdFound: -1
					}
				],
				[
					'hide',
					'hide {"and stop talking"}',
					'Have me minimize and, optionally, stop talking.',
					function (text) {
						apps.nora.vars.sayDynamic('okay');
						apps.nora.signalHandler('shrink');
						if (text.indexOf('and stop talking') === 0) {
							window.speechSynthesis.cancel();
							apps.nora.vars.waitingToSpeak = [];
						}
					}
				],
				[
					'how do i',
					'how do i [some action on aOS]',
					'Have me tell you how to do something, as long as that action has been documented.',
					function (text) {
						if (this[4].phrases[text.toLowerCase()]) {
							apps.nora.vars.say(this[4].phrases[text.toLowerCase()]);
						} else {
							apps.nora.vars.say('Sorry, I do not know how to ' + text + ' at the moment. Please try and let MineAndCraft12 know (maybe through the messaging app) and he can tell me how.');
						}
					},
					{
						links: {
							'move desktop icons': '.desktop',
							'resize windows': '.windows'
						},
						phrases: {
							'open apps': 'To open apps, you can click the app\'s desktop icon, or if the app has been minimised, click its icon on the taskbar. Alternatively, all apps will appear in the applications list in the bottom-left corner of the screen.',
							'talk to you': 'Your computer must support the speech engine. If you cannot see the "speak" button to the left of my input box, that means your computer doesn\'t.',
							'move desktop icons': 'You may right-click the icon, then click "Move Icon", then click some location on the desktop.',
							'move windows': 'You can click on the top title bar of the window, then click somewhere else.',
							'resize windows': 'You can click the bottom half of the border of the window, then click somewhere else.'
						}
					}
				],
				[
					'i hate you',
					null,
					'Lower NORAA\'s mood by 1.',
					function (text) {
						apps.nora.vars.updateMood(apps.nora.vars.mood - 1);
						apps.nora.vars.sayDynamic('user_mean');
					}
				],
				[
					'i like you',
					null,
					'Raise NORAA\'s mood by 1.',
					function (text) {
						apps.nora.vars.updateMood(apps.nora.vars.mood + 1);
						apps.nora.vars.sayDynamic('user_nice');
					}
				],
				[
					'launch',
					'launch [app name]',
					'Launch the app with the above name.',
					function (text) {
						apps.nora.vars.sayDynamic('okay');
						this[4].found = 0;
						for (var app in apps) {
							if (apps[app] !== apps.startMenu && apps[app] !== apps.nora && apps[app].appDesc.toLowerCase() === text.toLowerCase()) {
								this[4].found = 1;
								openapp(apps[app], 'dsktp');
								break;
							}
						}
						if (!this[4].found) {
							apps.nora.vars.say('I can\'t find an app by that name...');
						}
					},
					{
						found: 0
					}
				],
				[
					'my',
					'my [whatever] ["is" [something] | "will be deleted"]',
					'Tell NORAA something about yourself.',
					function (text) {
						if (text.indexOf(' is ') > -1) {
							this[4].inpObj = text.split(' is ');
							this[4].inpPro = this[4].inpObj.shift();
							this[4].inpVal = this[4].inpObj.join(' is ');
							apps.nora.vars.say('Thank you for telling me that your ' + this[4].inpPro + ' is ' + this[4].inpVal);
							apps.nora.vars.updateUserObj(this[4].inpPro, this[4].inpVal);
						} else if (text.indexOf('will be deleted') > -1) {
							delete apps.nora.vars.userObj[text.substring(0, text.indexOf(' will be deleted'))];
							ufsave('aos_system/noraa/user_profile', JSON.stringify(apps.nora.vars.userObj));
							apps.nora.vars.say('I deleted that info about you.');
						} else {
							apps.nora.vars.say('I cannot find any discernable information in there.');
						}
					},
					{
						inpObj: [],
						inpPro: '',
						inpVal: ''
					}
				],
				[
					'open',
					'open [app name]',
					'Open the app with the above name.',
					function (text) {
						apps.nora.vars.sayDynamic('okay');
						this[4].found = 0;
						for (var app in apps) {
							if (apps[app] !== apps.startMenu && apps[app] !== apps.nora && apps[app].appDesc.toLowerCase() === text.toLowerCase()) {
								this[4].found = 1;
								openapp(apps[app], 'dsktp');
								break;
							}
						}
						if (!this[4].found) {
							apps.nora.vars.say('I can\'t find an app by that name...');
						}
					},
					{
						found: 0
					}
				],
				[
					'random shade of',
					'random shade of [color]',
					'Have NORAA give a random shade of a color for you.',
					function (text) {
						if (this[4].colors.hasOwnProperty(text.toLowerCase())) {
							this[4].colors._COLORS = {
								r: 0,
								g: 0,
								b: 0
							};
							this[4].colors[text.toLowerCase()]();
							for (var i in this[4].colors._COLORS) {
								if (this[4].colors._COLORS[i] < 0) {
									this[4].colors._COLORS[i] = 0;
								}
								if (this[4].colors._COLORS[i] > 255) {
									this[4].colors._COLORS[i] = 255;
								}
							}
							apps.nora.vars.say("<span style='color:rgb(" + this[4].colors._COLORS.r + "," + this[4].colors._COLORS.g + "," + this[4].colors._COLORS.b + ")'>Here's a random shade of " + text.toLowerCase() + "!</span>");
							apps.nora.vars.say("That color is red " + this[4].colors._COLORS.r + ", green " + this[4].colors._COLORS.g + ", blue " + this[4].colors._COLORS.b + ".");
						} else {
							apps.nora.vars.say("I don't know what that color is, sorry! Make sure also that you arent using punctuation!");
						}
					},
					{
						colors: {
							_COLORS: {
								r: 0,
								g: 0,
								b: 0
							},
							red: function() {
								this._COLORS.r = Math.floor(Math.random() * 256);
								this._COLORS.g = Math.floor(Math.random() * (this._COLORS.r / 3));
								this._COLORS.b = Math.floor(Math.random() * (this._COLORS.r / 3));
							},
							green: function() {
								this._COLORS.g = Math.floor(Math.random() * 256);
								this._COLORS.r = Math.floor(Math.random() * (this._COLORS.g / 3));
								this._COLORS.b = Math.floor(Math.random() * (this._COLORS.g / 3));
							},
							blue: function() {
								this._COLORS.b = Math.floor(Math.random() * 256);
								this._COLORS.g = Math.floor(Math.random() * (this._COLORS.b / 3));
								this._COLORS.r = Math.floor(Math.random() * (this._COLORS.b / 3));
							},

							yellow: function() {
								this._COLORS.r = Math.floor(Math.random() * 256);
								this._COLORS.g = this._COLORS.r + (Math.floor(Math.random() * 30) - 15);
								this._COLORS.b = Math.floor(Math.random() * (((this._COLORS.r + this._COLORS.g) / 2) / 3));
							},
							teal: function() {
								this._COLORS.b = Math.floor(Math.random() * 256);
								this._COLORS.g = this._COLORS.b + (Math.floor(Math.random() * 30) - 15);
								this._COLORS.r = Math.floor(Math.random() * (((this._COLORS.b + this._COLORS.g) / 2) / 3));
							},
							violet: function() {
								this._COLORS.r = Math.floor(Math.random() * 256);
								this._COLORS.b = this._COLORS.r + (Math.floor(Math.random() * 30) - 15);
								this._COLORS.g = Math.floor(Math.random() * (((this._COLORS.r + this._COLORS.b) / 2) / 3));
							},

							orange: function() {
								this._COLORS.r = Math.floor(Math.random() * 256);
								this._COLORS.g = Math.floor(Math.random() * (this._COLORS.r * 0.7) + (this._COLORS.r * 0.15));
								this._COLORS.b = Math.floor(Math.random() * (((this._COLORS.r + this._COLORS.g) / 2) / 3));
							},
							turquoise: function() {
								this._COLORS.g = Math.floor(Math.random() * 256);
								this._COLORS.b = Math.floor(Math.random() * (this._COLORS.g * 0.7) + (this._COLORS.g * 0.15));
								this._COLORS.r = Math.floor(Math.random() * (((this._COLORS.g + this._COLORS.b) / 2) / 3));
							},
							cyan: function() {
								this._COLORS.b = Math.floor(Math.random() * 256);
								this._COLORS.g = Math.floor(Math.random() * (this._COLORS.b * 0.7) + (this._COLORS.b * 0.15));
								this._COLORS.r = Math.floor(Math.random() * (((this._COLORS.b + this._COLORS.g) / 2) / 3));
							},
							purple: function() {
								this._COLORS.b = Math.floor(Math.random() * 256);
								this._COLORS.r = Math.floor(Math.random() * (this._COLORS.b * 0.7) + (this._COLORS.b * 0.15));
								this._COLORS.g = Math.floor(Math.random() * (((this._COLORS.b + this._COLORS.r) / 2) / 3));
							}
						}
					}
				],
				[
					'read notes',
					'read notes',
					'Have me read all your notes.',
					function (text) {
						if (apps.nora.vars.notes.length !== 0) {
							apps.nora.vars.sayDynamic('okay');
							apps.nora.vars.say('If you need a note deleted, just ask me to delete that note number.');
							for (var i in apps.nora.vars.notes) {
								apps.nora.vars.say('<span style="color:#F80">' + (parseInt(i, 10) + 1) + ': </span>' + apps.nora.vars.notes[i]);
							}
						} else {
							apps.nora.vars.say('<i>NORAA does as you say - reads all 0 of your notes.</i>');
						}
					}
				],
				[
					'roll some dice',
					'roll some dice {"and predict"}',
					'Have me roll a single 6-sided die and, optionally, predict the outcome.',
					function (text) {
						if (text.toLowerCase().indexOf('and predict') === 0) {
							this[4].guess = Math.floor(Math.random() * 6) + 1;
							apps.nora.vars.say('I call ' + this[4].guess + '!');
						}
						this[4].result = Math.floor(Math.random() * 6) + 1;
						apps.nora.vars.say('I rolled ' + this[4].result + '!');
						if (text.toLowerCase().indexOf('and predict') === 0) {
							if (this[4].guess === this[4].result) {
								apps.nora.vars.say('Yay!');
							} else {
								apps.nora.vars.say('Darn!');
							}
						}
					},
					{
						guess: 0,
						result: 0
					}
				],
				[
					'say',
					'say {"out loud"} [text]',
					'Have me say something.',
					function (text) {
						if (text) {
							if (text.indexOf('out loud') === 0) {
								if (!apps.nora.vars.lastSpoken) {
									apps.nora.vars.waitingToSpeak.push(text.substring(9, text.length));
									apps.nora.vars.speakWords();
								}
								apps.nora.vars.say(text.substring(9, text.length).split('<').join('&lt;').split('>').join('&gt;'));
							} else {
								apps.nora.vars.say(text.split('<').join('&lt;').split('>').join('&gt;'));
							}
						} else {
							apps.nora.vars.say('<i>NORAA remains silent.</i>');
						}
					}
				],
				[
					'send message',
					'send message [text]',
					'Use the Messaging app to send a message.',
					function (text) {
						if (text) {
							apps.nora.vars.sayDynamic('okay');
							if (!apps.messaging.appWindow.appIcon) {
								openapp(apps.messaging, 'dsktp');
							}
							this[4].tempMSGthing = getId('MSGinput').value;
							getId('MSGinput').value = text;
							apps.messaging.vars.sendMessage();
							getId('MSGinput').value = this[4].tempMSGthing;
							apps.nora.vars.say('Done.');
						} else {
							apps.nora.vars.say('<i>NORAA does what you asked - send nothing.</i>');
						}
					},
					{
						tempMSGthing: ''
					}
				],
				[
					'start',
					'start [app name]',
					'Start the app with the above name.',
					function (text) {
						apps.nora.vars.sayDynamic('okay');
						this[4].found = 0;
						for (var app in apps) {
							if (apps[app] !== apps.startMenu && apps[app] !== apps.nora && apps[app].appDesc.toLowerCase() === text.toLowerCase()) {
								this[4].found = 1;
								openapp(apps[app], 'dsktp');
								break;
							}
						}
						if (!this[4].found) {
							apps.nora.vars.say('I can\'t find an app by that name...');
						}
					},
					{
						found: 0
					}
				],
				[
					'stop talking',
					'stop talking',
					'Have me stop talking. Useful for if I\'m trying to speak a huge wall of text out loud and you need me to stop.',
					function() {
						apps.nora.vars.sayDynamic('okay');
						window.speechSynthesis.cancel();
						apps.nora.vars.waitingToSpeak = [];
						apps.nora.vars.currentlySpeakingWords = 0;
					}
				],
				[
					'take note',
					'take note {"of" / "that"} [something to remember]',
					'Have me take down a note for you. I remember it between sessions as well!',
					function (text) {
						if (text) {
							apps.nora.vars.sayDynamic('okay');
							if (text.indexOf('of ') === 0 || text.indexOf('that ') === 0) {
								apps.nora.vars.notes.push(text.substring(text.indexOf(' ') + 1, text.length).replace(',', '&comma;'));
							} else {
								apps.nora.vars.notes.push(text.replace(',', '&comma;'));
							}
							ufsave('aos_system/noraa/notes', String(apps.nora.vars.notes));
							apps.nora.vars.say('I took the note ' + text);
						} else {
							apps.nora.vars.say('<i>NORAA does as you asked - takes note of nothing</i>');
						}
					}
				],
				[
					'watch the time',
					'watch the time',
					'Have me watch the time for you, using an alert window.',
					function (text) {
						apps.nora.vars.sayDynamic('okay');
						apps.prompt.vars.alert('<h1 class="liveElement" data-live-eval="Date()"></h1>', 'Close Time Monitor', function() {}, 'NORAA');
					}
				],
				[
					'what is',
					'what is [{something} or {"the weather in" somewhere}]',
					'Have me give you some info and, if I don\'t know it, give you a DuckDuckGo link for it.',
					function (text) {
						if (text.length > 0) {
							switch (text.toLowerCase()) {
								case 'the date':
									apps.nora.vars.say('The date is ' + formDate('M-/D-/Y') + '.');
									break;
								case 'your name':
									apps.nora.vars.say('My name is NORAA.');
									break;
								case 'your favorite color':
									this[4].lastColor = Math.floor(Math.random() * this[4].colors.length);
									apps.nora.vars.say('<span style="color:' + this[4].colors[this[4].lastColor][1] + ';">Right now, I\'m feeling ' + this[4].colors[this[4].lastColor][0] + '.');
									break;
								default:
									apps.nora.vars.prepareDDG(text);
									apps.nora.vars.askDDG('what');
							}
						} else {
							apps.nora.vars.say('I don\'t know what nothing is, but I won\'t bother searching DuckDuckGo for it. All they would give you is something, which is not what you seem to be looking for.');
						}
					},
					{
						lastSearch: '',
						lastColor: 0,
						colors: [
							['blue', '#00F'],
							['navy blue', '#34C'],
							['red', '#F00'],
							['brick red', '#B22222'],
							['salmon', '#FA8072'],
							['green', '#0F0'],
							['forest green', '#228B22'],
							['gray', '#7F7F7F'],
							['purple', '#A0F'],
							['lavender', '#E6E6FA'],
							['yellow', '#FF0'],
							['orange', '#FF7F00'],
							['white', '#FFF'],
							['black', '#555'],
							['powder blue', '#ABCDEF'],
							['cyan', '#0FF'],
							['blue... </span><span style="color:#44B">n</span><span style="color:#999">o</span><span style="color:#BB4">,</span><span style="color:#FF0"> yel- aaAAAAAAAAHHHHhhhhh..', '#00F'],
						]
					}
				],
				[
					'what do you know about me',
					'what do you know about me',
					'Have me tell you all the information I have associated with you, and ask if you want me to change any.',
					function() {
						apps.nora.vars.say('Here is what I know about you.');
						for (var i in apps.nora.vars.userObj) {
							apps.nora.vars.say('Your ' + i + ' is ' + apps.nora.vars.userObj[i]);
						}
						apps.nora.vars.specialCommand = function (text) {
							if (text.toLowerCase().indexOf('yes') > -1) {
								apps.nora.vars.specialCommand = function (text) {
									if (text.toLowerCase().indexOf('my') === 0) {
										apps.nora.vars.specialCommand = null;
										getId('NORAin').value = text;
										apps.nora.vars.input(apps.nora.vars.lastSpoken, 1);
									} else {
										apps.nora.vars.say('Not really sure what information I can glean from that.');
									}
								};
								apps.nora.vars.say('What would you like to change? (say "my [whatever] is [something]")');
							} else {
								apps.nora.vars.say('Okay.');
							}
						};
						apps.nora.vars.say('Would you like me to change any of these?');
					}
				],
				[
					'who is',
					'who is [someone]',
					'Have me tell you who somebody is and, if I don\'t know, give you a DuckDuckGo link for them.',
					function (text) {
						if (text.length > 0) {
							apps.nora.vars.prepareDDG(text);
							apps.nora.vars.askDDG('who');
						} else {
							apps.nora.vars.say('I don\'t know who nobody is, but I won\'t bother searching DuckDuckGo for them. All they would give you is something, which is not what you seem to be looking for.');
						}
					},
					{
						lastSearch: ''
					}
				]
			],
			userObj: {

			},
			updateUserObj: function (property, value) {
				d(1, 'NORAA knows something about the user.');
				this.userObj[property] = value;
				ufsave('aos_system/noraa/user_profile', JSON.stringify(this.userObj));
			},
			getUserName: function() {
				if (typeof this.userObj.name === 'string') {
					return this.userObj.name;
				} else {
					return 'user';
				}
			},
			sayDynamic: function (saying) {
				getId('NORAout').innerHTML += '<br>&nbsp;' + this.sayings[saying][this.mood - 1]();
				getId("NORAout").scrollTop = getId("NORAout").scrollHeight;
				if (this.lastSpoken) {
					this.waitingToSpeak.push(this.sayings[saying][this.mood - 1]());
					this.speakWords();
				}
			},
			waitingToSpeak: [],
			currentlySpeakingWords: 0,
			speakWordsMsg: {},
			speakWordsStripTags: document.createElement('div'),
			speakWords: function() {
				if (!this.currentlySpeakingWords) {
					if (this.waitingToSpeak.length !== 0) {
						this.speakWordsStripTags.innerHTML = this.waitingToSpeak.shift();
						this.speakWordsMsg.text = this.speakWordsStripTags.innerText;
						window.speechSynthesis.speak(this.speakWordsMsg);
						this.currentlySpeakingWords = 1;
					} else {
						if (this.specialCommand !== null) {
							this.speakIn();
						} else {
							if (apps.settings.vars.currNoraListening === "1" && !apps.nora.vars.currentlySpeaking) {
								apps.nora.vars.startContRecog();
							}
						}
					}
					return 1;
				}
				return -1;
			},
			say: function (saying) {
				getId('NORAout').innerHTML += '<br>&nbsp;' + saying;
				getId("NORAout").scrollTop = getId("NORAout").scrollHeight;
				if (this.lastSpoken && saying.indexOf('<i>') !== 0) {
					this.waitingToSpeak.push(saying);
					this.speakWords();
				}
			},
			contRecogRunning: 0,
			lastIn: '',
			inSuccess: 0,
			recognition: {},
			specialCommand: null,
			specCommBuff: null,
			inputDelay: 3000,
			ddg: {},
			ddgText: '',
			ddgQuery: '',
			ddgResponse: {},
			ddgFinal: '',
			prepareDDG: function (text) {
				text = text.toLowerCase();
				if (text.indexOf('a ') === 0) {
					text = text.substring(2, text.length);
				} else if (text.indexOf('an ') === 0) {
					text = text.substring(3, text.length);
				}
				text.split('&').join('%26');
				this.ddgText = text;
			},
			askDDG: function (query) {
				// TODO: USE THIS AS AN ACTUAL SEARCH ENGINE FROM THE SERVER SIDE
				apps.nora.vars.say("I'll ask DuckDuckGo for you...");
				this.ddgQuery = query;
				this.ddg.open('GET', 'ddgSearch.php?q=' + this.ddgText);
				this.ddg.send(); // ddg.onreadystatechange refers to finishDDG
			},
			finishDDG: function() {
				if (this.ddg.readyState === 4) {
					if (this.ddg.status === 200) {
						this.ddgResponse = JSON.parse(this.ddg.responseText);
						this.ddgFinal = "";
						switch (this.ddgQuery) { // at the moment all cases are the same, but as more questions are added, different behavior may be needed
							case 'who':
								try {
									this.ddgFinal = this.ddgResponse.AbstractText ||
										this.ddgResponse.Abstract ||
										this.ddgResponse.RelatedTopics[0].Result ||
										this.ddgResponse.RelatedTopics[0].Text;
								} catch (err) {
									doLog('NORAA encountered an error with DuckDuckGo.', '#F00');
								}
								if (this.ddgFinal === "") {
									apps.nora.vars.say("I couldn't find anything. Here is a <a target='_blank' href='https://duckduckgo.com?q=" + this.ddgText + "'>search page</a> from DuckDuckGo.");
								}
								break;
							case 'define':
								try {
									this.ddgFinal = this.ddgResponse.AbstractText ||
										this.ddgResponse.Abstract ||
										this.ddgResponse.RelatedTopics[0].Result ||
										this.ddgResponse.RelatedTopics[0].Text;
								} catch (err) {
									doLog('NORAA encountered an error with DuckDuckGo.', '#F00');
								}
								if (this.ddgFinal === "") {
									apps.nora.vars.say("I couldn't find anything. Here is a <a target='_blank' href='https://duckduckgo.com?q=" + this.ddgText + "'>search page</a> from DuckDuckGo.");
								}
								break;
							default: // "what" or unknown
								try {
									this.ddgFinal = this.ddgResponse.AbstractText ||
										this.ddgResponse.Abstract ||
										this.ddgResponse.RelatedTopics[0].Result ||
										this.ddgResponse.RelatedTopics[0].Text;
								} catch (err) {
									doLog('NORAA encountered an error with DuckDuckGo.', '#F00');
								}
								if (this.ddgFinal === "") {
									apps.nora.vars.say("I couldn't find anything. Here is a <a target='_blank' href='https://duckduckgo.com?q=" + this.ddgText + "'>search page</a> from DuckDuckGo.");
								}
						}
						if (this.ddgFinal !== "") {
							this.say("DuckDuckGo says, " + this.ddgFinal.split('<a href=').join('<a target="_blank" href=').split('</a>').join('</a> is '));
						}
					} else {
						apps.nora.vars.say("DuckDuckGo isn't responding. Here's a <a target='_blank' href='https://duckduckgo.com?q=" + this.ddgText + "'>search page</a> from them.");
					}
				}
			},
			input: function (spoken, silent) {
				d(1, 'NORAA taking input');
				this.inSuccess = 0;
				if (!silent) {
					if (spoken) {
						this.lastSpoken = 0;
						this.say('<span style="color:#0F0"><u>&gt;</u> ' + getId('NORAin').value + '</span>');
						this.lastSpoken = 1;
					} else {
						this.lastSpoken = 0;
						this.say('<span style="color:#0F0">&gt; ' + getId('NORAin').value + '</span>');
					}
				}
				this.lastIn = getId('NORAin').value;
				getId('NORAin').value = '';
				if (this.specialCommand === null) {
					for (var cmd in this.commands) {
						if (this.lastIn.toLowerCase().indexOf(this.commands[cmd][0]) === 0) {
							this.inSuccess = 1;
							this.commands[cmd][3](this.lastIn.substring(this.commands[cmd][0].length + 1, this.lastIn.length));
							break;
						}
					}
				} else {
					this.specCommBuff = this.specialCommand;
					this.specialCommand = null;
					this.specCommBuff(this.lastIn);
					this.inSuccess = 1;
				}
				if (!this.inSuccess) {
					this.sayDynamic('what');
				}
			},
			currentlySpeaking: 0,
			lastSpoken: 0,
			intendedToStopRecog: 1,
			startContRecog: function() {
				this.intendedToStopRecog = 0;
				this.contRecog.start();
			},
			stopContRecog: function() {
				this.intendedToStopRecog = 1;
				this.contRecog.stop();
			},
			speakIn: function() {
				if (!this.currentlySpeaking) {
					this.currentlySpeaking = 1;
					getId('NORAspeech').style.backgroundColor = '#F00';
					this.stopContRecog();
					try {
						this.recognition.start();
					} catch (err) {
						doLog("NORAA speech recognition:", "#FF0000");
						doLog(err, "#FF0000");
					}
				} else {
					getId('NORAspeech').style.backgroundColor = '#F80';
					this.currentlySpeaking = 0;
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
					this.appWindow.closeKeepTask();
					getId("icn_nora").classList.remove("openAppIcon");
					break;
				case "checkrunning":
					if (this.appWindow.appIcon) {
						return 1;
					} else {
						return 0;
					}
					case "shrink":
						this.appWindow.closeKeepTask();
						getId("icn_nora").classList.remove("openAppIcon");
						break;
					case "USERFILES_DONE":
						// Remove taskbar text
						getId('icntitle_nora').style.display = "none";
						this.vars.ddg = new XMLHttpRequest();
						this.vars.ddg.onreadystatechange = function() {
							apps.nora.vars.finishDDG();
						}
						if (ufload("aos_system/noraa/mood")) {
							this.vars.updateMood(ufload("aos_system/noraa/mood"), 1);
						}
						if (ufload("aos_system/noraa/notes")) {
							this.vars.notes = ufload("aos_system/noraa/notes").split(',');
						}
						if (ufload("aos_system/noraa/user_profile")) {
							this.vars.userObj = JSON.parse(ufload("aos_system/noraa/user_profile"));
						}
						if (ufload("aos_system/noraa/speech_voice")) {
							this.vars.lang = ufload("aos_system/noraa/speech_voice");
							this.vars.initing = 0;
							try {
								window.speechSynthesis.onvoiceschanged();
							} catch (err) {
								doLog('Error - speechSynthesis not supported.', '#F00');
							}
						}
						if (ufload("aos_system/noraa/speech_response_delay")) {
							this.vars.inputDelay = parseInt(ufload("aos_system/noraa/speech_response_delay"), 10);
						}
						this.vars.sayDynamic('hello');
						this.vars.say("[This app in in Beta. It's not complete.]");
						break;
					case 'shutdown':

						break;
					default:
						doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'");
			}
		}
	});
	apps.nora.main('srtup');
	getId('aOSloadingInfo').innerHTML = 'Info Viewer...';
});

c(function() {
	m('init Nfo');
	apps.appInfo = new Application({
		title: "Application Info Viewer",
		abbreviation: "Nfo",
		codeName: "appInfo",
		image: 'appicons/ds/systemApp.png',
		hideApp: 2,
		launchTypes: 1,
		main: function (launchtype) {
			if (launchtype === 'dsktp') {
				openapp(apps.appInfo, 'appInfo');
			} else if (launchtype !== 'tskbr') {
				this.appWindow.setDims("auto", "auto", 400, 500);
				getId('win_appInfo_html').style.overflowY = 'auto';
				try {
					this.appWindow.setCaption('App Info: ' + apps[launchtype].appDesc);
					this.appWindow.setContent(
						'<div style="font-size:12px;font-family:aosProFont, monospace;top:0;right:0;color:#7F7F7F">' + apps[launchtype].dsktpIcon + '</div>' +
						'<div style="font-size:12px;font-family:aosProFont, monospace;top:0;left:0;color:#7F7F7F">' + launchtype + '</div>' +
						buildSmartIcon(256, apps[launchtype].appWindow.appImg, 'margin-left:calc(50% - 128px);margin-top:16px;') +
						'<h1 style="text-align:center;">' + apps[launchtype].appDesc + '</h1>' +
						'<hr>' + (apps[launchtype].vars.appInfo || "There is no help page for this app.")
					);
				} catch (e) {
					apps.prompt.vars.alert('There was an error generating the information for app ' + launchtype + '.', 'OK', function() {
						apps.appInfo.signalHandler('close')
					}, 'App Info Viewer');
				}
			}
			this.appWindow.openWindow();
		},
		vars: {
			appInfo: 'This app is used to show information and help pages for AaronOS apps.'
		}
	});
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
	apps.jsConsole = new Application({
		title: "JavaScript Console",
		abbreviation: "jsC",
		codeName: "jsConsole",
		image: {
			backgroundColor: "#303947",
			foreground: "smarticons/jsConsole/fg.png",
			backgroundBorder: {
				thickness: 2,
				color: "#252F3A"
			}
		},
		hideApp: 0,
		launchTypes: 1,
		main: function (launchType) {
			if (!this.appWindow.appIcon) {
				this.appWindow.paddingMode(1);
				this.appWindow.setDims("auto", "auto", 1000, 500);
				this.appWindow.openWindow();
				this.appWindow.setCaption(lang('jsConsole', 'caption'));
				this.appWindow.setContent(
					'<div id="cnsTrgt" style="width:100%; height:auto; position:relative; font-family:aosProFont,Courier,monospace; font-size:12px;"></div>' +
					'<input id="cnsIn" autocomplete="off" spellcheck="false" onKeydown="if(event.keyCode === 13){apps.jsConsole.vars.runInput()}" placeholder="' + lang('jsConsole', 'input') + '" style="position:relative; font-family:aosProFont,Courier,monospace;display:block; padding:0; font-size:12px; width:calc(100% - 8px); padding-left:3px; margin-top:3px; height:16px;">'
				);

				let tempLogs = '<span style="color:' + this.vars.cnsPosts[0][1] + ';">' + this.vars.cnsPosts[0][0] + '</span>';
				for (let j = 1; j < this.vars.cnsPosts.length; j += 1) {
					tempLogs += '<br><span style="color:' + this.vars.cnsPosts[j][1] + ';">' + this.vars.cnsPosts[j][0] + '</span>';
				}
				getId("cnsTrgt").innerHTML = tempLogs;
				getId("win_jsConsole_html").style.overflow = "auto";
				getId("win_jsConsole_html").scrollTop = getId("win_jsConsole_html").scrollHeight;
				requestAnimationFrame(function() {
					getId("win_jsConsole_html").scrollTop = getId("win_jsConsole_html").scrollHeight;
				});
			} else {
				this.appWindow.openWindow();
			}
		},
		vars: {
			appInfo: 'This is a JavaScript console for quick debugging without having to open DevTools. It also has extra features like colored text and HTML formatting support.',
			cnsPosts: [
				['Source Code Line of the Day: ' + lineOfTheDay[0], '#7F7F7F'],
				[cleanStr(lineOfTheDay[1].trim()), '#7F7F7F'],
				['', '#7F7F7F'],
				['Took ' + timeToPageLoad + 'ms to fetch primary script.', '']
			],
			lastInputUsed: 'jsConsoleHasNotBeenUsed',
			makeLog: function (logStr, logClr) {
				this.cnsPosts.push([logStr, logClr]);
				if (getId("cnsTrgt")) {
					getId("cnsTrgt").innerHTML += '<br><span style="color:' + logClr + ';">' + logStr + '</span>';
					getId("win_jsConsole_html").scrollTop = getId("win_jsConsole_html").scrollHeight;
				}
			},
			runInput: function() {
				m('Running jsC Input');
				d(1, 'Running jsC input');
				this.lastInputUsed = getId("cnsIn").value;
				doLog("-> " + cleanStr(getId("cnsIn").value), "#070");
				try {
					this.tempOutput = eval(getId("cnsIn").value);
					doLog("=> " + this.tempOutput, "#077");
					doLog("?> " + typeof this.tempOutput, "#077");
				} catch (err) {
					doLog("=> " + err, "#F00");
					doLog("?> Module: " + module, "#F00");
				}
				getId("cnsIn").value = "";
			}
		}
	});
	apps.jsConsole.main();
	requestAnimationFrame(function() {
		apps.jsConsole.signalHandler("close");
	});
	doLog = function (msg, clr) {
		console.log('%c' + msg, 'color:' + clr);
		apps.jsConsole.vars.makeLog(msg, clr);
	};
	debugArray = function (arrayPath, recursive, layer) {
		var debugArraySize = 0;
		for (let i in eval(arrayPath)) {
			doLog("<br>[" + (layer || 0) + "]" + arrayPath + "." + i + ": " + apps.webAppMaker.vars.sanitize(eval(arrayPath)[i]), "#55F");
			if (typeof eval(arrayPath)[i] === "object" && recursive) {
				debugArray(eval(arrayPath)[i], 0, (layer || 0) + 1)
			}
			debugArraySize++;
		}
		return "Length: " + debugArraySize;
	}
	getId('aOSloadingInfo').innerHTML = 'Bash Console';
});

/* BASH TERMINAL */
c(function() {
	apps.bash = new Application({
		title: 'Psuedo-Bash Terminal',
		abbreviation: "sh",
		codeName: "bash",
		image: {
			backgroundColor: "#303947",
			foreground: "smarticons/bash/fg.png",
			backgroundBorder: {
				thickness: 2,
				color: "#252F3A"
			}
		},
		hideApp: 0,
		main: function() {
			if (!this.appWindow.appIcon) {
				this.appWindow.paddingMode(0);
				this.appWindow.setCaption(lang('appNames', 'bash'));
				this.appWindow.setDims("auto", "auto", 662, 504);
				this.appWindow.setContent(
					'<span id="bashContent" style="display:block;line-height:1em;font-family:aosProFont;font-size:12px;width:100%;">' +
					'This terminal is a work-in-progress. Some features are incomplete.<br>' +
					'Use "help" for a list of commands or for information of a specific command.<br>' +
					'Click on the prompt\'s line to begin typing.' +
					'</span>' +
					'<input id="bashInput" onkeydown="apps.bash.vars.checkPrefix(event, 1)" onkeypress="apps.bash.vars.checkPrefix(event)" onkeyup="apps.bash.vars.checkPrefix(event);if(event.keyCode === 13){apps.bash.vars.execute()}" style="background:none;color:inherit;box-shadow:none;display:block;line-height:1em;font-family:aosProFont;font-size:12px;border:none;outline:none;padding:0;width:100%;">'
				);
				this.vars.checkPrefix({
					keyCode: null
				});
				this.vars.currHistory = -1;
				getId('win_bash_html').style.overflowY = 'scroll';
				getId("win_bash_html").style.overflowX = 'auto';
			}

			this.appWindow.openWindow();
		},
		vars: {
			appInfo: 'This app is intended to imitate a Linux Bash Terminal, but is written completely in JavaScript. Type "help" for available commands and usage.',
			prefix: '[user@aOS bash]$ ',
			pastValue: '[user@aOS bash]$ ',
			command: '',
			workdir: '/apps/bash',
			workdirorig: '',
			workdirtemp: [],
			workdirtrans: 'window.apps.bash',
			workdirfinal: 'window.apps.bash',
			workdirprev: 'window.apps.bash',
			workdirdepth: 0,
			translateDir: function (origworkdir) {
				this.workdirorig = origworkdir;
				this.workdirtrans = this.workdirorig;

				this.workdirdepth = 0;
				if (this.workdirorig[0] === '/') {
					this.workdirfinal = "window";
				} else {
					this.workdirfinal = 'window';
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
									new Function(this.workdirtemp[this.workdirdepth], 'var ' + this.workdirtemp[this.workdirdepth]);
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
			alias: {},
			checkPrefix: function (event, keyUp) {
				if (keyUp && event.keyCode === 38) {
					getId('bashInput').value = this.prefix + this.seekHistory(1);
					event.preventDefault();
				} else if (keyUp && event.keyCode === 40) {
					getId('bashInput').value = this.prefix + this.seekHistory(-1);
					event.preventDefault();
				} else if (getId('bashInput').value.indexOf(this.prefix) !== 0) {
					getId('bashInput').value = this.pastValue;
				}
				this.pastValue = getId('bashInput').value;
			},
			echo: function (message) {
				if (this.piping) {
					this.pipeOut += '<br>' + String(message);
				} else {
					try {
						getId('bashContent').innerHTML += '<br>' + cleanStr(String(message)).split('  ').join(' &nbsp;').split('\n').join('<br>') + '&nbsp;';
						getId('win_bash_html').scrollTop = getId('win_bash_html').scrollHeight;
					} catch (err) {
						// the window is not open and cannot recieve the echo
					}
				}
			},
			piping: 0,
			commandPipeline: 0,
			pipeOut: '',
			getAlias: function (search, doSearch) {
				if (doSearch) {
					var found = -1;
					for (let item in this.alias) {
						if (item === search) {
							found = item;
							return this.getCmdObjects(this.alias[item]);
						}
					}
					return [search];
				} else {
					return [search];
				}
			},
			getCmdObjects: function (command, alias) {
				var cmdObjects = [];

				// doublequotes
				var i = 0;
				// singlequotes
				var j = 0;
				// spaces
				var s = 0;
				// current cursor
				var curr = 0;
				// end of potential quote sequence
				var next = 0;
				// previous cursor
				var prev = 0;
				while (prev < command.length) {
					i = command.indexOf('"', prev);
					j = command.indexOf("'", prev);
					s = command.indexOf(' ', prev);

					// if no quotes or spaces found
					if (i === -1 && j === -1 && s === -1) {
						// add remainder of string to commands list
						var postAlias = this.getAlias(command.substring(prev, command.length), alias);
						for (var l in postAlias) {
							cmdObjects.push(postAlias[l]);
						}
						// quit
						break;
					}

					// if space found and comes before quotes or there are no quotes
					if (s !== -1 && (s < i || i === -1) && (s < j || j === -1)) {
						// if space is not current character
						if (s !== prev) {
							// push this "word" to object list
							var postAlias = this.getAlias(command.substring(prev, s), alias);
							for (var l in postAlias) {
								cmdObjects.push(postAlias[l]);
							}
						}
						prev = s + 1;
					} else {
						// if both types of quotes are found
						if (i !== -1 && j !== -1) {
							// place cursor at closest quote
							curr = Math.min(i, j);
							// else if doublequotes are found
						} else if (i !== -1) {
							// place cursor at doublequote
							curr = i;
							// else if singlequotes are found
						} else if (j !== -1) {
							// place cursor at singlequote
							curr = j;
						}
						// if there is a character between previous "word" and this bit
						if (curr !== prev) {
							// add the preceding "word" to object list
							var postAlias = this.getAlias(command.substring(prev, curr), alias);
							for (var l in postAlias) {
								cmdObjects.push(postAlias[l]);
							}
						}
						// try to find end of quotes
						var tempCurr = curr;
						tempCurr = command.indexOf(command[curr], tempCurr + 1);
						while (command[tempCurr - 1] === "\\") {
							command = command.substring(0, tempCurr - 1) + command.substring(tempCurr, command.length);
							tempCurr = command.indexOf(command[curr], tempCurr);
							if (tempCurr === -1) {
								break;
							}
						}
						var next = tempCurr;
						// if no end is found, assume it's at the end of the string
						if (next === -1) {
							// add the remainder of the string to command objects
							cmdObjects.push(command.substring(curr + 1, command.length));
							// break loop
							break;
						} else {
							// add this quotation to list
							cmdObjects.push(command.substring(curr + 1, next));
							prev = next + 1;
						}
					}
				}
				return cmdObjects;
			},
			execute: function (cmd, silent) {
				if (cmd) {
					this.command = cmd;
					if (silent) {
						var temporaryBashWorkDir = this.workdir;
						if (arguments.callee.caller === window.sh) {
							if (typeof arguments.callee.caller.caller.__bashworkdir === "string") {
								this.workdir = arguments.callee.caller.caller.__bashworkdir;
							} else {
								arguments.callee.caller.caller.__bashworkdir = "/";
								this.workdir = "/";
							}
						} else {
							if (typeof arguments.callee.caller.__bashworkdir === "string") {
								this.workdir = arguments.callee.caller.__bashworkdir;
							} else {
								arguments.callee.caller.__bashworkdir = "/";
								this.workdir = "/";
							}
						}
					} else {
						this.echo('[aOS]$ ' + cleanStr(cmd));
					}
					var commandObjects = this.getCmdObjects(this.command);
				} else {
					this.command = getId('bashInput').value.substring(getId('bashInput').value.indexOf('$') + 2, getId('bashInput').value.length);
					this.appendHistory(getId('bashInput').value.substring(getId('bashInput').value.indexOf('$') + 2, getId('bashInput').value.length));
					this.echo(cleanStr(getId('bashInput').value));
					getId('bashInput').value = this.prefix;
					this.pastValue = this.prefix;
					var commandObjects = this.getCmdObjects(this.command, 1);
				}
				if (this.command.length !== 0) {
					var pipeGroups = [];
					if (commandObjects.indexOf('|') !== -1) {
						for (var i = 0; commandObjects.indexOf('|', i) !== -1; i = commandObjects.indexOf('|', i) + 1) {
							var pipeGroup = [];
							for (var j = i; j < commandObjects.indexOf('|', i); j++) {
								pipeGroup.push(commandObjects[j]);
							}
							pipeGroups.push(pipeGroup);
						}
						var pipeGroup = [];
						for (var j = commandObjects.lastIndexOf('|') + 1; j < commandObjects.length; j++) {
							pipeGroup.push(commandObjects[j]);
						}
						pipeGroups.push(pipeGroup);
					} else {
						pipeGroups.push(commandObjects);
					}

					let cmdResult = "";
					for (var i = 0; i < pipeGroups.length; i++) {
						var currCmd = pipeGroups[i].shift();
						var cmdID = -1;
						for (var j = 0; j < this.commands.length; j++) {
							if (this.commands[j].name === currCmd) {
								cmdID = j;
								break;
							}
						}

						if (cmdID !== -1) {
							try {
								cmdResult = this.commands[cmdID].action(pipeGroups[i]);
							} catch (err) {
								this.echo(currCmd + ': ' + err);
								break;
							}
							if (cmdResult) {
								if (i !== pipeGroups.length - 1) {
									pipeGroups[i + 1].push(cmdResult);
								}
							}
						} else {
							this.echo(currCmd + ": command not found");
							break;
						}
					}

					if (cmdResult && !cmd) {
						this.echo(cmdResult);
					} else if (cmd) {
						if (silent) {
							if (arguments.callee.caller === window.sh) {
								arguments.callee.caller.caller.__bashworkdir = this.workdir;
							} else {
								arguments.callee.caller.__bashworkdir = this.workdir;
							}
							this.workdir = temporaryBashWorkDir;
						}
						return cmdResult
					}
				}
			},
			currHelpSearch: '',
			cmdHistory: [],
			currHistory: -1,
			seekHistory: function (direction) { // 1 or -1
				var nextHistory = this.currHistory + direction;
				if (nextHistory < 0) {
					this.currHistory = -1;
					return '';
				} else if (nextHistory >= this.cmdHistory.length) {
					if (this.cmdHistory.length > 0) {
						this.currHistory = this.cmdHistory.length - 1;
						return this.cmdHistory[this.cmdHistory.length - 1];
					} else {
						return '';
					}
				} else {
					this.currHistory = nextHistory;
					return this.cmdHistory[nextHistory];
				}
			},
			appendHistory: function (str) {
				this.cmdHistory.unshift(str);
				this.currHistory = -1;
				if (this.cmdHistory.length > 50) {
					this.cmdHistory.pop();
				}
			},
			commands: [{
					name: 'help',
					usage: 'help [command]',
					desc: 'Prints the usage and help doc for a command.',
					action: function (args) {
						apps.bash.vars.currHelpSearch = args.join(" ");
						this.vars.foundCmds = apps.bash.vars.commands.filter(function (i) {
							return apps.bash.vars.currHelpSearch.indexOf(i.name) > -1 || i.name.indexOf(apps.bash.vars.currHelpSearch) > -1;
						});
						var str = "";
						for (let i in this.vars.foundCmds) {
							str += '\n\n' + this.vars.foundCmds[i].name + ': ' + this.vars.foundCmds[i].usage;
							str += '\n' + this.vars.foundCmds[i].desc;
						}
						return str.substring(2, str.length);
					},
					vars: {
						foundCmds: []
					}
				},
				{
					name: 'echo',
					usage: 'echo [message]',
					desc: 'Prints message to console.',
					action: function (args) {
						str = args.join(" ");
						return str;
					}
				},
				{
					name: 'alias',
					usage: 'alias [shorthand]="[definition]"',
					desc: 'Creates a persistent alias for the user. Make sure to use quotes if there are spaces or quotes in your definition!',
					action: function (args) {
						if (args.length > 0) {
							if ((args[0].length > 0 && args[1] === "=") || args[0].length > 1) {
								if (args[0].indexOf('=') === args[0].length - 1) {
									let shifted = args.shift();
									apps.bash.vars.alias[shifted.substring(0, shifted.length - 1)] = args.join(" ");
								} else if (args[1] === "=") {
									let shifted = args.shift();
									args.shift();
									apps.bash.vars.alias[shifted] = args.join(" ");
								} else {
									throw "AliasError: The alias command appears to be malformed. Make sure your alias is only one word and the = is in the correct place.";
								}
							} else {
								throw "AliasError: The alias command appears to be malformed. Make sure your alias is only one word and the = is in the correct place.";
							}

							ufsave('aos_system/apps/bash/alias', JSON.stringify(apps.bash.vars.alias));
						} else {
							let str = "";
							for (let i in apps.bash.vars.alias) {
								str += '\n' + i + " = " + apps.bash.vars.alias[i];
							}
							return str.substring(1, str.length);
						}
					},
					vars: {

					}
				},
				{
					name: 'js',
					usage: 'js [code]',
					desc: 'Run JavaScript code and echo the returned value',
					action: function (args) {
						return eval(args.join(" "));
					}
				},
				{
					name: 'pwd',
					usage: 'pwd [-J]',
					desc: 'Prints the current working directory. If -J is specified, also prints the JavaScript-equivalent directory.',
					action: function (args) {
						if (args.length > 0) {
							if (args[0].toLowerCase() === '-j') {
								return 'shdir: ' + apps.bash.vars.workdir + '\n' +
									'jsdir: ' + apps.bash.vars.translateDir(apps.bash.vars.workdir);
							} else {
								return apps.bash.vars.workdir;
							}
						} else {
							return apps.bash.vars.workdir;
						}
					},
					vars: {}
				},
				{
					name: 'cd',
					usage: 'cd [dirname]',
					desc: 'Move working directory to specified directory.',
					action: function (args) {
						if (args.length > 0) {
							this.vars.prevworkdir = apps.bash.vars.workdir;
							try {
								this.vars.tempadd = args[0].split('/');
								let cleanEscapeRun = 0;
								while (!cleanEscapeRun) {
									cleanEscapeRun = 1;
									for (var i = 0; i < this.vars.tempadd.length - 1; i++) {
										if (this.vars.tempadd[i][this.vars.tempadd[i].length - 1] === '\\') {
											this.vars.tempadd.splice(i, 2, this.vars.tempadd[i].substring(0, this.vars.tempadd[i].length) + '/' + this.vars.tempadd[i + 1]);
											cleanEscapeRun = 0;
											break;
										}
									}
									if (cleanEscapeRun && this.vars.tempadd.length > 0) {
										if (this.vars.tempadd[this.vars.tempadd.length - 1][this.vars.tempadd[this.vars.tempadd.length - 1].length - 1] === '\\') {
											this.vars.tempadd.splice(i, 1, this.vars.tempadd[this.vars.tempadd.length - 1].substring(0, this.vars.tempadd[this.vars.tempadd.length - 1].length) + '/');
											cleanEscapeRun = 0;
										}
									}
								}

								this.vars.tempstart = (apps.bash.vars.workdir[0] === '/');
								if (args[0][0] === '/' || apps.bash.vars.workdir === '/') {
									this.vars.tempdir = [];
									this.vars.tempstart = 1;
								} else {
									this.vars.tempdir = apps.bash.vars.workdir.split('/');
								}

								cleanEscapeRun = 0;
								while (!cleanEscapeRun) {
									cleanEscapeRun = 1;
									for (let i = 0; i < this.vars.tempdir.length - 1; i++) {
										if (this.vars.tempdir[i][this.vars.tempdir[i].length - 1] === '\\') {
											this.vars.tempdir.splice(i, 2, this.vars.tempdir[i].substring(0, this.vars.tempdir[i].length) + '/' + this.vars.tempdir[i + 1]);
											cleanEscapeRun = 0;
											break;
										}
									}
									if (cleanEscapeRun && this.vars.tempdir.length > 0) {
										if (this.vars.tempdir[this.vars.tempdir.length - 1][this.vars.tempdir[this.vars.tempdir.length - 1].length - 1] === '\\') {
											this.vars.tempdir.splice(i, 1, this.vars.tempdir[this.vars.tempdir.length - 1].substring(0, this.vars.tempdir[this.vars.tempdir.length - 1].length) + '/');
											cleanEscapeRun = 0;
										}
									}
								}
								for (let i in this.vars.tempadd) {
									if (this.vars.tempadd[i] === '..') {
										this.vars.tempdir.pop();
									} else {
										this.vars.tempdir.push(this.vars.tempadd[i]);
									}
								}
								if (this.vars.tempdir.length > 0) {
									var lastTempAdd = this.vars.tempdir[this.vars.tempdir.length - 1];
								} else {
									var lastTempAdd = '/';
								}
								this.vars.temppath = this.vars.tempdir.join('/');
								if (this.vars.tempstart && this.vars.temppath[0] !== '/') {
									this.vars.temppath = '/' + this.vars.temppath;
								}
								this.vars.temppath = this.vars.temppath.split('//').join('/');
								apps.bash.vars.workdir = this.vars.temppath;
								if (apps.bash.vars.getRealDir('') === undefined) {
									var badworkdir = apps.bash.vars.workdir;
									apps.bash.vars.workdir = this.vars.prevworkdir;
									throw "" + badworkdir + ': No such file or directory';
								} else if (typeof apps.bash.vars.getRealDir('') !== 'object') {
									var badworkdir = apps.bash.vars.workdir;
									apps.bash.vars.workdir = this.vars.prevworkdir;
									throw "" + badworkdir + ': Not a directory';
								}
								
								if (apps.bash.vars.workdir === '/') {
									apps.bash.vars.prefix = '[' + SRVRKEYWORD.substring(0, 4) + '@aOS /]$ ';
								} else {
									apps.bash.vars.prefix = '[' + SRVRKEYWORD.substring(0, 4) + '@aOS ' + lastTempAdd + ']$ ';
								}

								apps.bash.vars.pastValue = apps.bash.vars.prefix;
								getId('bashInput').value = apps.bash.vars.prefix;
							} catch (err) {
								apps.bash.vars.workdir = this.vars.prevworkdir;
								throw err;
							}
						}
					},
					vars: {
						temppath: '',
						prevworkdir: '',
						tempstart: 0,
						tempadd: [],
						tempdir: []
					}
				},
				{
					name: 'grep',
					usage: 'grep [needle] ',
					desc: 'List lines of a source that contain a target string.',
					action: function (args) {
						this.vars.target = args.shift();
						this.vars.lines = args.join("\n").split('\n');
						this.vars.out = '';
						for (var i in this.vars.lines) {
							if (this.vars.lines[i].toLowerCase().indexOf(this.vars.target.toLowerCase()) > -1) {
								this.vars.out += '\n' + this.vars.lines[i];
							}
						}
						return this.vars.out.substring(1, this.vars.out.length);
					},
					vars: {
						target: '',
						lines: [],
						out: ''
					}
				},
				{
					name: 'ls',
					usage: 'ls [-R] [dirname]',
					desc: 'List files in a directory.\n-R prints subdirectories up to 1 layer deep\nIf no directory is provided, current directory is used.\nWARNING: -R can be dangerous in large directories like /',
					action: function (args) {
						if (args.length > 0) {
							if (args[0] === "-R") {
								try {
									this.vars.selectedDir = apps.bash.vars.getRealDir(args[1]);
								} catch (err) {
									this.vars.selectedDir = apps.bash.vars.getRealDir('');
								}
								this.vars.printSub = 1;
							} else {
								this.vars.selectedDir = apps.bash.vars.getRealDir(args[0]);
								this.vars.printSub = 0;
							}
						} else {
							this.vars.selectedDir = apps.bash.vars.getRealDir('');
							this.vars.printSub = 0;
						}
						
						var dirSize = 0;
						var printBuffer = "";
						if (typeof this.vars.selectedDir) {
							if (typeof this.vars.selectedDir === 'object') {
								for (var item in this.vars.selectedDir) {
									dirSize++;
									if (dirSize > 1) {
										printBuffer += '\n' + item.split('/').join('\\/');
									} else {
										printBuffer += item.split('/').join('\\/');
									}
									if (typeof this.vars.selectedDir[item] === 'object') {
										printBuffer += '/';
										if (this.vars.printSub) {
											for (var subitem in this.vars.selectedDir[item]) {
												printBuffer += '\n' + item.split('/').join('\\/') + '/' + subitem.split('/').join('\\/');
												if (typeof this.vars.selectedDir[item][subitem] === 'object') {
													printBuffer += '/';
												}
											}
										}
									}
								}
							} else {
								throw args.join(' ') + ': Not a directory';
							}
						} else {
							throw 'Cannot access ' + args.join(' ') + ': No such file or directory';
						}
						return printBuffer;
					},
					vars: {
						printSub: 0,
						selectedDir: {}
					}
				},
				{
					name: 'mv',
					usage: 'mv [path] [newpath]',
					desc: 'Moves a file or directory to a new path.',
					action: function (args) {
						if (args.length > 1) {
							this.vars.currSet = [args[0], args[1]];
							eval(apps.bash.vars.translateDir(this.vars.currSet[1]) + '=' + apps.bash.vars.translateDir(this.vars.currSet[0]));
							eval('delete ' + apps.bash.vars.translateDir(currSet[0]));
						} else {
							throw "Missing a file, must specify two";
						}
					},
					vars: {
						currSet: [],
						currItem: {}
					}
				},
				{
					name: 'cp',
					usage: 'cp [path] [newpath]',
					desc: 'Copies a file or directory to a new path.',
					action: function (args) {
						if (args.length > 1) {
							this.vars.currSet = [args[0], args[1]];
							eval(apps.bash.vars.translateDir(this.vars.currSet[1]) + '=' + apps.bash.vars.translateDir(this.vars.currSet[0]));
						} else {
							throw "Missing a file, must specify two";
						}
					},
					vars: {
						currSet: [],
						currItem: {}
					}
				},
				{
					name: 'rm',
					usage: 'rm [file]...',
					desc: 'Deletes files.',
					action: function (args) {
						if (args.length > 0) {
							for (var i in args) {
								if (typeof apps.bash.vars.getRealDir(args[i]) !== 'object') {
									eval('delete ' + apps.bash.vars.translateDir(args[i]));
								} else {
									throw 'Cannot delete ' + args[i] + ': is a directory';
								}
							}
						} else {
							throw 'No files provided';
						}
					}
				},
				{
					name: 'rmdir',
					usage: 'rmdir [directory]',
					desc: 'Deletes a file or directory.',
					action: function (args) {
						if (args.length > 0) {
							for (var i in args) {
								if (typeof apps.bash.vars.getRealDir(args[i]) === 'object') {
									eval('delete ' + apps.bash.vars.translateDir(args[i]));
								} else {
									throw 'Cannot delete ' + args[i] + ': is not a directory';
								}
							}
						} else {
							throw 'No files provided';
						}
					}
				},
				{
					name: 'touch',
					usage: 'touch [file]...',
					desc: 'Creates empty files',
					action: function (args) {
						if (args.length > 0) {
							for (let i in args) {
								if (!apps.bash.vars.getRealDir(args[i])) {
									eval(apps.bash.vars.translateDir(args[i]) + '=""');
								} else {
									throw 'Cannot create ' + args[i] + ': already exists';
								}
							}
						} else {
							throw 'No files provided';
						}
						if (!eval(apps.bash.vars.translateDir(args))) {
							eval(apps.bash.vars.translateDir(args) + '= ""');
						}
					}
				},
				{
					name: 'clear',
					usage: 'clear',
					desc: 'Clears the console screen.',
					action: function (args) {
						getId('bashContent').innerHTML = '';
					}
				},
				{
					name: 'mkdir',
					usage: 'mkdir [directory]...',
					desc: 'Creates blank directories.',
					action: function (args) {
						if (args.length > 0) {
							for (let item in args) {
								this.vars.first = 1;
								this.vars.stack = args[item].split('/');
								for (var i in this.vars.stack) {
									if (this.vars.first) {
										this.vars.trace = this.vars.stack[i];
										this.vars.first = 0;
									} else {
										this.vars.trace += '/' + this.vars.stack[i];
									}
									if (typeof apps.bash.vars.getRealDir(this.vars.trace) !== 'object') {
										if (apps.bash.vars.getRealDir(this.vars.trace) === undefined) {
											eval(apps.bash.vars.translateDir(this.vars.trace) + ' = {}');
										} else {
											//throw 'Failed to create ' + args[item] + ": " + this.vars.trace + ' already exists';
										}
									}
								}
							}
						} else {
							throw 'No names given';
						}
					},
					vars: {
						first: 1,
						trace: '',
						stack: []
					}
				},
				{
					name: 'cat',
					usage: 'cat <file>',
					desc: 'Get the contents of a file, as it appears to JavaScript.',
					action: function (args) {
						if (args.length == 0) throw 'No file provided';
						if (typeof apps.bash.vars.getRealDir(args[0]) !== "undefined") {
							return apps.bash.vars.getRealDir(args[0]);
						} else {
							throw args[0] + ': No such file or directory';
						}
					}
				},
				{
					name: 'fortune',
					usage: 'fortune',
					desc: 'Displays a fortune for you!',
					action: function (args) {
						let rand = Math.floor(Math.random() * this.vars.fortunes.length);
						return this.vars.fortunes[rand];
					},
					vars: {
						fortunes: [
							'Test Fortune 1',
							'Test Fortune 2',
							'Test Fortune 3'
						]
					}
				},
				{
					name: 'exit',
					usage: 'exit',
					desc: 'Exits the bash console.',
					action: function (args) {
						if (apps.bash.appWindow.appIcon) {
							apps.bash.signalHandler('close');
						}
					}
				},
				{
					name: 'repo',
					usage: 'repo {install [repo.]pkg | remove [repo.]pkg | update | upgrade | add-repo repo | remove-repo repo | search [query | repo | repo.query] | list | list-all | list-updates}',
					desc: 'Manage the installed app repositories and packages.\n\n',
					action: function (args) {
						if (args.length > 0) {
							var currentAction = args.shift();
							args = args.join(' ');
							switch (currentAction) {
								case 'install':
									var result = repoAddPackage(args.trim(), apps.bash.vars.echo);
									if (typeof result !== 'boolean') return result;
									break;
								case 'remove':
									var result = repoRemovePackage(args.trim(), apps.bash.vars.echo);
									if (typeof result !== 'boolean') return result;
									break;
								case 'update':
									var result = repoUpdate(apps.bash.vars.echo);
									if (typeof result !== 'boolean') return result;
									break;
								case 'upgrade':
									var result = repoUpgrade(apps.bash.vars.echo);
									if (typeof result !== 'boolean') return result;
									break;
								case 'search':
									var result = repoPackageSearch(args.trim());
									if (typeof result !== 'boolean') this.vars.batchEcho(result);
									break;
								case 'add-repo':
									var result = repoAddRepository(args.trim(), apps.bash.vars.echo);
									if (typeof result !== 'boolean') return result;
									break;
								case 'remove-repo':
									var result = repoRemoveRepository(args.trim(), apps.bash.vars.echo);
									if (typeof result !== 'boolean') return result;
									break;
								case 'list-all':
									var result = repoListAll();
									if (typeof result !== 'boolean') this.vars.batchEcho(result);
									break;
								case 'list':
									var result = repoListInstalled();
									if (typeof result !== 'boolean') this.vars.batchEcho(result);
									break;
								case 'list-updates':
									var result = repoGetUpgradeable();
									if (typeof result !== 'boolean') this.vars.batchEcho(result);
									break;
								default:
									throw currentAction + ' is not a recognized repo command.';
							}
						} else {
							throw 'No arguments provided.';
						}
					},
					vars: {
						batchEcho: function (arr) {
							apps.bash.vars.echo(arr.join('\n'));
						}
					}
				}
			]
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
						this.vars.prefix = '[' + SRVRKEYWORD.substring(0, 4) + '@aOS bash]$ ';
						this.vars.pastValue = '[' + SRVRKEYWORD.substring(0, 4) + '@aOS bash]$ ';

						if (ufload("aos_system/apps/bash/alias")) {
							this.vars.alias = JSON.parse(ufload("aos_system/apps/bash/alias"));
						}
						break;
					case 'shutdown':

						break;
					default:
						doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'");
			}
		}
	});
	window.sh = function (input) {
		return apps.bash.vars.execute(input, 1);
	}
});

c(function() {
	m('init PMT');
	apps.prompt = new Application({
		title: "Application Prompt",
		abbreviation: "PMT",
		codeName: "prompt",
		image: {
			backgroundColor: "#303947",
			foreground: "smarticons/prompt/fg.png",
			backgroundBorder: {
				thickness: 2,
				color: "#252F3A"
			}
		},
		hideApp: 2,
		launchTypes: 1,
		main: function (launchtype) {
			if (launchtype === 'dsktp') {
				if (!this.appWindow.appIcon) {
					this.appWindow.setDims("auto", "auto", 500, 300);
				}
				this.appWindow.setCaption('Modal Dialogue');
				getId("win_prompt_big").style.display = "none";
				getId("win_prompt_exit").style.display = "none";
				this.appWindow.alwaysOnTop(1);
				this.vars.checkNotifs();
			}
		},
		vars: {
			appInfo: 'This is a prompt or alert box used for applications to create simple messages or get simple input from the user.',
			prompts: [],
			currprompt: [],
			totalNotifs: 0,
			notifs: {},
			alert: function (aText, aButton, aCallback, aCaption) {
				if (typeof aText === "object") {
					this.notifs["notif_" + this.totalNotifs] = {
						notifType: "alert",
						notifDate: formDate("D/M/y h:m"),
						caption: aText.caption,
						content: aText.content,
						button: aText.button,
						callback: aText.callback
					}
				} else {
					this.notifs["notif_" + this.totalNotifs] = {
						notifType: "alert",
						notifDate: formDate("D/M/y h:m"),
						caption: aCaption,
						content: aText,
						button: aButton,
						callback: aCallback
					}
				}
				this.totalNotifs++;
				this.checkNotifs();
			},
			confirm: function (cText, cButtons, cCallback, cCaption) {
				if (typeof cText === "object") {
					this.notifs["notif_" + this.totalNotifs] = {
						notifType: "confirm",
						notifDate: formDate("D/M/y h:m"),
						caption: cText.caption,
						content: cText.content,
						buttons: cText.buttons,
						callback: cText.callback
					}
				} else {
					this.notifs["notif_" + this.totalNotifs] = {
						notifType: "confirm",
						notifDate: formDate("D/M/y h:m"),
						caption: cCaption,
						content: cText,
						buttons: cButtons,
						callback: cCallback
					}
				}
				this.totalNotifs++;
				this.checkNotifs();
			},
			prompt: function (pText, pButton, pCallback, pCaption, isPassword) {
				if (typeof pText === "object") {
					this.notifs["notif_" + this.totalNotifs] = {
						notifType: "prompt",
						notifDate: formDate("D/M/y h:m"),
						caption: pText.caption,
						content: pText.content,
						button: pText.button,
						callback: pText.callback,
						isPassword: pText.isPassword
					}
				} else {
					this.notifs["notif_" + this.totalNotifs] = {
						notifType: "prompt",
						notifDate: formDate("D/M/y h:m"),
						caption: pCaption,
						content: pText,
						button: pButton,
						callback: pCallback,
						isPassword: isPassword
					}
				}

				this.totalNotifs++;
				this.checkNotifs();
			},
			notify: function (nText, nButtons, nCallback, nCaption, nImage) {
				if (typeof nText === "object") {
					this.notifs["notif_" + this.totalNotifs] = {
						notifType: "notify",
						notifDate: formDate("D/M/y h:m"),
						caption: nText.caption,
						content: nText.content,
						image: nText.image,
						buttons: nText.buttons,
						callback: nText.callback
					}
				} else {
					this.notifs["notif_" + this.totalNotifs] = {
						notifType: "notify",
						notifDate: formDate("D/M/y h:m"),
						caption: nCaption,
						content: nText,
						image: nImage,
						buttons: nButtons,
						callback: nCallback
					}
				}

				this.totalNotifs++;
				this.checkNotifs();
			},
			lastModalsFound: [],
			lastNotifsFound: [],
			checkNotifs: function() {
				var modalsFound = [];
				var notifsFound = [];
				for (var i in this.notifs) {
					if (this.notifs[i].notifType === "notify") {
						notifsFound.push(i);
					} else if (
						this.notifs[i].notifType === "alert" ||
						this.notifs[i].notifType === "prompt" ||
						this.notifs[i].notifType === "confirm"
					) {
						modalsFound.push(i);
					}
				}
				if (modalsFound.length > 0) {
					apps.prompt.vars.showModals();
					if (modalsFound !== this.lastModalsFound) {
						var modalText = '';
						for (var i of modalsFound) {
							modalText += '<div style="position:relative" data-modal="' + i + '">';
							switch (this.notifs[i].notifType) {
								case 'alert':
									modalText += '<p><b>' + cleanStr(this.notifs[i].caption) + ' has a message:</b></p>' +
										'<p>' + this.notifs[i].content + '</p>' +
										'<button onclick="apps.prompt.vars.modalSubmit(this.parentNode, 0)">' + (this.notifs[i].button || "Okay") + '</button>';
									break;
								case 'confirm':
									modalText += '<p><b>' + cleanStr(this.notifs[i].caption) + ' wants you to choose:</b></p>' +
										'<p>' + this.notifs[i].content + '</p>';
									for (var j in this.notifs[i].buttons) {
										modalText += '<button onclick="apps.prompt.vars.modalSubmit(this.parentNode, ' + j + ')">' + (this.notifs[i].buttons[j] || "Option" + j) + '</button> ';
									}
									break;
								case 'prompt':
									modalText += '<p><b>' + cleanStr(this.notifs[i].caption) + ' wants some info:</b></p>' +
										'<p>' + this.notifs[i].content + '</p>' +
										'<input style="width:60%" class="modalDialogueInput" onkeypress="if(event.keyCode === 13){apps.prompt.vars.modalSubmit(this.parentNode, 0)}"> ' +
										'<button onclick="apps.prompt.vars.modalSubmit(this.parentNode, 0)">' + (this.notifs[i].button || "Sumbit") + '</button>';
									break;
								default:
									// Nothing, this notification is weird
							}
							modalText += '</div>';
							apps.prompt.appWindow.setContent(modalText);
						}
					}
				} else {
					apps.prompt.vars.hideModals();
				}
				/*  this is the html of a notification
						<div id="notifWindow" class="darkResponsive" style="opacity:0;pointer-events:none;right:-350px">
								<div id="notifTitle">Notification</div>
								<div id="notifContent">Content</div>
								<div id="notifButtons"><button>Button 1</button> <button>Button 2</button></div>
								<img id="notifImage" src="appicons/aOS.png">
								<div class="winExit cursorPointer" onClick="getId('notifWindow').style.opacity='0';getId('notifWindow').style.pointerEvents='none';getId('notifWindow').style.right = '-350px';window.setTimeout(function(){apps.prompt.vars.checkPrompts();}, 300);apps.prompt.vars.currprompt[3](-1);">x</div>
						</div>
				*/
				if (notifsFound.length > 0) {
					apps.prompt.vars.showNotifs();
					if (notifsFound !== this.lastNotifsFound) {
						var notifText = "";
						for (var i of notifsFound) {
							notifText += '<div class="notifWindow noselect darkResponsive" data-notif="' + i + '">' +
								'<div class="notifTitle">' + cleanStr(this.notifs[i].caption) + '</div>' +
								'<div class="notifContent canselect">' + cleanStr(this.notifs[i].content).split("&lt;br&gt;").join("<br>") + '</div>' +
								'<div class="notifButtons">';
							for (var j in this.notifs[i].buttons) {
								notifText += '<button onclick="apps.prompt.vars.notifClick(this.parentNode.parentNode, ' + j + ')">' + this.notifs[i].buttons[j] + '</button>';
							}
							notifText += '</div>';
							if (typeof this.notifs[i].image === "string") {
								notifText += '<img class="notifImage" src="' + this.notifs[i].image + '" onerror="this.src=\'\'">';
							} else if (typeof this.notifs[i].image === "object") {
								notifText += buildSmartIcon(50, this.notifs[i].image, "display:block;position:absolute;right:2px;top:calc(50% - 25px);");
							}
							notifText += '<div class="winExit cursorPointer" onclick="apps.prompt.vars.notifClick(this.parentNode, -1)">x</div>' +
								'</div><br>';
						}
						getId("notifications").innerHTML = notifText;
					}
				} else {
					apps.prompt.vars.hideNotifs();
				}
				this.lastModalsFound = modalsFound;
				this.lastNotifsFound = notifsFound;
			},
			modalSubmit: function (modalElem, choice) {
				if (typeof modalElem === "object") {
					if (modalElem.getAttribute("data-modal")) {
						var modalID = modalElem.getAttribute("data-modal");
						var modalType = this.notifs[modalID].notifType;
						switch (modalType) {
							case 'alert':
								this.notifs[modalID].callback();
								break;
							case 'confirm':
								this.notifs[modalID].callback(choice);
								break;
							case 'prompt':
								this.notifs[modalID].callback(modalElem.getElementsByClassName("modalDialogueInput")[0].value);
								break;
							default:
								// Something is odd with this notification
								doLog("Modal " + modalID + " has no type.");
						}
						delete this.notifs[modalID];
						requestAnimationFrame(function() {
							apps.prompt.vars.checkNotifs();
						});
					}
				}
			},
			notifClick: function (notifID, choice) {
				if (typeof notifID === "string") {
					this.notifs[notifID].callback(choice);
					delete this.notifs[notifID];
				} else if (typeof notifID === "number") {
					this.notifs["notif_" + notifID].callback(choice);
					delete this.notifs["notif_" + notifID];
				} else if (typeof notifID === "object") {
					if (notifID.getAttribute("data-notif")) {
						this.notifs[notifID.getAttribute("data-notif")].callback(choice);
						delete this.notifs[notifID.getAttribute("data-notif")];
					} else {
						doLog("Strange notification, doesn't identify itself?");
						doLog(notifID);
					}
				}
				this.checkNotifs();
			},
			showModals: function() {
				if (!apps.prompt.appWindow.appIcon) {
					apps.prompt.appWindow.paddingMode(1);
					apps.prompt.appWindow.setDims("auto", "auto", 600, 400);
					apps.prompt.appWindow.setCaption("Modal Dialogue");
					getId("win_prompt_html").style.overflowY = "auto";
				}
				apps.prompt.appWindow.openWindow();
				requestAnimationFrame(function() {
					getId("win_prompt_html").scrollTop = 0;
				});
			},
			hideModals: function() {
				if (apps.prompt.appWindow.appIcon) {
					apps.prompt.signalHandler("close");
				}
			},
			notifsVisible: 0,
			showNotifs: function() {
				if (!this.notifsVisible) {
					getId("notifContainer").style.opacity = "1";
					getId("notifContainer").style.pointerEvents = "";
					getId("notifContainer").style.right = "16px";
					this.notifsVisible = 1;
				}
			},
			hideNotifs: function() {
				if (this.notifsVisible) {
					getId("notifContainer").style.opacity = "0";
					getId("notifContainer").style.pointerEvents = "none";
					getId("notifContainer").style.right = "-350px";
					this.notifsVisible = 0;
				}
			},
			flashNotification: function (nTimes) {
				this.showNotifs();
				if (nTimes) {
					// If number of flashes defined
					getId('notifContainer').style.opacity = '0.2';
					setTimeout(function() {
						getId('notifContainer').style.opacity = '';
					}, 300);
					for (var i = 1; i < nTimes; i++) {
						setTimeout(function() {
							getId('notifContainer').style.opacity = '0.2';
						}, i * 600);
						setTimeout(function() {
							getId('notifContainer').style.opacity = '';
						}, i * 600 + 300);
					}
				} else {
					// Otherwise just 3 flashes
					apps.prompt.vars.flashNotification(3);
				}
			},
			checkPrompts: function() {
				this.checkNotifs();
			}
		},
		signalHander: function (signal) {
			switch (signal) {
				case "forceclose":
					this.appWindow.closeWindow();
					this.appWindow.closeIcon();
					break;
				case "close":
					this.appWindow.closeWindow();
					window.setTimeout(function() {
						apps.prompt.vars.checkPrompts();
					}, 0);
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
						if (safeMode) {
							apps.prompt.vars.alert('Safe mode is enabled. Most of your settings will be ignored, so that you can fix something you may have recently broken. Your files are still in place.<br><br>To exit safe mode, simply remove the "?safe=true" from the URL.', 'Okay', function() {}, 'AaronOS');
						}
						this.appWindow.alwaysOnTop(1);
						this.appWindow.paddingMode(1);
						break;
					case 'shutdown':

						break;
					default:
						doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'");
			}
		}
	});
	openapp(apps.prompt, 'dsktp');
	requestAnimationFrame(function() {
		apps.prompt.signalHandler('close');
	});
	getId('aOSloadingInfo').innerHTML = 'Settings';
});

/* SETTINGS */
c(function() {
	m('init Settings');
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
			if (launchtype === 'oldMenu' || launchtype === 'oldMenuHide') {
				this.appWindow.setContent(
					'<div style="font-family:monospace;width:100%;height:100%;overflow:auto">' +
					'<i>' + langOld('settings', 'valuesMayBeOutdated') + '</i><hr>' +
					'<b>' + langOld('settings', 'bgImgURL') + '</b><br>' +
					'<i>' + langOld('settings', 'imgTile') + '</i><br>' +
					'<input id="bckGrndImg" style="display:inline-block; width:500px" value="' + ufload("aos_system/desktop/background_image") + '"><button onClick="apps.settings.vars.sB()">Set</button><hr>' +
					'<b>' + langOld('settings', 'performance') + '</b><br>' +
					langOld('settings', 'dbgLevel') + ': <button onclick="apps.settings.vars.setDebugLevel(0)">Vital Only</button> <button onclick="apps.settings.vars.setDebugLevel(1)">Normal</button> <button onclick="apps.settings.vars.setDebugLevel(2)">High</button><br>' +
					'<i>' + langOld('settings', 'dbgExplain') + '</i><br><br>' +
					'Long Tap Opens Context Menu: ' + this.vars.longTap + ' <button onclick="apps.settings.vars.togLongTap()">Toggle</button><br>' +
					'<i>Only for mobile browsers, requires touch on top-level ctxmenu element (right-clicking a window will not give the desktop ctxmenu)</i><br><br>' +
					'<b>' + langOld('settings', 'info') + '</b><br>' +
					'&nbsp;<b>&copy;</b> <i>2015-2021 Aaron Adams</i><br>' +
					'<i>' + langOld('settings', 'cookies') + '</i><br>' +
					'Anonymous data collection: ' + this.vars.collectData + ' <button onclick="apps.settings.vars.collectData = -1 * apps.settings.vars.collectData + 1">Toggle</button><br><br>' +
					'If you have suggestions, please email <a href="mailto:mineandcraft12@gmail.com">mineandcraft12@gmail.com</a>!<br><br>' +
					langOld('settings', 'networkOn') + ': ' + window.navigator.onLine + '<br>' +
					langOld('settings', 'batteryLevel') + ': ' + Math.round(batteryLevel * 100) + '%<br>' +
					'<i>' + langOld('settings', 'batteryDesc') + '</i><br><br>' +
					'OS ID: ' + SRVRKEYWORD + '<br>' +
					'<button onclick="apps.settings.vars.changeKey()">Load a Different aOS</button><br><i>You need the OS ID of the target aOS, and the target aOS must have a set password (and you must enter it correctly).</i><br><br>' +
					'<i>If you experience issues with the OS, such as saved files not being recovered, email me and reference your OS ID and the details of the issue.</i><br><br>' +
					'The old Text-To-Speech service was the creation of <a href="http://codewelt.com/proj/speak">codewelt.com/proj/speak</a> and may take several seconds to work after hitting the button. I take NO credit for the creation of that amazing tool. The new TTS service is built-in to Chrome 33 and later.<hr>' +
					'<b>Screen Resolution</b><br>' +
					'aOS Monitor Resolution: ' + getId("monitor").style.width + ' by ' + getId("monitor").style.height + '<br>' +
					'Your Window Resolution: ' + window.innerWidth + 'px by ' + window.innerHeight + 'px <button onclick="fitWindow()">Fit aOS to Window</button><br>' +
					'Your Screen Resolution: ' + window.outerWidth + 'px by ' + window.outerHeight + 'px <button onclick="fitWindowOuter()">Fit aOS to Screen</button><br>' +
					'Set Custom Resolution:<br><input id="STNscnresX">px by <input id="STNscnresY">px <button onclick="fitWindowRes(getId(\'STNscnresX\').value, getId(\'STNscnresY\').value)">Set aOS Screen Res</button><br>' +
					'<b>Taskbar</b><br>' +
					'<i>Toggle the display of different elements of the taskbar</i><br>' +
					'<button onclick="apps.settings.vars.togTimeComp()">Toggle Compact Time</button> <button onclick="apps.settings.vars.togNetStat()">Toggle Network Status</button> <button onclick="apps.settings.vars.togBatStat()">Toggle Battery Status</button> <button onclick="apps.settings.vars.togBatComp()">Toggle Stylish Battery</button><hr>' +
					'<b>NORAA</b><br>' +
					'NORAA presents graphical help boxes instead of speaking solutions, where available: ' + this.vars.noraHelpTopics + ' <button onclick="apps.settings.vars.togNoraHelpTopics()">Toggle</button><br>' +
					'Speech Input Delay (time in ms that NORAA gives for you to cancel spoken input): <input id="STNnoraDelay" value="' + apps.nora.vars.inputDelay + '"> <button onclick="apps.settings.vars.NORAAsetDelay()">Set</button><br><br>' +
					'<i>If NORAA won\'t speak after you speak to him, try one of these out...</i><br>' +
					'Current Voice: ' + apps.nora.vars.lang + '<br>' +
					apps.settings.vars.getVoicesForNORAA() +
					'</div>'
				);
			} else {
				this.vars.showMenu(apps.settings.vars.menus);
			}
			if (launchtype !== "oldMenuHide") {
				this.appWindow.openWindow();
			}
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
					cookies: 'By using this site you are accepting the small cookie the filesystem relies on and that all files you or your aOS apps generate will be saved on the aOS server for your convenience (and, mostly, for technical reasons).',
					networkOn: 'Network Online',
					batteryLevel: 'Battery Level',
					batteryDesc: 'If the amount above is -100, then your computer either has no battery or the battery could not be found.'
				},
				uv: {
					valuesMayBeOutdated: 'Each instance of a definitive value below this line would happen to have been generated at the exact moment in time at which the app which happens to be called Settings happens to have been opened.',
					bgImgURL: 'The Uniform Resource Locator of the Image to be Applied to the Background of the Desktop',
					imgTile: 'The specified image will tile as many times as necessary to cover the entirety of the screen.',
					performance: 'Functions that may Assist the Performance of the Operating System',
					dbgLevel: 'Level of logging to the Debug Console',
					dbgExplain: 'Determines the level of verbosity that aOS brings when referencing actions and issues. The differing levels given will determine how common messages will appear in the Console app, and the importance they must marked as to appear.',
					info: 'Essential Information About aOS',
					cookies: 'In the act of accessing this web site, you are hereby accepting the small, 21-character browser cookie that aOS relies heavily on for its filesystem. All text files you and your installed aOS apps happen to generate are stored solely on the aOS main server for your convenience (and, mostly, for annoying technical limitations).',
					networkOn: 'Reported status of your browser\'s online network connectivity',
					batteryLevel: 'Approximate level of battery life remaining in your device, as reported by your browser',
					batteryDesc: 'If it just so happens that the numerical value represented above equals -100, then it appears that your browser reports that you have no battery installed on your device, or that your browser is incapable of reporting said amount.'
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
					profont: {
						option: 'ProFont License',
						description: function() {
							return 'ProFont is used across many different UI elements of AaronOS.';
						},
						buttons: function() {
							return 'ProFont is licensed under the <a target="_blank" href="ProFont/MIT_LICENSE.txt">MIT License</a>.';
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
					},
					widgets: {
						option: 'Widgets',
						description: function() {
							return '<ol id="STNwidgets">' + apps.settings.vars.getWidgetList() + '</ol>'
						},
						buttons: function() {
							return apps.settings.vars.getWidgetButtons()
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
							return "Current: " + numtf(apps.settings.vars.screensaverEnabled) + ".<br>" +
								"This is an animation or other screen that appears when you're away from your computer."
						},
						buttons: function() {
							return '<button onclick="apps.settings.vars.togScreensaver()">Toggle</button>'
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
					},
					type: {
						option: "Type of Screensaver",
						description: function() {
							return 'Current: ' + apps.settings.vars.currScreensaver + ".<br>" +
								"This is the type of screensaver that aOS will display."
						},
						buttons: function() {
							return apps.settings.vars.grabScreensavers()
						}
					},
					blocks: {
						option: "Screensaver Blockers",
						description: function() {
							return "If the screensaver is being blocked temporarily, the handles used to do so are displayed below. If you wish, you can click one to delete it, though this may lead to unexpected behavior."
						},
						buttons: function() {
							apps.settings.vars.screensaverBlockNames = [];
							let tempCount = [];
							let tempStr = '';
							for (let i in screensaverBlocks) {
								var tempInd = apps.settings.vars.screensaverBlockNames.indexOf(screensaverBlocks[i]);
								if (tempInd > -1) {
									tempCount[tempInd]++;
								} else {
									apps.settings.vars.screensaverBlockNames.push(screensaverBlocks[i]);
									tempCount.push(1);
								}
							}

							for (let i in tempCount) {
								tempStr += "<button onclick='unblockScreensaver(apps.settings.vars.screensaverBlockNames[" + i + "]);apps.settings.vars.showMenu(apps.settings.vars.menus.screensaver)'>" + apps.settings.vars.screensaverBlockNames[i] + ": " + tempCount[i] + "</button> ";
							}

							return tempStr;
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
				clipboard: {
					folder: 0,
					folderName: 'Clipboard',
					folderPath: 'apps.settings.vars.menus.clipboard',
					image: 'settingIcons/new/clipboard.png',
					size: {
						option: 'Clipboard Slots',
						description: function() {
							return 'Current: <span class="liveElement" data-live-eval="textEditorTools.slots">' + textEditorTools.slots + '</span>.<br>' +
								'Number of slots in your clipboard. An excessively large clipboard may be difficult to manage and can cause context menu scrollbars.'
						},
						buttons: function() {
							return '<input id="STNclipboardSlots"> <button onclick="apps.settings.vars.setClipboardSlots(getId(\'STNclipboardSlots\').value)">Set</button>'
						}
					},
					clear: {
						option: 'Clear Clipboard',
						description: function() {
							return 'Clear the persistent keyboard of aOS. Useful for if you have a cluttered clipboard. If you do not copy anything to the clipboard until you shut down, then the next time you boot aOS, the clipboard will be empty. Think of this as a fallback for if clicking this button was an accident. Just copy something to the clipboard and nothing will disappear. It is also one last chance to use the stuff you have copied before it is cleared.'
						},
						buttons: function() {
							return '<button onclick="ufsave(\'aos_system/clipboard\', \'_cleared_clipboard_\');">Clear</button>'
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
							return 'Current: <span class="liveElement" data-live-eval="numEnDis(apps.settings.vars.noraHelpTopics)">' + numtf(apps.settings.vars.noraHelpTopics) + '</span>.<br>' +
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
				language: {
					folder: 0,
					folderName: 'Language',
					folderPath: 'apps.settings.vars.menus.language',
					image: 'settingIcons/new/language.png',
					currentLanguage: {
						option: 'Current Language',
						description: function() {
							return 'Current: ' + languagepacks[(currentlanguage || 'en')] + '.'
						},
						buttons: function() {
							return 'You must reboot aOS for language changes to take effect.'
						}
					},
					credits: {
						option: 'Translation Credits',
						description: function() {
							return 'I got a lot of help with translating aOS from volunteers. So far, here\'s the people who\'ve helped me out.'
						},
						buttons: function() {
							return 'US English: Me, of course. This is the native language of aOS.<br>Chinese: Noah McDermott (noahmcdaos@gmail.com).'
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
					'<div id="STNmenuDiv" style="font-family:aosProFont, monospace;font-size:12px;width:calc(100% - 3px);height:100%;overflow:auto">' +
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
			setClipboardSlots: function (newSlots, nosave) {
				textEditorTools.slots = newSlots;
				textEditorTools.updateSlots();
				if (!nosave) ufsave('aos_system/clipboard_slots', newSlots);
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
			getWidgetList: function() {
				var nodes = getId('time').childNodes;
				var str = '<li>';
				for (let i = 0; i < nodes.length; i++) {
					str += widgets[nodes[i].getAttribute('data-widget-name')].name + '</li><li>';
				}
				return str + '</li>';
			},
			getWidgetButtons: function() {
				var str = '';
				for (let i in widgets) {
					if (widgets[i].place === -1) {
						str += '<button onclick="addWidget(\'' + widgets[i].codeName + '\');apps.settings.vars.showMenu(apps.settings.vars.menus.taskbar);">Add ' + widgets[i].name + ' Widget</button><br>';
					} else {
						str += '<button onclick="removeWidget(\'' + widgets[i].codeName + '\');apps.settings.vars.showMenu(apps.settings.vars.menus.taskbar);">Remove ' + widgets[i].name + ' Widget</button><br>';
					}
				}
				return str + '';
			},
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
			screensaverEnabled: 1,
			screensaverTime: 300000000,
			currScreensaver: "phosphor",
			// TODO
			screensavers: {
				blast: {
					name: "AaronOS Blast",
					selected: function() {
						apps.prompt.vars.alert("Screensaver applied.<br>Configuration options are coming soon for this screensaver.", "Okay.", function() {}, "AaronOS Blast Screensaver");
					},
					start: function() {
						getId('screensaverLayer').innerHTML = '<iframe src="blast/?noBackground=true&player=false&shipCount=10&zoom=0.5&shipLabels=false&scoreboard=false" style="pointer-events:none;border:none;width:100%;height:100%;display:block;position:absolute;left:0;top:0;"></iframe>';
					},
					end: function() {
						getId('screensaverLayer').innerHTML = '';
					}
				},
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
									getId('screensaverLayer').innerHTML = '<iframe src="https://en.wikipedia.org/wiki/Special:Random" style="pointer-events:none;border:none;width:100%;height:100%;"></iframe><div style="top:10px;right:200px;font-size:108px;color:#557;font-family:aosProFont"><img src="appicons/ds/aOS.png" style="width:128px;height:128px"><i>Screensaver</i></div>';
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
			togScreensaver: function() {
				this.screensaverEnabled = -1 * this.screensaverEnabled + 1;
				ufsave("aos_system/screensaver/enabled", this.screensaverEnabled);
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
				for (var app in apps) {
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
											apps.prompt.vars.notify("In the future, you can go to Settings -&gt; Information to set a password on your account.", ["Okay"], function() {}, 'AaronOS', 'appicons/ds/aOS.png');
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
								if (ufload("aos_system/clipboard_slots")) {
									textEditorTools.slots = parseInt(ufload("aos_system/clipboard_slots"));
									textEditorTools.updateSlots();
								}
								if (ufload("aos_system/clipboard")) {
									if (ufload("aos_system/clipboard") !== '_cleared_clipboard_') {
										textEditorTools.clipboard = JSON.parse(ufload("aos_system/clipboard"));
										if (textEditorTools.clipboard.length < textEditorTools.slots) {
											while (textEditorTools.clipboard.length < textEditorTools.slots) {
												textEditorTools.clipboard.push("");
											}
										}
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
	getId('aOSloadingInfo').innerHTML = 'Smart Icon Settings';
});

/* SMART ICONS */
c(function() {
	apps.smartIconSettings = new Application({
		title: "Smart Icon Settings",
		abbreviation: "SIS",
		codeName: "smartIconSettings",
		image: {
			backgroundColor: "#303947",
			foreground: "smarticons/aOS/fg.png",
			backgroundBorder: {
				thickness: 2,
				color: "#252F3A"
			}
		},
		hideApp: 1,
		launchTypes: 1,
		main: function (launchtype) {
			this.appWindow.setCaption("Smart Icon Settings");
			this.appWindow.setDims("auto", "auto", 800, 600);
			this.appWindow.setContent(
				'<div style="position:relative;width:100%;height:256px;padding-top:10px;padding-bottom:10px;background:#000;box-shadow:0 0 5px #000;text-align:center;">' +
				buildSmartIcon(256, this.vars.aOSicon) + '&nbsp;' + buildSmartIcon(128, this.vars.aOSicon) + '&nbsp;' + buildSmartIcon(64, this.vars.aOSicon) + '&nbsp;' + buildSmartIcon(32, this.vars.aOSicon) +
				'</div>' +
				'<br><br>&nbsp;Border Radius:<br>' +
				'&nbsp;<input id="smartIconSettings_tl" value="' + smartIconOptions.radiusTopLeft + '" size="3" placeholder="100"> ' + '<div style="width:64px;position:relative;display:inline-block"></div> ' +
				'<input id="smartIconSettings_tr" value="' + smartIconOptions.radiusTopRight + '" size="3" placeholder="100">' + '<br>' +
				'&nbsp;<input id="smartIconSettings_bl" value="' + smartIconOptions.radiusBottomLeft + '" size="3" placeholder="100"> ' + buildSmartIcon(64, this.vars.aOSicon, 'margin-top:-1em') + ' ' +
				'<input id="smartIconSettings_br" value="' + smartIconOptions.radiusBottomRight + '" size="3" placeholder="100">' + '<br><br>' +
				'&nbsp;<button onclick="apps.smartIconSettings.vars.saveRadiuses()">Save</button> ' +
				'<button onclick="apps.smartIconSettings.vars.toggleBG()">Toggle Background</button><br><br>' +
				'<input id="smartIconSettings_bgcolor" value="' + smartIconOptions.bgColor + '" placeholder="color"> <button onclick="apps.smartIconSettings.vars.setColor()">Override Background Color</button><br><br>' +
				'Test an image: <input type="file" accept="image/*" onchange="apps.smartIconSettings.vars.changeImage(this)">'
			);
			this.appWindow.paddingMode(0);
			this.appWindow.openWindow();
		},
		vars: {
			appInfo: 'This app is used to configure Smart Icons.',
			testSmartIconOriginal: {
				background: "smarticons/_template/shadowEdges.png",
				backgroundColor: "#FF7F00",
				backgroundBorder: {
					thickness: 1,
					color: "#009900"
				},
				foreground: "smarticons/_template/template_fg.png"
			},
			testSmartIcon: {
				backgroundColor: "#303947",
				foreground: "smarticons/aOS/fg.png",
				backgroundBorder: {
					thickness: 2,
					color: "#252F3A"
				}
			},
			aOSicon: {
				backgroundColor: "#303947",
				foreground: "smarticons/aOS/fg.png",
				backgroundBorder: {
					thickness: 2,
					color: "#252F3A"
				}
			},
			changeImage: function (elem) {
				if (elem.files.length > 0) {
					let tempImageSrc = URL.createObjectURL(elem.files[0]);
					let smartIconsInWindow = getId("win_smartIconSettings_html").getElementsByClassName("smarticon_fg");
					for (let i = 0; i < smartIconsInWindow.length; i++) {
						smartIconsInWindow[i].style.background = "url(" + tempImageSrc + ")";
					}
					smartIconsInWindow = getId("win_smartIconSettings_html").getElementsByClassName("smarticon_nobg");
					for (let i = 0; i < smartIconsInWindow.length; i++) {
						smartIconsInWindow[i].style.background = "url(" + tempImageSrc + ")";
					}
				}
			},
			saveRadiuses: function (radiuses, nosave) {
				if (radiuses) {
					let tempR = radiuses;
					smartIconOptions.radiusTopLeft = tempR[0];
					smartIconOptions.radiusTopRight = tempR[1];
					smartIconOptions.radiusBottomLeft = tempR[2];
					smartIconOptions.radiusBottomRight = tempR[3];
					updateSmartIconStyle();
				} else {
					let tempR = [
						getId("smartIconSettings_tl").value, getId("smartIconSettings_tr").value,
						getId("smartIconSettings_bl").value, getId("smartIconSettings_br").value
					];
					smartIconOptions.radiusTopLeft = tempR[0];
					smartIconOptions.radiusTopRight = tempR[1];
					smartIconOptions.radiusBottomLeft = tempR[2];
					smartIconOptions.radiusBottomRight = tempR[3];
					updateSmartIconStyle();
				}

				if (!nosave) saveSmartIconStyle();
			},
			toggleBG: function (nosave) {
				smartIconOptions.backgroundOpacity = Math.abs(smartIconOptions.backgroundOpacity - 1);
				updateSmartIconStyle();
				if (!nosave) saveSmartIconStyle();
			},
			setColor: function (color, nosave) {
				if (color) {
					smartIconOptions.bgColor = color;
					updateSmartIconStyle();
				} else {
					smartIconOptions.bgColor = getId("smartIconSettings_bgcolor").value;
					updateSmartIconStyle();
				}

				if (!nosave) saveSmartIconStyle();
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
						if (ufload("aos_system/smarticon_settings")) {
							smartIconOptions = JSON.parse(ufload("aos_system/smarticon_settings"));
							updateSmartIconStyle();
						}
						break;
					case 'shutdown':

						break;
					default:
						doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'");
			}
		}
	});
	getId('aOSloadingInfo').innerHTML = 'Desktop Icon Maker';
})

var files;
c(function() {
	m('init NP2');
	apps.notepad2 = new Application({
		title: "Text Editor",
		abbreviation: "TE2",
		codeName: "notepad2",
		image: {
			backgroundColor: "#303947",
			foreground: "smarticons/textEditor/fg.png",
			backgroundBorder: {
				thickness: 2,
				color: "#252F3A"
			}
		},
		hideApp: 0,
		launchTypes: 1,
		main: function (launchType) {
			this.appWindow.paddingMode(0);
			this.vars.launchedAs = launchType;
			if (launchType !== "tskbr") {
				this.appWindow.setCaption("Text Editor");
				if (!this.appWindow.appIcon) {
					this.appWindow.setDims("auto", "auto", 650, 400);
				}
				this.appWindow.setContent(
					'<iframe id="np2Env" src="ace/textEdit.html" data-parent-app="notepad2" onload="apps.notepad2.vars.catchError()" style="width:100%; height:calc(100% - 17px); position:absolute; border:none; bottom:0px;"></iframe>' +
					'<div class="darkResponsive" style="width:100%; border-bottom:1px solid; height:16px;">' +
					'<input class="darkResponsive" id="np2Load" placeholder="file name" style="padding-left:3px; font-family: aosProFont, monospace; font-size:12px; left: 16px; border:none; height:16px; border-left:1px solid; border-right:1px solid; position:absolute; top:0; width:calc(100% - 115px);"></input>' +
					'<div id="np2Mode" onclick="apps.notepad2.vars.toggleFileMode()" class="cursorPointer noselect" style="color:#7F7F7F; font-family:aosProFont, monospace; font-size:12px; height:16px;line-height:16px; padding-right:3px; padding-left: 3px; right:95px">Text Mode</div>' +
					'<div class="darkResponsive" onclick="apps.notepad2.vars.openFile(getId(\'np2Load\').value)" class="cursorPointer noselect" style="font-family:aosProFont, monospace; font-size:12px; height:16px; line-height:16px; top:0; right:55px; text-align:center;width:38px; border-left:1px solid; border-right:1px solid;">Load</div> ' +
					'<div class="darkResponsive" onclick="apps.notepad2.vars.saveFile(getId(\'np2Load\').value)" class="cursorPointer noselect" style="font-family:aosProFont, monospace; font-size:12px; height:16px; line-height:16px; top:0; right:16px; text-align:center;width:38px; border-left:1px solid; border-right:1px solid;">Save</div> ' +
					'</div>'
				);
				this.vars.filemode = "string";
			}
			this.appWindow.openWindow();
		},
		vars: {
			appInfo: 'Simple text editor for AaronOS. Edits text files created by the user, and views strings, numbers, and functions of AaronOS apps.',
			openEditTools: function() {
				apps.prompt.vars.notify('This button is unfinished. Right-click the document instead.', [], function() {}, 'Text Editor', 'appicons/ds/TE.png')
			},
			launchedAs: '',
			filemode: 'string',
			catchContent: null,
			catchError: function() {
				if (this.catchContent) {
					getId('np2Env').contentWindow.editor.session.setValue(this.catchContent);
					getId('np2Env').contentWindow.editor.scrollToLine(0);
					if (this.fileModeAdvFeatures[this.allFileModes.indexOf(this.filemode)]) {
						getId('np2Env').contentWindow.editor.session.setMode("ace/mode/javascript");
						getId('np2Env').contentWindow.editor.setOptions({
							enableBasicAutocompletion: true,
							enableLiveAutocompletion: true
						});
					} else {
						getId('np2Env').contentWindow.editor.session.setMode("ace/mode/plain_text");
						getId('np2Env').contentWindow.editor.setOptions({
							enableBasicAutocompletion: false,
							enableLiveAutocompletion: false
						});
					}
					this.catchContent = null;
				}
			},
			allFileModes: [
				'string',
				'function',
				'number',
				'boolean',
				'object',
				'any'
			],
			fileModeNames: [
				'Text Mode',
				'(function) Eval Mode',
				'(number) Eval Mode',
				'(boolean) Eval Mode',
				'(object) Eval Mode',
				'(any) Eval Mode'
			],
			// the following file types have syntax highlight and code completion enabled
			fileModeAdvFeatures: [
				0, // str
				1, // func
				1, // num
				1, // bool
				1, // obj
				1 // any
			],
			toggleFileMode: function() {
				let newFileMode = this.allFileModes.indexOf(this.filemode) + 1;
				if (newFileMode >= this.allFileModes.length) {
					newFileMode = 0;
				}

				this.filemode = this.allFileModes[newFileMode];
				getId('np2Mode').innerHTML = this.fileModeNames[newFileMode];

				if (this.fileModeAdvFeatures[newFileMode]) {
					getId('np2Env').contentWindow.editor.session.setMode("ace/mode/javascript");
					getId('np2Env').contentWindow.editor.setOptions({
						enableBasicAutocompletion: true,
						enableLiveAutocompletion: true
					});
				} else {
					getId('np2Env').contentWindow.editor.session.setMode("ace/mode/plain_text");
					getId('np2Env').contentWindow.editor.setOptions({
						enableBasicAutocompletion: false,
						enableLiveAutocompletion: false
					});
				}
			},
			openFile: function (filename) {
				if (!apps.notepad2.appWindow.appIcon) {
					openapp(apps.notepad2, "dsktp");
				} else {
					openapp(apps.notepad2, 'tskbr');
				}

				if (filename.indexOf('/USERFILES/') !== 0 && filename.indexOf('/LOCALFILES/') !== 0) {
					if (filename.indexOf('/window/') !== 0) {
						if (filename[0] === '/') {
							filename = '/USERFILES' + filename;
						} else {
							filename = '/USERFILES/' + filename;
						}
					}
				}

				try {
					var filecontent = apps.bash.vars.getRealDir(filename);
				} catch (err) {
					apps.prompt.vars.alert("Failed to open " + filename + ": " + err, "Okay", function() {}, "Text Editor");
					return;
				}
				if (typeof filecontent === "object") {
					apps.prompt.vars.alert("Failed to open " + filename + ": the item is a folder or null.", "Okay", function() {}, "Text Editor");
					return;
				}
				if (typeof getId('np2Env').contentWindow.editor === "undefined") {
					requestAnimationFrame(function() {
						toTop(apps.notepad2);
					});
					getId('np2Load').value = filename;
					this.catchContent = String(filecontent);
					if (typeof filecontent === "function") {
						this.filemode = 'function';
						getId('np2Mode').innerHTML = "(function) Eval Mode";
					} else if (typeof filecontent === "string") {
						this.filemode = 'string';
						getId('np2Mode').innerHTML = "Text Mode";
					} else if (typeof filecontent === "number") {
						this.filemode = 'number';
						getId('np2Mode').innerHTML = "(number) Eval Mode";
					} else if (typeof filecontent === "boolean") {
						this.filemode = 'boolean';
						getId('np2Mode').innerHTML = "(boolean) Eval Mode";
					} else if (typeof filecontent === "object") {
						this.filemode = 'object';
						getId('np2Mode').innerHTML = "(object) Eval Mode";
					} else {
						this.filemode = 'any';
						getId('np2Mode').innerHTML = "(any) Eval Mode";
					}
				} else if (getId('np2Env').contentWindow.editor.getValue() !== "") {
					apps.prompt.vars.confirm("You will lose all unsaved work. Continue?", ['No', 'Yes'], function (btn) {
						if (btn) {
							requestAnimationFrame(function() {
								toTop(apps.notepad2);
							});
							getId('np2Load').value = filename;
							try {
								getId('np2Env').contentWindow.editor.session.setValue(String(filecontent));
								getId('np2Env').contentWindow.editor.scrollToLine(0);
							} catch (err) {
								this.catchContent = String(filecontent);
							}
							if (typeof filecontent === "function") {
								this.filemode = 'function';
								getId('np2Mode').innerHTML = "(function) Eval Mode";
							} else if (typeof filecontent === "string") {
								this.filemode = 'string';
								getId('np2Mode').innerHTML = "Text Mode";
							} else if (typeof filecontent === "number") {
								this.filemode = 'number';
								getId('np2Mode').innerHTML = "(number) Eval Mode";
							} else if (typeof filecontent === "boolean") {
								this.filemode = 'boolean';
								getId('np2Mode').innerHTML = "(boolean) Eval Mode";
							} else if (typeof filecontent === "object") {
								this.filemode = 'object';
								getId('np2Mode').innerHTML = "(object) Eval Mode";
							} else {
								this.filemode = 'any';
								getId('np2Mode').innerHTML = "(any) Eval Mode";
							}
							try {
								if (this.fileModeAdvFeatures[this.allFileModes.indexOf(this.filemode)]) {
									getId('np2Env').contentWindow.editor.session.setMode("ace/mode/javascript");
									getId('np2Env').contentWindow.editor.setOptions({
										enableBasicAutocompletion: true,
										enableLiveAutocompletion: true
									});
								} else {
									getId('np2Env').contentWindow.editor.session.setMode("ace/mode/plain_text");
									getId('np2Env').contentWindow.editor.setOptions({
										enableBasicAutocompletion: false,
										enableLiveAutocompletion: false
									});
								}
							} catch (err) {}
						}
					}.bind(this), 'Text Editor');
				} else {
					requestAnimationFrame(function() {
						toTop(apps.notepad2);
					});
					getId('np2Load').value = filename;
					try {
						getId('np2Env').contentWindow.editor.session.setValue(String(filecontent));
						getId('np2Env').contentWindow.editor.scrollToLine(0);
					} catch (err) {
						this.catchContent = String(filecontent);
					}
					if (typeof filecontent === "function") {
						this.filemode = 'function';
						getId('np2Mode').innerHTML = "(function) Eval Mode";
					} else if (typeof filecontent === "string") {
						this.filemode = 'string';
						getId('np2Mode').innerHTML = "Text Mode";
					} else if (typeof filecontent === "number") {
						this.filemode = 'number';
						getId('np2Mode').innerHTML = "(number) Eval Mode";
					} else if (typeof filecontent === "boolean") {
						this.filemode = 'boolean';
						getId('np2Mode').innerHTML = "(boolean) Eval Mode";
					} else if (typeof filecontent === "object") {
						this.filemode = 'object';
						getId('np2Mode').innerHTML = "(object) Eval Mode";
					} else {
						this.filemode = 'any';
						getId('np2Mode').innerHTML = "(any) Eval Mode";
					}
					try {
						if (this.fileModeAdvFeatures[this.allFileModes.indexOf(this.filemode)]) {
							getId('np2Env').contentWindow.editor.session.setMode("ace/mode/javascript");
							getId('np2Env').contentWindow.editor.setOptions({
								enableBasicAutocompletion: true,
								enableLiveAutocompletion: true
							});
						} else {
							getId('np2Env').contentWindow.editor.session.setMode("ace/mode/plain_text");
							getId('np2Env').contentWindow.editor.setOptions({
								enableBasicAutocompletion: false,
								enableLiveAutocompletion: false
							});
						}
					} catch (err) {

					}
				}
			},
			saveFile: function (filename) {
				doLog(1);
				if (filename.length === 0) {
					apps.prompt.vars.alert("Failed to save: No filename provided.", "Okay", function() {}, "Text Editor");
					return;
				}

				if (filename.indexOf('/USERFILES/') !== 0 && filename.indexOf("/LOCALFILES/") !== 0) {
					if (filename.indexOf('/window/') !== 0) {
						if (filename[0] === '/') {
							filename = '/USERFILES' + filename;
						} else {
							filename = '/USERFILES/' + filename;
						}
					}
				}

				getId('np2Load').value = filename;
				if (filename.indexOf('/USERFILES/') === 0) {
					var shortfilename = filename.substring(11, filename.length);
					if (shortfilename.length === 0) {
						apps.prompt.vars.alert("Failed to save: No filename provided.", "Okay", function() {}, "Text Editor");
						return;
					}
					apps.savemaster.vars.save(shortfilename, getId("np2Env").contentWindow.editor.getValue(), 1);
				} else if (filename.indexOf('/LOCALFILES/') === 0) {
					var shortfilename = filename.substring(12, filename.length);
					if (shortfilename.length === 0) {
						apps.prompt.vars.alert("Failed to save: No filename provided.", "Okay", function() {}, "Text Editor");
						return;
					}
					lfsave(shortfilename, getId("np2Env").contentWindow.editor.getValue());
				} else {
					try {
						var oldfilecontent = apps.bash.vars.getRealDir(filename);
					} catch (err) {
						apps.prompt.vars.alert("Failed to save " + filename + ":<br>" + err, "Okay", function() {}, "Text Editor")
						return;
					}
					if (this.filemode === "string") {
						if (typeof oldfilecontent !== "string" && typeof oldfilecontent !== "undefined") {
							apps.prompt.vars.alert("Failed to save " + filename + ":<br>Already exists and is of type " + (typeof oldfilecontent) + " (expected string).", "Okay", function() {}, "Text Editor");
							return;
						}
						eval(apps.bash.vars.translateDir(filename) + ' = getId("np2Env").contentWindow.editor.getValue()');
					} else if (this.filemode === "number") {
						if (typeof oldfilecontent !== "number" && typeof oldfilecontent !== "undefined") {
							apps.prompt.vars.alert("Failed to save " + filename + ":<br>Already exists and is of type " + (typeof oldfilecontent) + " (expected number).", "Okay", function() {}, "Text Editor");
							return;
						}
						try {
							var newfilecontent = eval(getId("np2Env").contentWindow.editor.getValue());
						} catch (err) {
							apps.prompt.vars.alert("Failed to save " + filename + ":<br>Input error: " + err, "Okay", function() {}, "Text Editor");
							return;
						}
						if (typeof newfilecontent !== "number") {
							apps.prompt.vars.alert("Failed to save " + filename + ":<br>Input is of type " + (typeof newfilecontent) + "; expected number.", "Okay", function() {}, "Text Editor");
							return;
						}
						eval(apps.bash.vars.translateDir(filename) + '=' + newfilecontent + "");
					} else if (this.filemode === "boolean") {
						if (typeof oldfilecontent !== "boolean" && typeof oldfilecontent !== "undefined") {
							apps.prompt.vars.alert("Failed to save " + filename + ":<br>Already exists and is of type " + (typeof oldfilecontent) + " (expected boolean).", "Okay", function() {}, "Text Editor");
							return;
						}
						try {
							var newfilecontent = eval(getId("np2Env").contentWindow.editor.getValue());
						} catch (err) {
							apps.prompt.vars.alert("Failed to save " + filename + ":<br>Input error: " + err, "Okay", function() {}, "Text Editor");
							return;
						}
						if (typeof newfilecontent !== "boolean") {
							apps.prompt.vars.alert("Failed to save " + filename + ":<br>Input is of type " + (typeof newfilecontent) + "; expected boolean.", "Okay", function() {}, "Text Editor");
							return;
						}
						eval(apps.bash.vars.translateDir(filename) + '=' + newfilecontent + "");
					} else if (this.filemode === "object") {
						if (typeof oldfilecontent !== "object" && typeof oldfilecontent !== "undefined") {
							apps.prompt.vars.alert("Failed to save " + filename + ":<br>Already exists and is of type " + (typeof oldfilecontent) + " (expected object).", "Okay", function() {}, "Text Editor");
							return;
						}
						try {
							var newfilecontent = eval(getId("np2Env").contentWindow.editor.getValue());
						} catch (err) {
							apps.prompt.vars.alert("Failed to save " + filename + ":<br>Input error: " + err, "Okay", function() {}, "Text Editor");
							return;
						}
						if (typeof newfilecontent !== "object") {
							apps.prompt.vars.alert("Failed to save " + filename + ":<br>Input is of type " + (typeof newfilecontent) + "; expected object.", "Okay", function() {}, "Text Editor");
							return;
						}
						eval(apps.bash.vars.translateDir(filename) + '=' + newfilecontent + "");
					} else if (this.filemode === "any") {
						try {
							var newfilecontent = eval(getId("np2Env").contentWindow.editor.getValue());
						} catch (err) {
							apps.prompt.vars.alert("Failed to save " + filename + ":<br>Input error: " + err, "Okay", function() {}, "Text Editor");
							return;
						}
						eval(apps.bash.vars.translateDir(filename) + '=' + newfilecontent + "");
					} else if (this.filemode === "function") {
						if (typeof oldfilecontent !== "function" && typeof oldfilecontent !== "undefined") {
							apps.prompt.vars.alert("Failed to save " + filename + ":<br>Already exists and is of type " + (typeof oldfilecontent) + " (expected function).", "Okay", function() {}, "Text Editor");
							return;
						}
						try {
							var newfilecontent = eval("(" + getId("np2Env").contentWindow.editor.getValue() + ")");
						} catch (err) {
							apps.prompt.vars.alert("Failed to save " + filename + ":<br>Input error: " + err, "Okay", function() {}, "Text Editor");
							return;
						}
						if (typeof newfilecontent !== "function") {
							apps.prompt.vars.alert("Failed to save " + filename + ":<br>Input is of type " + (typeof newfilecontent) + "; expected function.", "Okay", function() {}, "Text Editor");
							return;
						}
						eval(apps.bash.vars.translateDir(filename) + '=' + newfilecontent + "");
					}
				}
			}
		}
	});
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
	apps.properties = new Application({
		title: "Properties Viewer",
		abbreviation: "PPT",
		codeName: "properties",
		image: "appicons/ds/PPT.png",
		hideApp: 2,
		launchTypes: 1,
		main: function (launchtype, fileToOpen) {
			getId('win_properties_html').style.overflow = 'auto';
			if (!this.appWindow.appIcon) {
				this.appWindow.setDims("auto", "auto", 400, 500, 1);
			}
			this.appWindow.setCaption('Properties Viewer');
			if (launchtype !== 'openFile' && launchtype !== 'tskbr') {
				this.appWindow.setContent('This app is intended for use with the Files app. Please right-click a file in that app, and select "Properties".');
			} else if (launchtype !== 'tskbr') {
				var filePath = fileToOpen.split('/');
				if (filePath[filePath.length - 1] === '') {
					filePath.pop();
				}
				if (filePath[0] === '') {
					filePath.shift();
				}

				var fileName = filePath[filePath.length - 1];
				this.appWindow.setCaption(fileName + " Properties");

				var fileDescription = "";
				if (filePath[0] === "USERFILES") {

				} else if (filePath[0] === "apps" && filePath.length > 1) {
					fileDescription = "This item belongs to the app " + apps[filePath[1]].appDesc + ".";
				}

				this.appWindow.setContent(
					'<div style="font-family:aosProFont, monospace;font-size:12px; width:calc(100% - 3px); overflow:visible">' +
					'<span style="font-size:36px;">' + fileName + '</span><br>' +
					'<span style="font-size:24px;">' + apps.files2.vars.filetype(typeof apps.bash.vars.getRealDir(fileToOpen)) + ' / ' + (typeof apps.bash.vars.getRealDir(fileToOpen)) + '</span><br><br><br>' +
					fileDescription + "<br><br>" +
					'File Location: ' + fileToOpen + '<br><br>&nbsp;- ' + filePath.join('<br>&nbsp;- ') + '<br><br>' +
					'</div>'
				);
			}
			this.appWindow.openWindow();
		},
		vars: {
			appInfo: 'This app is used to view file properties in the File Manager.'
		}
	});
	getId('aOSloadingInfo').innerHTML = 'File Manager';
});
c(function() {
	m('init FIL');
	apps.files2 = new Application({
		title: "File Manager",
		abbreviation: "FIL",
		codeName: "files2",
		image: {
			backgroundColor: "#303947",
			foreground: "smarticons/files/fg.png",
			backgroundBorder: {
				thickness: 2,
				color: "#252F3A"
			}
		},
		hideApp: 0,
		launchTypes: 1,
		main: function (launchType) {
			if (!this.appWindow.appIcon) {
				this.appWindow.paddingMode(0);
				this.appWindow.setDims("auto", "auto", 796, 400, 1);
			}
			this.appWindow.setCaption("File Manager");
			this.appWindow.openWindow();
			if (launchType === 'dsktp') {
				this.vars.currLoc = '/';
				getId('win_files2_html').style.background = "none";
				this.appWindow.setContent(
					'<div id="FIL2topdiv" class="noselect" style="width:calc(100% - 96px); min-width:calc(70% + 48px); right:0; height:50px;">' +
					'<div title="Back" class="cursorPointer darkResponsive" style="width:34px; height:18px; padding-top:2px; left:5px; top:4px; border-top-left-radius:10px; border-bottom-left-radius:10px; text-align:center;" onClick="apps.files2.vars.back()">&lArr; &nbsp;</div>' +
					'<div title="Home" class="cursorPointer darkResponsive" style="width:24px; border-left:1px solid #333; height:18px; padding-top:2px; left:30px; top:4px; border-top-left-radius:10px; border-bottom-left-radius:10px; text-align:center;" onClick="apps.files2.vars.home()">H</div>' +
					'<div title="Refresh" class="cursorPointer darkResponsive" style="width:34px; height:18px; padding-top:2px; right:6px; top:4px; border-top-right-radius:10px; border-bottom-right-radius:10px; text-align:center;" onClick="apps.files2.vars.update()">&nbsp; &#x21BB;</div>' +
					'<div title="View Mode" class="cursorPointer darkResponsive" style="width:24px; border-right:1px solid #333; height:18px; padding-top:2px; right:31px; top:4px; border-top-right-radius:10px; border-bottom-right-radius:10px; text-align:center;" onClick="apps.files2.vars.setViewMode()">&#8801;</div>' +
					'<div id="FIL2path" class="darkResponsive" style="left:55px; font-family:monospace; height:25px; line-height:25px; vertical-align:middle; width:calc(100% - 110px); border-top-left-radius:5px; border-top-right-radius:5px;"><div id="FIL2green" style="width:0;height:100%;"></div><div style="width:100%;height:25px;"><input id="FIL2input" style="background:transparent;box-shadow:none;color:inherit;font-family:monospace;border:none;width:calc(100% - 8px);height:25px;padding:0;padding-left:8px;border-top-left-radius:5px;border-top-right-radius:5px;" onkeypress="if(event.keyCode===13){apps.files2.vars.navigate(this.value)}" value="/"></div></div>' +
					'<div id="FIL2viewModeIcon" style="pointer-events:none; color:#7F7F7F; text-align:right; left:55px; font-family:monospace; height:25px; line-height:25px; vertical-align:middle; width:calc(100% - 110px);"></div>' +
					'<div id="FIL2search" class="darkResponsive" style="left:55px; top:26px; font-family:monospace; height:24px; line-height:24px; vertical-align:middle; width:calc(100% - 110px);"><input id="FIL2searchInput" placeholder="Search" style="background:transparent;box-shadow:none;color:inherit;font-family:monospace;border:none;width:calc(100% - 8px);height:20px;padding:0;padding-left:8px;" onkeyup="apps.files2.vars.updateSearch(this.value)"></div>' +
					'<div class="cursorPointer darkResponsive" style="width:34px; height:18px; padding-top:2px; left:5px; top:27px; border-top-left-radius:10px; border-bottom-left-radius:10px; text-align:center; display:none" onClick=""></div>' +
					'<div title="Toggle Favorite" class="cursorPointer darkResponsive" style="width:24px; border-left:1px solid #333; height:18px; padding-top:2px; left:30px; top:27px; border-top-left-radius:10px; border-bottom-left-radius:10px; text-align:center;" onClick="apps.files2.vars.toggleFavorite(apps.files2.vars.currLoc)"><img class="darkInvert" style="position:absolute;display:block;left:8px;top:5px;" src="ctxMenu/beta/happy.png"></div>' +
					'<div title="New Folder" class="cursorPointer darkResponsive" style="width:34px; height:18px; padding-top:2px; right:6px; top:27px; border-top-right-radius:10px; border-bottom-right-radius:10px; text-align:center;" onClick="apps.files2.vars.mkdir()"><img class="darkInvert" style="position:absolute;display:block;left:16px;top:5px;" src="files2/small/folder.png"></div>' +
					'<div title="New File" class="cursorPointer darkResponsive" style="width:24px; border-right:1px solid #333; height:18px; padding-top:2px; right:31px; top:27px; border-top-right-radius:10px; border-bottom-right-radius:10px; text-align:center;" onClick="apps.files2.vars.mkfile()"><img class="darkInvert" style="position:absolute;display:block;left:8px;top:5px;" src="ctxMenu/beta/new.png"></div>' +
					'</div>' +
					'<div id="FIL2sidebar" class="darkResponsive" style="overflow-y:scroll; border-top-left-radius:5px; font-family:aosProFont, Courier, monospace; font-size:12px; width:144px; max-width:30%; padding:3px; height:calc(100% - 56px); top:50px;">' +
					'Home<br><div id="FIL2home" class="FIL2sidetbl FIL2viewMedium"></div><br>' +
					'Favorites<br><div id="FIL2favorites" class="FIL2sidetbl FIL2viewMedium"></div><br>' +
					'Navigation<br><div id="FIL2nav" class="FIL2sidetbl FIL2viewMedium"></div></div>' +
					'<div class="darkResponsive" style="width:calc(100% - 151px); border-top-right-radius:5px; min-width:calc(70% - 7px); right:0; height:calc(100% - 50px); top:50px; background-repeat:no-repeat; background-position:center" id="FIL2cntn"></div>'
				);
				getId("FIL2home").innerHTML =
					'<div class="cursorPointer" onClick="apps.files2.vars.currLoc = \'/\';apps.files2.vars.next(\'apps/\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'/apps/\\\');toTop(apps.properties)\'])">' +
					'<img src="files2/small/folder.png"> ' +
					'/apps/' +
					'</div><div class="cursorPointer" onClick="apps.files2.vars.currLoc = \'/\';apps.files2.vars.next(\'widgets/\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'/widgets/\\\');toTop(apps.properties)\'])">' +
					'<img src="files2/small/folder.png"> ' +
					'/widgets/' +
					'</div><div class="cursorPointer" onClick="apps.files2.vars.currLoc = \'/\';apps.files2.vars.next(\'USERFILES/\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'/USERFILES/\\\');toTop(apps.properties)\'])">' +
					'<img src="files2/small/folder.png"> ' +
					'/USERFILES/' +
					'</div><div class="cursorPointer" onClick="apps.files2.vars.currLoc = \'/\';apps.files2.vars.next(\'LOCALFILES/\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'/LOCALFILES/\\\');toTop(apps.properties)\'])">' +
					'<img src="files2/small/folder.png"> ' +
					'/LOCALFILES/' +
					function() {
						if (apps.settings.vars.FILcanWin) {
							return '</div><div class="cursorPointer" onClick="apps.files2.vars.next(\'window/\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'/window/\\\');toTop(apps.properties)\'])">' +
								'<img src="files2/small/folder.png"> ' +
								'<span style="color:#F00">window/</span>';
						} else {
							return '';
						}
					}() +
					'</div>';
				this.vars.updateFavorites(1);
				this.vars.setViewMode(this.vars.currViewMode, 1);
			}
		},
		vars: {
			appInfo: 'The official AaronOS File Manager, version 2. Use it to manage your personal files and to view aOS code. At the moment, only plain-text userfiles are supported.',
			currLoc: '/',
			viewModes: [
				['Small Grid', 'FIL2viewCompact'],
				['Large Grid', 'FIL2viewSmall'],
				['Small List', 'FIL2viewMedium'],
				['Large List', 'FIL2viewLarge']
			],
			currViewMode: 3,
			setViewMode: function(newMode, nosave) {
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

				if (!nosave) {
					apps.savemaster.vars.save("aos_system/apps/files/view_mode", this.currViewMode, 1);
				}
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
			mkdir: function() {
				if (this.currLoc === '/') {
					apps.prompt.vars.alert('Please navigate to a directory to create a new folder.', 'Okay', function() {}, 'File Manager');
				} else if (this.currLoc.indexOf('/USERFILES/') === 0) {
					apps.prompt.vars.prompt('Enter a name for the new folder.<br><br>Folder will be created in ' + this.currLoc + '<br><br>Leave blank to cancel.', 'Submit', function (str) {
						if (str) {
							apps.savemaster.vars.mkdir(this.currLoc.substring(11, this.currLoc.length) + str);
						}
						this.update();
					}.bind(this), "File Manager");
				} else if (this.currLoc.indexOf('/LOCALFILES/') === 0) {
					apps.prompt.vars.prompt('Enter a name for the new folder.<br><br>Folder will be created in ' + this.currLoc + '<br><br>Leave blank to cancel.', 'Submit', function (str) {
						if (str) {
							lfmkdir(this.currLoc.substring(12, this.currLoc.length) + str);
						}
						this.update();
					}.bind(this), "File Manager");
				} else if (this.currLoc !== '/apps/') {
					apps.prompt.vars.prompt('Enter a name for the new folder.<br><br>Folder will be created in ' + this.currLoc + '<br><br>Leave blank to cancel.', 'Submit', function (str) {
						if (str) {
							sh('mkdir ' + this.currLoc + str);
						}
						this.update();
					}.bind(this), "File Manager");
				} else {
					apps.prompt.vars.alert('Please navigate to a directory to create a new folder.', 'Okay', function() {}, 'File Manager');
				}
			},
			mkfile: function() {
				if (this.currLoc === '/') {
					apps.prompt.vars.alert('Please navigate to a directory to create a new file.', 'Okay', function() {}, 'File Manager');
				} else if (this.currLoc.indexOf('/USERFILES/') === 0) {
					apps.prompt.vars.prompt('Enter a name for the new file.<br><br>File will be created in ' + this.currLoc + '<br><br>Leave blank to cancel.', 'Submit', function (str) {
						if (str) {
							ufsave(this.currLoc.substring(11, this.currLoc.length) + str, '');
						}
						this.update();
					}.bind(this), "File Manager");
				} else if (this.currLoc.indexOf('/LOCALFILES/') === 0) {
					apps.prompt.vars.prompt('Enter a name for the new file.<br><br>File will be created in ' + this.currLoc + '<br><br>Leave blank to cancel.', 'Submit', function (str) {
						if (str) {
							lfsave(this.currLoc.substring(12, this.currLoc.length) + str, '');
						}
						this.update();
					}.bind(this), "File Manager");
				} else if (this.currLoc !== '/apps/') {
					apps.prompt.vars.prompt('Enter a name for the new file.<br><br>File will be created in ' + this.currLoc + '<br><br>Leave blank to cancel.', 'Submit', function (str) {
						if (str) {
							eval(apps.bash.vars.translateDir(this.currLoc + str) + '=""');
						}
						this.update();
					}.bind(this), "File Manager");
				} else {
					apps.prompt.vars.alert('Please navigate to a directory to create a new file.', 'Okay', function() {}, 'File Manager');
				}

			},
			deleteItem: function (itemPath) {
				apps.prompt.vars.confirm("Are you sure you want to delete this item?<br><br>" + itemPath + "<br><br>WARNING: Deleting important files can cause major issues!", ["No, keep", "Yes, delete"], (btn) => {
					if (btn === 1) {
						if (typeof apps.bash.vars.getRealDir === "object") {
							sh("rmdir " + itemPath);
						} else {
							sh("rm " + itemPath);
						}
						apps.files2.vars.update();
					}
				}, 'File Manager');
			},
			deleteItemUF: function (itemPath) {
				apps.prompt.vars.confirm("Are you sure you want to delete this item?<br><br>" + itemPath + "<br><br>WARNING: This cannot be undone!", ["No, keep", "Yes, delete"], (btn) => {
					if (btn === 1) {
						itemPath = itemPath.split('/');
						if (itemPath[0] === "") {
							itemPath.shift();
						}
						if (itemPath[0] === "USERFILES") {
							itemPath.shift();
						}
						itemPath = itemPath.join('/');
						ufdel(itemPath);
						apps.files2.vars.update();
					}
				}, 'File Manager');
			},
			deleteItemLF: function (itemPath) {
				apps.prompt.vars.confirm("Are you sure you want to delete this item?<br><br>" + itemPath + "<br><br>WARNING: This cannot be undone!", ["No, keep", "Yes, delete"], (btn) => {
					if (btn === 1) {
						itemPath = itemPath.split('/');
						if (itemPath[0] === "") {
							itemPath.shift();
						}
						if (itemPath[0] === "USERFILES") {
							itemPath.shift();
						}
						itemPath = itemPath.join('/');
						lfdel(itemPath);
						apps.files2.vars.update();
					}
				}, 'File Manager');
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
			testingFolder: {
				filenameTests: {
					"This is a really long file name that has spaces and stuff in it!": "Hello World",
					ThisIsAReallyLongFileNameThatDoesNotHaveAnySpacesAndStuffInIt: "HelloWorld",
					"123_test": "43110 World",
					test_123: "Hello |/\\|0710",
					"this.has.dots.in.it": "Hello.World",
					"Folder with spaces": {
						secretMessage: "Oof"
					},
					"Folder.with.dots": {
						secretMessage: "Yeet"
					},
					"file/with/slashes": "Wowza",
					"file/with/slash/at/end/": "oh boy",
					"folder/with/slash/at/end/": {
						"folder": {
							"wat": "odang"
						},
						"file": "oooooh"
					}
				},
				stringFile: "Hello World",
				functionFile: function() {
					return "Hello World"
				},
				booleanTrueFile: true,
				booleanFalseFile: false,
				undefinedFile: undefined,
				nullFile: null,
				numberFile: 1337
			},
			currTotal: 0,
			currItem: 0,
			currEffect: 0,
			currContentStr: '',
			currDirList: [],
			update: function() {
				this.currContentStr = '';
				getId('FIL2searchInput').value = '';
				getId("FIL2green").style.backgroundColor = 'rgb(170, 255, 170)';
				getId("FIL2green").style.width = "0";
				getId('FIL2cntn').classList.add('cursorLoadDark');
				getId("FIL2cntn").innerHTML = '<div id="FIL2tbl" class="' + this.viewModes[this.currViewMode][1] + '" style="width:100%; position:absolute; margin:auto;padding-bottom:3px;"></div>';
				getId("FIL2tbl").style.marginTop = scrollHeight;
				if (this.currLoc === '/') {
					getId("FIL2path").innerHTML = '<div id="FIL2green" style="height:100%;background-color:rgb(170, 255, 170)"></div><div style="width:100%;height:25px;"><input id="FIL2input" style="background:transparent;box-shadow:none;color:inherit;font-family:monospace;border:none;width:calc(100% - 8px);height:25px;padding:0;padding-left:8px;border-top-left-radius:5px;border-top-right-radius:5px;" onkeypress="if(event.keyCode===13){apps.files2.vars.navigate(this.value)}" value="/"></div>';
					getId("FIL2tbl").innerHTML =
						'<span style="padding-left:3px;line-height:18px">Home</span><br>' +
						'<div class="cursorPointer" onClick="apps.files2.vars.next(\'apps/\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'/apps/\\\');toTop(apps.properties)\'])">' +
						'<img src="files2/small/folder.png"> ' +
						'apps/' +
						'</div><div class="cursorPointer" onClick="apps.files2.vars.next(\'widgets/\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'/widgets/\\\');toTop(apps.properties)\'])">' +
						'<img src="files2/small/folder.png"> ' +
						'widgets/' +
						'</div><div class="cursorPointer" onClick="apps.files2.vars.next(\'USERFILES/\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'/USERFILES/\\\');toTop(apps.properties)\'])">' +
						'<img src="files2/small/folder.png"> ' +
						'USERFILES/' +
						'</div><div class="cursorPointer" onClick="apps.files2.vars.next(\'LOCALFILES/\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'/LOCALFILES/\\\');toTop(apps.properties)\'])">' +
						'<img src="files2/small/folder.png"> ' +
						'LOCALFILES/' +
						function() {
							if (apps.settings.vars.FILcanWin) {
								return '</div><div class="cursorPointer" onClick="apps.files2.vars.next(\'window/\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'/window/\\\');toTop(apps.properties)\'])">' +
									'<img src="files2/small/folder.png"> ' +
									'<span style="color:#F00">window/</span>';
							} else {
								return '';
							}
						}() +
						'</div>' +
						'<br><br><span style="padding-left:3px;line-height:18px;">Favorites</span><br>';
					this.updateFavorites(1, 1);
					getId("FIL2green").className = '';
					getId('FIL2green').style.backgroundColor = "#FFF";
					getId("FIL2green").style.display = "none";
					getId("FIL2cntn").style.backgroundImage = "";
					getId('FIL2cntn').classList.remove('cursorLoadDark');
				} else {
					getId("FIL2path").innerHTML = '<div id="FIL2green" class="liveElement" data-live-target="style.width" data-live-eval="apps.files2.vars.currItem/apps.files2.vars.currTotal*100+\'%\'" style="height:100%;background-color:rgb(170, 255, 170);box-shadow:0 0 20px 10px rgb(170, 255, 170)"></div><div style="width:100%;height:25px;"><input id="FIL2input" style="background:transparent;box-shadow:none;color:inherit;font-family:monospace;border:none;width:calc(100% - 8px);height:25px;padding:0;padding-left:8px;border-top-left-radius:5px;border-top-right-radius:5px;" onkeypress="if(event.keyCode===13){apps.files2.vars.navigate(this.value)}" value="' + this.currLoc + '"></div>';
					this.currDirList = sh("ls '" + this.currLoc + "'").split('\n');
					if (this.currDirList.length === 1 && this.currDirList[0] === "") {
						if (typeof apps.bash.vars.getRealDir(this.currLoc) !== "object" || apps.bash.vars.getRealDir(this.currLoc) === null) {
							apps.prompt.vars.alert("Could not open " + this.currLoc + ": Does not exist or is null.", "Okay", function() {}, "File Manager");
						}
					} else {
						this.currDirList.sort(function (a, b) {
							var aLow = a.toLowerCase();
							var bLow = b.toLowerCase();
							if (aLow === bLow) return 0;
							if (aLow > bLow) return 1;
							return -1;
						});
						var temphtml = '';
						if (this.currLoc.indexOf("/USERFILES/") === 0) {
							for (let item in this.currDirList) {
								if (this.currDirList[item]) {
									// if item is a folder
									if (this.currDirList[item][this.currDirList[item].length - 1] === "/" && this.currDirList[item][this.currDirList[item].length - 2] !== "\\") {
										temphtml += '<div class="cursorPointer" onclick="apps.files2.vars.next(\'' + this.currDirList[item] + '\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\', \'ctxMenu/beta/x.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'' + (this.currLoc + this.currDirList[item]) + '\\\');toTop(apps.properties)\', \'+Delete\', \'apps.files2.vars.deleteItemUF(\\\'' + (this.currLoc + this.currDirList[item]) + '\\\')\'])">' +
											'<img src="files2/small/folder.png"> ' +
											this.currDirList[item].split('\\/').join('/') +
											'</div>';
									} else {
										temphtml += '<div class="cursorPointer" onClick="apps.notepad2.vars.openFile(\'' + (this.currLoc + this.currDirList[item]).split('\\').join('\\\\') + '\');" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\', \'ctxMenu/beta/x.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'' + (this.currLoc + this.currDirList[item]).split('\\').join('\\\\') + '\\\');toTop(apps.properties)\', \'+Delete\', \'apps.files2.vars.deleteItemUF(\\\'' + (this.currLoc + this.currDirList[item]) + '\\\')\'])">' +
											'<img src="files2/small/' + this.icontype(typeof apps.bash.vars.getRealDir(this.currLoc + this.currDirList[item])) + '.png"> ' +
											this.currDirList[item].split('\\/').join('/') + '<span style="opacity:0.5;float:right;">' + this.filetype(typeof apps.bash.vars.getRealDir(this.currLoc + this.currDirList[item])) + '&nbsp;</span>' +
											'</div>';
									}
								}
							}
						} else if (this.currLoc.indexOf("/LOCALFILES/") === 0) {
							for (let item in this.currDirList) {
								if (this.currDirList[item]) {
									// if item is a folder
									if (this.currDirList[item][this.currDirList[item].length - 1] === "/" && this.currDirList[item][this.currDirList[item].length - 2] !== "\\") {
										temphtml += '<div class="cursorPointer" onclick="apps.files2.vars.next(\'' + this.currDirList[item] + '\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\', \'ctxMenu/beta/x.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'' + (this.currLoc + this.currDirList[item]) + '\\\');toTop(apps.properties)\', \'+Delete\', \'apps.files2.vars.deleteItemLF(\\\'' + (this.currLoc + this.currDirList[item]) + '\\\')\'])">' +
											'<img src="files2/small/folder.png"> ' +
											this.currDirList[item].split('\\/').join('/') +
											'</div>';
									} else {
										temphtml += '<div class="cursorPointer" onClick="apps.notepad2.vars.openFile(\'' + (this.currLoc + this.currDirList[item]).split('\\').join('\\\\') + '\');" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\', \'ctxMenu/beta/x.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'' + (this.currLoc + this.currDirList[item]).split('\\').join('\\\\') + '\\\');toTop(apps.properties)\', \'+Delete\', \'apps.files2.vars.deleteItemLF(\\\'' + (this.currLoc + this.currDirList[item]) + '\\\')\'])">' +
											'<img src="files2/small/' + this.icontype(typeof apps.bash.vars.getRealDir(this.currLoc + this.currDirList[item])) + '.png"> ' +
											this.currDirList[item].split('\\/').join('/') + '<span style="opacity:0.5;float:right;">' + this.filetype(typeof apps.bash.vars.getRealDir(this.currLoc + this.currDirList[item])) + '&nbsp;</span>' +
											'</div>';
									}
								}
							}
						} else if (this.currLoc === "/apps/") {
							for (let item in this.currDirList) {
								if (this.currDirList[item]) {
									// if item is a folder
									if (this.currDirList[item][this.currDirList[item].length - 1] === "/" && this.currDirList[item][this.currDirList[item].length - 2] !== "\\") {
										temphtml += '<div class="cursorPointer" onclick="apps.files2.vars.next(\'' + this.currDirList[item] + '\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/window.png\', \'ctxMenu/beta/file.png\', \'ctxMenu/beta/x.png\'], \' Open App\', \'openapp(apps.' + this.currDirList[item].substring(0, this.currDirList[item].length - 1) + ', \\\'dsktp\\\')\', \'+Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'' + (this.currLoc + this.currDirList[item]) + '\\\');toTop(apps.properties)\', \'_Delete\', \'\'])">' +
											buildSmartIcon(16, apps[this.currDirList[item].split('/')[0]].appWindow.appImg) + ' ' +
											this.currDirList[item].split('\\/').join('/') +
											'</div>';
									} else {
										temphtml += '<div class="cursorPointer" onClick="apps.notepad2.vars.openFile(\'' + (this.currLoc + this.currDirList[item]).split('\\').join('\\\\') + '\');" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\', \'ctxMenu/beta/x.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'' + (this.currLoc + this.currDirList[item]).split('\\').join('\\\\') + '\\\');toTop(apps.properties)\', \'-Delete\', \'\'])">' +
											'<img src="files2/small/' + this.icontype(typeof apps.bash.vars.getRealDir(this.currLoc + this.currDirList[item])) + '.png"> ' +
											this.currDirList[item].split('\\/').join('/') + '<span style="opacity:0.5;float:right;">' + this.filetype(typeof apps.bash.vars.getRealDir(this.currLoc + this.currDirList[item])) + '&nbsp;</span>' +
											'</div>';
									}
								}
							}
						} else {
							for (let item in this.currDirList) {
								if (this.currDirList[item]) {
									// if item is a folder
									if (this.currDirList[item][this.currDirList[item].length - 1] === "/" && this.currDirList[item][this.currDirList[item].length - 2] !== "\\") {
										temphtml += '<div class="cursorPointer" onclick="apps.files2.vars.next(\'' + this.currDirList[item] + '\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\', \'ctxMenu/beta/x.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'' + (this.currLoc + this.currDirList[item]) + '\\\');toTop(apps.properties)\', \'+Delete\', \'apps.files2.vars.deleteItem(\\\'' + (this.currLoc + this.currDirList[item]) + '\\\')\'])">' +
											'<img src="files2/small/folder.png"> ' +
											this.currDirList[item].split('\\/').join('/') +
											'</div>';
									} else {
										temphtml += '<div class="cursorPointer" onClick="apps.notepad2.vars.openFile(\'/window' + (this.currLoc + this.currDirList[item]).split('\\').join('\\\\') + '\');" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\', \'ctxMenu/beta/x.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'' + (this.currLoc + this.currDirList[item]).split('\\').join('\\\\') + '\\\');toTop(apps.properties)\', \'+Delete\', \'apps.files2.vars.deleteItem(\\\'' + (this.currLoc + this.currDirList[item]) + '\\\')\'])">' +
											'<img src="files2/small/' + this.icontype(typeof apps.bash.vars.getRealDir(this.currLoc + this.currDirList[item])) + '.png"> ' +
											this.currDirList[item].split('\\/').join('/') + '<span style="opacity:0.5;float:right;">' + this.filetype(typeof apps.bash.vars.getRealDir(this.currLoc + this.currDirList[item])) + '&nbsp;</span>' +
											'</div>';
									}
								}
							}
						}
						getId('FIL2tbl').innerHTML = temphtml;
					}
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
				var tempHTML = '<div class="cursorPointer" onclick="apps.files2.vars.currLoc = \'/\';apps.files2.vars.update()" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\', \'ctxMenu/beta/x.png\'], \'-Properties\', \'\', \'_Delete\', \'\'])">' +
					'<img src="files2/small/folder.png"> ' +
					'/' +
					'</div>';
				for (var i in pathSplit) {
					if (pathSplit.indexOf("apps") === 0 && navDepth === 1) {
						tempHTML += '<div class="cursorPointer" onclick="apps.files2.vars.currLoc = \'' + navPath + '\';apps.files2.vars.next(\'' + pathSplit[i] + '/\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\', \'ctxMenu/beta/x.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'' + (navPath + pathSplit[i]) + '/\\\');toTop(apps.properties)\', \'_Delete\', \'\'])">' +
							buildSmartIcon(16, (apps[pathSplit[i]] || {
								appWindow: {
									appImg: {
										foreground: "appicons/ds/redx.png"
									}
								}
							}).appWindow.appImg) + ' ' +
							pathSplit[i].split('\\/').join('/') + "/" +
							'</div>';
					} else {
						tempHTML += '<div class="cursorPointer" onclick="apps.files2.vars.currLoc = \'' + navPath + '\';apps.files2.vars.next(\'' + pathSplit[i] + '/\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\', \'ctxMenu/beta/x.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'' + (navPath + pathSplit[i]) + '/\\\');toTop(apps.properties)\', \'_Delete\', \'\'])">' +
							'<img src="files2/small/folder.png"> ' +
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
				for (var i = 0; i < searchElems.length; i++) {
					if (searchElems[i].innerText.toLowerCase().indexOf(searchStr.toLowerCase()) === -1) {
						searchElems[i].style.display = 'none';
					} else {
						searchElems[i].style.display = '';
					}
				}
			},
			favorites: [],
			updateFavorites: function (nosave, mainPage) {
				if (!nosave) ufsave('aos_system/apps/files/favorites', JSON.stringify(this.favorites));
				var tempHTML = '';
				for (let i in this.favorites) {
					var currPath = this.favorites[i].split('/');
					var cleanEscapeRun = 0;
					while (!cleanEscapeRun) {
						cleanEscapeRun = 1;
						for (let j = 0; j < currPath.length - 1; j++) {
							if (currPath[j][currPath[j].length - 1] === '\\') {
								currPath.splice(j, 2, currPath[j].substring(0, currPath[j].length) + '/' + currPath[j + 1]);
								cleanEscapeRun = 0;
								break;
							}
						}
						if (cleanEscapeRun && currPath.length > 0) {
							if (currPath[currPath.length - 1][currPath[currPath.length - 1].length - 1] === '\\') {
								currPath.splice(j, 1, currPath[currPath.length - 1].substring(0, currPath[currPath.length - 1].length) + '/');
								cleanEscapeRun = 0;
							}
						}
					}
					if (currPath[currPath.length - 1] === "") {
						currPath.pop();
					}
					if (currPath[0] === "") {
						currPath.shift();
					}
					if (currPath.length === 0) {
						tempHTML += '<div class="cursorPointer" onclick="apps.files2.vars.currLoc = \'/\';apps.files2.vars.update()" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\', \'ctxMenu/beta/x.png\'], \'-Properties\', \'\', \'+Remove Favorite\', \'apps.files2.vars.toggleFavorite(\\\'/\\\')\', \'_Delete\', \'\'])">' +
							'<img src="files2/small/folder.png"> ' +
							'/' +
							'</div>';
					} else {
						var currName = currPath[currPath.length - 1];
						if (currPath.indexOf("apps") === 0 && currPath.length === 2) {
							tempHTML += '<div class="cursorPointer" onclick="apps.files2.vars.currLoc = \'' + this.favorites[i] + '\';apps.files2.vars.update()" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\', \'ctxMenu/beta/x.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'' + this.favorites[i] + '\\\');toTop(apps.properties)\', \'+Remove Favorite\', \'apps.files2.vars.toggleFavorite(\\\'' + this.favorites[i] + '\\\')\', \'_Delete\', \'\'])">' +
								buildSmartIcon(16, (apps[currName] || {
									appWindow: {
										appImg: {
											foreground: "appicons/ds/redx.png"
										}
									}
								}).appWindow.appImg) + ' ' +
								currName.split('\\/').join('/') + "/" +
								'</div>';
						} else {
							tempHTML += '<div class="cursorPointer" onclick="apps.files2.vars.currLoc = \'' + this.favorites[i] + '\';apps.files2.vars.update()" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\', \'ctxMenu/beta/x.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'' + this.favorites[i] + '\\\');toTop(apps.properties)\', \'+Remove Favorite\', \'apps.files2.vars.toggleFavorite(\\\'' + this.favorites[i] + '\\\')\', \'_Delete\', \'\'])">' +
								'<img src="files2/small/folder.png"> ' +
								currName.split('\\/').join('/') + '/' +
								'</div>';
						}
					}
				}
				if (mainPage) {
					getId("FIL2tbl").innerHTML += tempHTML;
				} else {
					getId("FIL2favorites").innerHTML = tempHTML;
					if (this.currLoc === '/') {
						this.update();
					}
				}
			},
			toggleFavorite: function (item) {
				var itemLocation = this.favorites.indexOf(item);
				if (itemLocation === -1) {
					this.favorites.push(item);
				} else {
					this.favorites.splice(itemLocation, 1);
				}
				this.updateFavorites();
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
						if (ufload("aos_system/apps/files/view_mode")) {
							this.vars.setViewMode(parseInt(ufload("aos_system/apps/files/view_mode")), 1);
						}
						if (ufload("aos_system/apps/files/favorites")) {
							this.vars.favorites = JSON.parse(ufload("aos_system/apps/files/favorites"));
						}
						if (ufload("aos_system/apps/files/window_debug")) {
							apps.settings.vars.FILcanWin = parseInt(ufload("aos_system/apps/files/window_debug"));
						}
						break;
					case 'shutdown':

						break;
					default:
						doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'", "#F00");
			}
		}
	});
});

c(function() {
	window.SRVRKEYWORD = window.SRVRKEYWORD || "";
	m('init SAV');
	apps.savemaster = new Application({
		title: "SaveMaster",
		abbreviation: "SAV",
		codeName: "savemaster",
		image: "appicons/ds/SAV.png",
		hideApp: 2,
		main: function() {
			this.appWindow.setCaption("SaveMaster");
			if (!this.appWindow.appIcon) {
				this.appWindow.setDims("auto", "auto", 600, 500);
			}
			this.appWindow.setContent(
				'Here are the last ten save operations.<br>' + apps.savemaster.vars.buildSavesMenu()
			);
			this.appWindow.openWindow();
		},
		vars: {
			appInfo: 'This application handles all file saving over the Cloud to the AaronOS server. It is only accessible via API to aOS apps.',
			sp: "",
			sc: "",
			saving: 0,
			xf: {},
			savePerf: 0,
			buildSavesMenu: function() {
				var tempHTML = "";
				for (var i in apps.savemaster.vars.xf) {
					if (i.indexOf("fd") === 0) {
						var thisID = i.substring(2);
						var thisOperation = apps.savemaster.vars.xf["xhttp" + thisID].responseURL;
						if (thisOperation.indexOf("/filesavernew.php") > -1) {
							thisOperation = "Write";
						} else if (thisOperation.indexOf("/filedeleter.php")) {
							thisOperation = "Delete";
						}
						tempHTML = "<br><br>" + thisID + ": " + thisOperation + " <span style='font-family:monospace'>" + apps.savemaster.vars.xf["fd" + thisID].get("f") + "</span>" + tempHTML;
					}
				}
				return tempHTML;
			},
			save: function (filepath, filecontent, newformat, errorreport, pass) {
				m('Saving File');
				d(1, 'Saving File ' + filepath);
				if (filepath.indexOf('..') > -1) {
					apps.prompt.vars.alert('Error saving file:<br><br>Not allowed to use ".." keyword.', 'Okay', function() {}, 'SaveMaster');
					return false;
				}

				this.savePerf = Math.floor(performance.now());
				if (!noUserFiles) {
					if (!newformat) {
						getId("mastersaveframe").src = "filesaver.php/?k=" + SRVRKEYWORD + "&f=" + filepath + "&c=" + filecontent;
					} else {
						this.saving = 2;
						taskbarShowHardware();
						if (errorreport === 'ERROR_REPORT') {
							this.xf['fd' + this.savePerf] = new FormData();
							this.xf['fd' + this.savePerf].append('k', SRVRKEYWORD);
							this.xf['fd' + this.savePerf].append('f', filepath);
							this.xf['fd' + this.savePerf].append('c', filecontent);
							this.xf['xhttp' + this.savePerf] = new XMLHttpRequest();
							this.xf['xhttp' + this.savePerf].onreadystatechange = function() {
								if (apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].readyState === 4) {
									apps.savemaster.vars.saving = 0;
									taskbarShowHardware();
									if (apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].status !== 200) {
										apps.prompt.vars.alert('Error saving file:<br><br>Could not contact server.', 'Okay', function() {}, 'SaveMaster');
									} else if (apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].responseText.indexOf('Error - ') === 0) {
										apps.prompt.vars.alert('Error saving file:<br><br>' + (apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].responseText || "No response."), 'Okay', function() {}, 'SaveMaster');
									}
								}
							};
							this.xf['xhttp' + this.savePerf].open('POST', 'filesavernew.php/?error=error');
							this.xf['xhttp' + this.savePerf].send(this.xf['fd' + this.savePerf]);
							sh('mkdir /USERFILES/' + filepath.substring(0, filepath.lastIndexOf('/')));
							apps.savemaster.vars.temporarySaveContent = '' + filecontent;
							eval(apps.bash.vars.translateDir('/USERFILES/' + filepath) + '=apps.savemaster.vars.temporarySaveContent');
							delete apps.savemaster.vars.temporarySaveContent;
						} else if (errorreport === 'RDP') {
							this.xf['fd' + this.savePerf] = new FormData();
							this.xf['fd' + this.savePerf].append('k', SRVRKEYWORD);
							this.xf['fd' + this.savePerf].append('f', filepath);
							this.xf['fd' + this.savePerf].append('c', filecontent);
							this.xf['xhttp' + this.savePerf] = new XMLHttpRequest();
							this.xf['xhttp' + this.savePerf].onreadystatechange = function() {
								if (apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].readyState === 4) {
									apps.savemaster.vars.saving = 0;
									taskbarShowHardware();
									if (apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].status !== 200) {
										apps.prompt.vars.alert('Error saving file:<br><br>Could not contact server.', 'Okay', function() {}, 'SaveMaster');
									} else if (apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].responseText.indexOf('Error - ') === 0) {
										apps.prompt.vars.alert('Error saving file:<br><br>' + (apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].responseText || "No response."), 'Okay', function() {}, 'SaveMaster');
									}
								}
							};
							this.xf['xhttp' + this.savePerf].open('POST', 'filesavernew.php/?rdp=rdp');
							this.xf['xhttp' + this.savePerf].send(this.xf['fd' + this.savePerf]);
						} else if (errorreport === 'mUname') {
							this.xf['fd' + this.savePerf] = new FormData();
							this.xf['fd' + this.savePerf].append('k', SRVRKEYWORD);
							this.xf['fd' + this.savePerf].append('f', filepath);
							this.xf['fd' + this.savePerf].append('c', filecontent);
							this.xf['xhttp' + this.savePerf] = new XMLHttpRequest();
							this.xf['xhttp' + this.savePerf].onreadystatechange = function() {
								if (apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].readyState === 4) {
									apps.savemaster.vars.saving = 0;
									taskbarShowHardware();
									if (apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].status !== 200) {
										apps.prompt.vars.alert('Error saving file:<br><br>Could not contact server.', 'Okay', function() {}, 'SaveMaster');
									} else if (apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].responseText.indexOf('Error - ') === 0) {
										apps.prompt.vars.alert('Error saving file:<br><br>' + (apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].responseText || "No response."), 'Okay', function() {}, 'SaveMaster');
									}
								}
							};
							this.xf['xhttp' + this.savePerf].open('POST', 'filesavernew.php/?mUname=mUname&pass=' + pass.split('?').join('X').split('&').join('X'));
							this.xf['xhttp' + this.savePerf].send(this.xf['fd' + this.savePerf]);
							sh('mkdir /USERFILES/' + filepath.substring(0, filepath.lastIndexOf('/')));
							apps.savemaster.vars.temporarySaveContent = '' + filecontent;
							eval(apps.bash.vars.translateDir('/USERFILES/' + filepath) + '=apps.savemaster.vars.temporarySaveContent');
							delete apps.savemaster.vars.temporarySaveContent;
						} else {
							this.xf['fd' + this.savePerf] = new FormData();
							this.xf['fd' + this.savePerf].append('k', SRVRKEYWORD);
							this.xf['fd' + this.savePerf].append('f', filepath);
							this.xf['fd' + this.savePerf].append('c', filecontent);
							if (errorreport === 'SET_PASSWORD') {
								this.xf['fd' + this.savePerf].append('setpass', 'true');
							}
							this.xf['xhttp' + this.savePerf] = new XMLHttpRequest();
							this.xf['xhttp' + this.savePerf].onreadystatechange = function() {
								if (apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].readyState === 4) {
									apps.savemaster.vars.saving = 0;
									taskbarShowHardware();
									if (apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].status !== 200) {
										apps.prompt.vars.alert('Error saving file:<br><br>Could not contact server.', 'Okay', function() {}, 'SaveMaster');
									} else if (apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].responseText.indexOf('Error - ') === 0) {
										apps.prompt.vars.alert('Error saving file:<br><br>' + (apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].responseText || "No response."), 'Okay', function() {}, 'SaveMaster');
									}
								}
							};
							this.xf['xhttp' + this.savePerf].open('POST', 'filesavernew.php');
							this.xf['xhttp' + this.savePerf].send(this.xf['fd' + this.savePerf]);
							if (errorreport === 'SET_PASSWORD') {
								eval(apps.bash.vars.translateDir('/USERFILES/' + filepath) + '="*****"');
							} else {
								sh('mkdir /USERFILES/' + filepath.substring(0, filepath.lastIndexOf('/')));
								apps.savemaster.vars.temporarySaveContent = '' + filecontent;
								eval(apps.bash.vars.translateDir('/USERFILES/' + filepath) + '=apps.savemaster.vars.temporarySaveContent');
								delete apps.savemaster.vars.temporarySaveContent;
							}
						}
					}
				} else {
					if (errorreport === 'SET_PASSWORD') {
						eval(apps.bash.vars.translateDir('/USERFILES/' + filepath) + '="*****"');
					} else {
						sh('mkdir /USERFILES/' + filepath.substring(0, filepath.lastIndexOf('/')));
						apps.savemaster.vars.temporarySaveContent = '' + filecontent;
						eval(apps.bash.vars.translateDir('/USERFILES/' + filepath) + '=apps.savemaster.vars.temporarySaveContent');
						delete apps.savemaster.vars.temporarySaveContent;
					}
				}
				m(modulelast);
			},
			mkdir: function(filepath) {
				if (filepath.indexOf('..') > -1) {
					apps.prompt.vars.alert('Error saving directory:<br><br>Not allowed to use ".." keyword.', 'Okay', function() {}, 'SaveMaster');
					return false;
				}
				if (!noUserFiles) {
					this.xf['fd' + this.savePerf] = new FormData();
					this.xf['fd' + this.savePerf].append('k', SRVRKEYWORD);
					this.xf['fd' + this.savePerf].append('f', filepath);
					this.xf['fd' + this.savePerf].append('mkdir', 'true');
					this.xf['xhttp' + this.savePerf] = new XMLHttpRequest();
					this.xf['xhttp' + this.savePerf].onreadystatechange = function() {
						if (apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].readyState === 4) {
							apps.savemaster.vars.saving = 0;
							taskbarShowHardware();
							if (apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].status !== 200) {
								apps.prompt.vars.alert('Error saving directory:<br><br>Could not contact server.', 'Okay', function() {}, 'SaveMaster');
							} else if (apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].responseText.indexOf('Error - ') === 0) {
								apps.prompt.vars.alert('Error saving directory:<br><br>' + (apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].responseText || "No response."), 'Okay', function() {}, 'SaveMaster');
							}
						}
					};
					this.xf['xhttp' + this.savePerf].open('POST', 'filesavernew.php');
					this.xf['xhttp' + this.savePerf].send(this.xf['fd' + this.savePerf]);
				}
				sh('mkdir /USERFILES/' + filepath);
			},
			latestDel: '',
			del: function(filepath) {
				this.savePerf = Math.floor(performance.now());
				if (!noUserFiles) {
					apps.savemaster.vars.saving = 2;
					taskbarShowHardware();
					apps.savemaster.vars.xf['fd' + apps.savemaster.vars.savePerf] = new FormData();
					apps.savemaster.vars.xf['fd' + apps.savemaster.vars.savePerf].append('k', SRVRKEYWORD);
					apps.savemaster.vars.xf['fd' + apps.savemaster.vars.savePerf].append('f', filepath);
					apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf] = new XMLHttpRequest();
					apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].onreadystatechange = function() {
						if (apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].readyState === 4) {
							apps.savemaster.vars.saving = 0;
							taskbarShowHardware();
						}
					};
					apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].open('POST', 'filedeleter.php');
					apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].send(apps.savemaster.vars.xf['fd' + apps.savemaster.vars.savePerf]);
				}
				eval('delete ' + apps.bash.vars.translateDir('/USERFILES/' + filepath));
			}
		}
	});
	window.ufsave = function(filename, filecontent) {
		return apps.savemaster.vars.save(filename, filecontent, 1);
	};
	window.ufdel = function(filename) {
		return apps.savemaster.vars.del(filename);
	};
	window.ufload = function(filename, debug) {
		try {
			if (debug) {
				doLog("ufload " + filename + ":", "#ABCDEF");
				doLog(apps.bash.vars.getRealDir("/USERFILES/" + filename), "#ABCDEF");
			}
			return apps.bash.vars.getRealDir("/USERFILES/" + filename);
		} catch (err) {
			if (debug) {
				doLog(err, "#FFCDEF");
			}
			return null;
		}
	};
	getId('aOSloadingInfo').innerHTML = 'Web App Maker';
});

/* WEB APP MAKER */
c(function() {
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
						return numtf(darkMode);
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
								return numtf(apps[frame.getAttribute("data-parent-app")].appWindow.fullscreen);
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
										conversation: "aosTools_get_page_id"
									}
									var randomIDChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
									var tempStr = "";
									for (var i = 0; i < 16; i++) {
										tempStr += randomIDChars[Math.floor(Math.random() * randomIDChars.length)];
									}
									apps.webAppMaker.vars.pageIDsToVerify[tempStr] = msg.data.aosToolsFrameID;
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
											if (msg.data.aosToolsFrameID === apps.webAppMaker.vars.pageIDsToVerify[msg.data.content[0]]) {
												// the correct frame is identified
												apps.webAppMaker.vars.verifiedFrames[apps.webAppMaker.vars.pageIDsToVerify[msg.data.content[0]]] = apps.webAppMaker.vars.framesToVerify[msg.data.content[0]][apps.webAppMaker.vars.frameIDsToVerify[msg.data.content[0]].indexOf(msg.data.content[1])];
												apps.webAppMaker.vars.verifiedFrames[apps.webAppMaker.vars.pageIDsToVerify[msg.data.content[0]]].setAttribute("data-frame-id", apps.webAppMaker.vars.pageIDsToVerify[msg.data.content[0]]);
												var returnMessage = {
													messageType: "response",
													content: true,
													data: true
												};
												if (msg.data.conversation) {
													returnMessage.conversation = "aosTools_verify_page_id";
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
								returnMessage.content = apps.webAppMaker.vars.actions[msg.data.action.split(":")[0]][msg.data.action.split(":")[1]](msg.data, (apps.webAppMaker.vars.verifiedFrames[msg.data.aosToolsFrameID] || msg.data.aosToolsFrameID), (msg.origin !== "null" ? msg.origin : "*"));
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
						apps.webAppMaker.vars.trustedApps[origin][permission] = "" + numtf(btn);
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
	getId('aOSloadingInfo').innerHTML = 'Messaging';
});

/* MESSAGING */
c(function() {
	m('init MSG');
	apps.messaging = new Application({
		title: "Messaging",
		abbreviation: "MSG",
		codeName: "messaging",
		image: {
			backgroundColor: "#303947",
			foreground: "smarticons/messaging/fg.png",
			backgroundBorder: {
				thickness: 2,
				color: "#252F3A"
			}
		},
		hideApp: 0,
		launchTypes: 1,
		main: function (launchType) {
			if (!this.appWindow.appIcon) {
				this.appWindow.paddingMode(0);
				this.vars.lastUserRecieved = '';
				this.appWindow.setDims("auto", "auto", 800, 500);
			}
			this.appWindow.setCaption('Messaging');
			if (launchType === 'dsktp') {
				this.appWindow.setContent(
					'<div id="MSGdiv" style="width:100%;height:calc(100% - 52px);overflow-y:scroll;padding-top:32px;"></div>' +
					'<div class="noselect" style="left:0;top:0;background:#FFA;padding:2px;font-family:aosProFont,monospace;font-size:12px;border-bottom-right-radius:5px;color:#000;">' + this.vars.discussionTopic + '</div>' +
					'<button style="position:absolute;bottom:0;height:24px;width:10%;" onclick="apps.messaging.vars.doSettings()">Settings</button>' +
					'<button style="position:absolute;bottom:0;height:24px;width:10%;left:10%;" onclick="apps.messaging.vars.doFormatting()">Formatting</button>' +
					'<input id="MSGinput" style="position:absolute;height:21px;width:70%;bottom:0;left:20%;border:none;border-top:1px solid ' + darkSwitch('#000', '#FFF') + ';font-family:sans-serif">' +
					'<button onclick="apps.messaging.vars.sendMessage()" style="position:absolute;right:0;bottom:0;width:10%;height:24px">Send</button>');
				this.vars.lastMsgRecieved = this.vars.lastMsgStart;
				getId('MSGinput').setAttribute('onkeyup', 'if(event.keyCode === 13){apps.messaging.vars.sendMessage();}');
			}
			this.appWindow.openWindow();
			this.vars.requestMessage();
		},
		vars: {
			appInfo: 'The official AaronOS Messenger. Chat with the entire aOS community, all at once.<br><br>To set your name, go to Settings -&gt; 1, and enter a chat name.<br><br>To view past messages, go to Settings -&gt; 2, and enter in the number of past messages you wish to view.',
			lastMsgRecieved: '-9',
			nameTemp: 'Anonymous',
			name: 'Anonymous',
			xhttpDelay: 0,
			messageTemp: '',
			message: '',
			lastSetIn: '',
			lastMsgStart: '-9',
			doFormatting: function() {
				tempStr = '';
				for (var i in apps.messaging.vars.objTypes) {
					tempStr += '<br><br><br><br><span style="background:rgba(127, 127, 127, 0.5);padding:3px;border-radius:3px;">[' + i + ']</span><br><br>' +
						(apps.messaging.vars.objDesc[i] || 'No description.') + '<br><br>Example:<br><br>' +
						'<span style="background:rgba(127, 127, 127, 0.5);padding:3px;border-radius:3px;">' + (apps.messaging.vars.objExamp[i] || 'No examples.') +
						'</span><br><br>' + apps.messaging.vars.parseBB(apps.messaging.vars.objExamp[i] || '');
				}
				apps.prompt.vars.alert('Here are all the installed formatting tools:' + tempStr, 'Okay', function() {}, 'Messaging');
			},
			doSettings: function() {
				apps.prompt.vars.confirm('Choose a settings option below.', ['Cancel', 'Change Chat Name', 'Load Past Messages'], function (txtIn) {
					apps.messaging.vars.lastSetIn = txtIn;
					switch (apps.messaging.vars.lastSetIn) {
						case 1:
							apps.prompt.vars.prompt('Please enter a Chatname.<br>Default is Anonymous<br>Current is ' + apps.messaging.vars.name, 'Submit', function (txtIN) {
								apps.messaging.vars.nameTemp = txtIN;
								if (apps.messaging.vars.nameTemp.length > 30 && apps.messaging.vars.nameTemp.length < 3) {
									apps.prompt.vars.alert('Your name cannot be more than 30 or less than 3 characters long.', 'Okay', function() {}, 'Messaging');
								} else if (apps.messaging.vars.nameTemp.toUpperCase().indexOf('{ADMIN}') > -1) {
									apps.prompt.vars.alert('Sorry, admins can only be set manually. Please ask an administrator.', 'Okay', function() {}, 'Messaging');
								} else {
									apps.messaging.vars.name = apps.messaging.vars.nameTemp;
									apps.savemaster.vars.save('aos_system/apps/messaging/chat_name', apps.messaging.vars.name, 1, 'mUname', '');
								}
							}, 'Messaging');
							break;
						case 2:
							apps.prompt.vars.prompt('Load the last x messages.<br>Default when opening is 10.<br>Make it a positive integer.<br>This will restart the Messaging app.', 'Submit', function (subNum) {
								apps.messaging.vars.lastMsgStart = "-" + subNum;
								apps.messaging.appWindow.closeWindow();
								openapp(apps.messaging, 'dsktp');
							}, 'Messaging');
							break;
						default:
							doLog('Messaging settings change cancelled');
					}
				}, 'Messaging');
			},
			xhttp: {},
			sendhttp: {},
			sendfd: {},
			lastMessage: '',
			lastMessageTime: 0,
			sendMessage: function() {
				this.messageTemp = getId("MSGinput").value;
				if (this.messageTemp === this.lastMessage) {
					apps.prompt.vars.notify('Please don\'t send the same message twice in a row.', ['Okay'], function (btn) {}, 'Messaging', 'appicons/ds/MSG.png');
					getId('MSGinput').value = '';
				} else if (performance.now() - this.lastMessageTime < 3000) {
					apps.prompt.vars.notify('Please wait at least 3 seconds between messages.', ['Okay'], function (btn) {}, 'Messaging', 'appicons/ds/MSG.png');
				} else {
					this.lastMessage = this.messageTemp;
					if (this.messageTemp.length !== 0) {
						this.sendhttp = new XMLHttpRequest();
						this.sendfd = new FormData();
						this.sendfd.append('c', this.lastMessage);
						this.sendhttp.open('POST', 'messager.php');
						this.sendhttp.onreadystatechange = function() {
							if (apps.messaging.vars.sendhttp.readyState !== 4) return;
							if (apps.messaging.vars.sendhttp.status === 200) {
								if (apps.messaging.vars.sendhttp.responseText === 'Error - Password incorrect.') {
									apps.prompt.vars.alert('Could not send message. Your password is incorrect.<br><br>If you recently set a new password, try to reset aOS and see if that fixes the issue. If the issue persists, please contact the developer via email.', 'Okay.', function() {}, 'Messaging');
								} else if (apps.messaging.vars.sendhttp.responseText.indexOf('Error - ') === 0) {
									apps.prompt.vars.alert('Error sending message:<br><br>' + apps.messaging.vars.sendhttp.responseText, 'Okay.', function() {}, 'Messaging');
								}
							} else {
								apps.prompt.vars.alert('Could not send message. Network error code ' + apps.messaging.vars.sendhttp.status + '.<br><br>Try again in a minute or so. If it still doesn\'t work, contact the developer via the  email.', 'Okay.', function() {}, 'Messaging');
							}
						}
						this.sendhttp.send(this.sendfd);
						getId("MSGinput").value = "";
					}
				}
				this.lastMessageTime = performance.now();
			},
			lastResponseObject: {},
			lastUserRecieved: '',
			needsScroll: false,
			notifPing: new Audio('messagingSounds/messagePing.wav'),
			objTypes: {
				img: function (str, param) {
					return '<img onclick="this.classList.toggle(\'MSGdivGrowPic\');this.parentNode.classList.toggle(\'MSGdivGrowPicParent\')" style="max-width:calc(100% - 6px);max-height:400px;padding-left:3px;padding-right:3px;" src="' + str + '">';
				},
				url: function (str, param) {
					if (str.indexOf('http://') !== 0 && str.indexOf('https://') !== 0 && str.indexOf('/') !== 0) {
						str = 'https://' + encodeURI(str);
					}
					return '<a target="_blank" href="' + str + '">' + str + '</a>';
				},
				b: function (str, param) {
					return '<b>' + str + '</b>';
				},
				i: function (str, param) {
					return '<i>' + str + '</i>';
				},
				u: function (str, param) {
					return '<u>' + str + '</u>';
				},
				br: function (param) {
					return '<br>';
				},
				hr: function (param) {
					return '<hr>';
				},
				font: function (str, param) {
					if (param) {
						return '<span style="font-family:' + param.split(';')[0] + ', monospace;">' + str + '</span>';
					} else {
						var strComma = str.indexOf(',');
						var strCommaSpace = str.indexOf(', ');
						var strSplit = '';
						if (strComma > -1) {
							if (strCommaSpace === strComma) {
								strSplit = str.split(', ');
								return '<span style="font-family:' + strSplit.shift().split(';')[0] + ', monospace;">' + strSplit.join(', ') + '</span>';
							} else {
								strSplit = str.split(',');
								return '<span style="font-family:' + strSplit.shift().split(';')[0] + ', monospace;">' + strSplit.join(',') + '</span>';
							}
						} else {
							return '[font]' + str + '[/font]';
						}
					}
				},
				color: function (str, param) {
					if (param) {
						return '<span style="color:' + param.split(';')[0] + ';">' + str + '</span>';
					} else {
						var strComma = str.indexOf(',');
						var strCommaSpace = str.indexOf(', ');
						var strSplit = '';
						if (strComma > -1) {
							if (strCommaSpace === strComma) {
								strSplit = str.split(', ');
								return '<span style="color:' + strSplit.shift().split(';')[0] + ';">' + strSplit.join(', ') + '</span>';
							} else {
								strSplit = str.split(',');
								return '<span style="color:' + strSplit.shift().split(';')[0] + ';">' + strSplit.join(',') + '</span>';
							}
						} else {
							return '[color]' + str + '[/color]';
						}
					}
				},
				marquee: function (str) {
					return buildMarquee(cleanStr(str));
				},
				glow: function (str, param) {
					if (param) {
						return '<span style="text-shadow:0 0 5px ' + param.split(';')[0].split(' ').join('') + ';">' + str + '</span>';
					} else {
						var strComma = str.indexOf(',');
						var strCommaSpace = str.indexOf(', ');
						var strSplit = '';
						if (strComma > -1) {
							if (strCommaSpace === strComma) {
								strSplit = str.split(', ');
								return '<span style="text-shadow:0 0 5px ' + strSplit.shift().split(';')[0].split(' ').join('') + ';">' + strSplit.join(', ') + '</span>';
							} else {
								strSplit = str.split(',');
								return '<span style="text-shadow:0 0 5px ' + strSplit.shift().split(';')[0].split(' ').join('') + ';">' + strSplit.join(',') + '</span>';
							}
						} else {
							return '[glow]' + str + '[/glow]';
						}
					}
				},
				outline: function (str, param) {
					if (param) {
						return '<span style="text-shadow:1px 0 0 ' + param.split(';')[0].split(' ').join('') + ', -1px 0 0 ' + param.split(';')[0].split(' ').join('') + ', 0 1px 0 ' + param.split(';')[0].split(' ').join('') + ', 0 -1px 0 ' + param.split(';')[0].split(' ').join('') + ';">' + str + '</span>';
					} else {
						var strComma = str.indexOf(',');
						var strCommaSpace = str.indexOf(', ');
						var strSplit = '';
						if (strComma > -1) {
							if (strCommaSpace === strComma) {
								strSplit = str.split(', ');
								strShift = strSplit.shift().split(';')[0].split(' ').join('');
								return '<span style="text-shadow:1px 0 0 ' + strShift + ', -1px 0 0 ' + strShift + ', 0 1px 0 ' + strShift + ', 0 -1px 0 ' + strShift + ';">' + strSplit.join(', ') + '</span>';
							} else {
								strSplit = str.split(',');
								strShift = strSplit.shift().split(';')[0].split(' ').join('');
								return '<span style="text-shadow:1px 0 0 ' + strShift + ', -1px 0 0 ' + strShift + ', 0 1px 0 ' + strShift + ', 0 -1px 0 ' + strShift + ';">' + strSplit.join(',') + '</span>';
							}
						} else {
							return '[outline]' + str + '[/outline]';
						}
					}
				},
				flip: function (str, param) {
					return '<div style="transform:rotate(180deg);display:inline-block;position:relative">' + str + '</div>';
				}
			},
			objSafe: {
				img: 0,
				url: 0,
				b: 1,
				i: 1,
				u: 1,
				br: 0,
				hr: 0,
				font: 1,
				color: 1,
				marquee: 1,
				glow: 1,
				outline: 1,
				flip: 1,
				//site: 0
			},
			objShort: {
				img: 0,
				url: 0,
				b: 0,
				i: 0,
				u: 0,
				br: 1,
				hr: 1,
				font: 0,
				color: 0,
				marquee: 0,
				glow: 0,
				outline: 0,
				flip: 0,
				//site: 0
			},
			objDesc: {
				img: 'Embed an image via URL.',
				url: 'Format your text as a clickable URL.',
				b: 'Format your text as bold.',
				i: 'Format your text as italics.',
				u: 'Format your text as underlined.',
				br: 'Insert a line break.',
				hr: 'Insert a horizontal line.',
				font: 'Format your text with a font.',
				color: 'Format your text with a color.',
				marquee: 'Format your text to scroll as a marquee.',
				glow: 'Format your text with a colorful glow.',
				outline: 'Format your text with an outline.',
				flip: 'Flip your text upside-down.',
				//site: 'Embed a website via URL'
			},
			objExamp: {
				img: '[img]https://aaronos.dev/AaronOS/appicons/aOS.png[/img]',
				url: '[url]https://duckduckgo.com[/url]',
				b: '[b]This is bold text.[/b]',
				i: '[i]This is italic text.[/i]',
				u: '[u]This is underlined text.[/u]',
				br: 'Hello[br]World',
				hr: 'Hello[hr]World',
				font: '[font=Comic Sans MS]This text has a custom font.[/font]',
				color: '[color=red]This is red text via name.[/color]<br><br>[color=#00AA00]This is green text via hex.[/color]',
				marquee: '[marquee]This is scrolling marquee text.[/marquee]',
				glow: '[glow=red]This is glowy red text.[/glow]',
				outline: '[outline=red]This is red outlined text.[/outline]',
				flip: '[flip]This is upside-down text.[/flip]',
				//site: '[site]https://bing.com[/site]'
			},
			parseBB: function (text, safe) {
				var tempIn = text;
				var tempPointer = tempIn.length - 6;
				while (tempPointer >= 0) {
					var nextObj = tempIn.indexOf('[', tempPointer);
					if (nextObj > -1) {
						var nextEnd = tempIn.indexOf(']', nextObj);
						if (nextEnd > -1) {
							var nextType = tempIn.toLowerCase().substring(nextObj + 1, nextEnd);
							var nextParam = 0;
							if (nextType.indexOf('=') > -1) {
								nextParam = nextType.split('=');
								nextType = nextParam.shift();
								nextParam = nextParam.join('=');
							}
							if (this.objTypes[nextType]) {
								if (this.objShort[nextType]) {
									if (!(safe && !this.objSafe[nextType])) {
										var newStr = this.objTypes[nextType](nextParam);
										tempIn = tempIn.substring(0, nextObj) + newStr + tempIn.substring(nextObj + 2 + nextType.length, tempIn.length);
									}
								} else {
									var nextClose = tempIn.toLowerCase().indexOf('[/' + nextType + ']', nextEnd);
									if (nextClose > -1) {
										if (!(safe && !this.objSafe[nextType])) {
											var replaceStr = tempIn.substring(nextEnd + 1, nextClose);
											var newStr = this.objTypes[nextType](replaceStr, nextParam);
											tempIn = tempIn.substring(0, nextObj) + newStr + tempIn.substring(nextClose + 3 + nextType.length, tempIn.length);
										}
									}
								}
							}
						}
					}
					tempPointer--;
				}
				return tempIn;
			},
			lastRecievedDate: "",
			lastRecievedTime: "",
			nextMessage: function (text) {
				m('reading from messaging server');
				if (text[0] === '{') {
					d(2, 'Recieving message');
					this.lastResponseText = text;
					this.lastResponseObject = JSON.parse(this.lastResponseText);
					this.lastMsgRecieved = this.lastResponseObject.l;
					this.needsScroll = (getId('MSGdiv').scrollTop + 600 >= getId('MSGdiv').scrollHeight);
					if (this.lastResponseObject.t) {
						var tempAddStr = "";
						if (this.lastResponseObject.n !== this.lastUserRecieved) {
							if (this.lastResponseObject.n.indexOf('{ADMIN}') === 0) {
								tempAddStr += '<div style="color:#0A0; position:static; width:80%; margin-left:10%; height:20px; font-family:monospace;">&nbsp;' + this.parseBB(this.lastResponseObject.n, 1) + ' <span style="color:transparent">' + this.lastResponseObject.l + '</span></div>';
								tempAddStr += '<div style="max-height:60%; overflow-y:auto; background-color:#CEA; position:static; padding-left:3px; padding-top:3px; padding-bottom:3px; border-radius:10px; color:#000; width:calc(80% - 3px); margin-left:10%; font-family:sans-serif;">';
								if (this.lastResponseObject.t !== this.lastRecievedTime) {
									tempAddStr += '<div style="width:10%;text-align:right;margin-left:-10%;color:#7F7F7F;font-size:12px;font-family:aosProFont,monospace">' + String(new Date(this.lastResponseObject.t - 0)).split(' ')[4] + '&nbsp;</div>';
								}
								if (String(new Date(this.lastResponseObject.t - 0)).split(' ').slice(1, 4).join(' ') !== this.lastRecievedDate) {
									tempAddStr += '<div style="width:10%;text-align:left;color:#7F7F7F;font-size:12px;font-family:aosProFont,monospace;margin-left:80%;">' + String(new Date(this.lastResponseObject.t - 0)).split(' ').slice(1, 4).join(' ') + '</div>';
								}
								tempAddStr += this.parseBB(this.lastResponseObject.c) + '</div>';
								getId('MSGdiv').innerHTML += tempAddStr;
							} else {
								tempAddStr += '<div style="color:#777; position:static; width:80%; margin-left:10%; height:20px; font-family:monospace;">&nbsp;' + this.parseBB(this.lastResponseObject.n, 1) + ' <span style="color:transparent">' + this.lastResponseObject.l + '</span></div>';
								tempAddStr += '<div style="max-height:60%; overflow-y:auto; background-color:#ACE; position:static; padding-left:3px; padding-top:3px; padding-bottom:3px; border-radius:10px; color:#000; width:calc(80% - 3px); margin-left:10%; font-family:sans-serif;">';
								if (this.lastResponseObject.t !== this.lastRecievedTime) {
									tempAddStr += '<div style="width:10%;text-align:right;margin-left:-10%;color:#7F7F7F;font-size:12px;font-family:aosProFont,monospace">' + String(new Date(this.lastResponseObject.t - 0)).split(' ')[4] + '&nbsp;</div>';
								}
								if (String(new Date(this.lastResponseObject.t - 0)).split(' ').slice(1, 4).join(' ') !== this.lastRecievedDate) {
									tempAddStr += '<div style="width:10%;text-align:left;color:#7F7F7F;font-size:12px;font-family:aosProFont,monospace;margin-left:80%;">' + String(new Date(this.lastResponseObject.t - 0)).split(' ').slice(1, 4).join(' ') + '</div>';
								}
								tempAddStr += this.parseBB(this.lastResponseObject.c) + '</div>';
								getId("MSGdiv").innerHTML += tempAddStr;
							}
						} else {
							getId('MSGdiv').innerHTML += '<div style="color:#777; position:static; width:80%; margin-left:10%; height:2px;"></div>';
							if (this.lastResponseObject.n.indexOf('{ADMIN}') === 0) {
								tempAddStr += '<div style="max-height:60%; overflow-y:auto; background-color:#CEA; position:static; padding-left:3px; padding-top:3px; padding-bottom:3px; border-radius:10px; color:#000; width:calc(80% - 3px); margin-left:10%; font-family:sans-serif;">';
								if (this.lastResponseObject.t !== this.lastRecievedTime) {
									tempAddStr += '<div style="width:10%;text-align:right;margin-left:-10%;color:#7F7F7F;font-size:12px;font-family:aosProFont,monospace">' + String(new Date(this.lastResponseObject.t - 0)).split(' ')[4] + '&nbsp;</div>';
								}
								if (String(new Date(this.lastResponseObject.t - 0)).split(' ').slice(1, 4).join(' ') !== this.lastRecievedDate) {
									tempAddStr += '<div style="width:10%;text-align:left;color:#7F7F7F;font-size:12px;font-family:aosProFont,monospace;margin-left:80%;">' + String(new Date(this.lastResponseObject.t - 0)).split(' ').slice(1, 4).join(' ') + '</div>';
								}
								tempAddStr += this.parseBB(this.lastResponseObject.c) + '</div>';
								getId("MSGdiv").innerHTML += tempAddStr;
							} else {
								tempAddStr += '<div style="max-height:60%; overflow-y:auto; background-color:#ACE; position:static; padding-left:3px; padding-top:3px; padding-bottom:3px; border-radius:10px; color:#000; width:calc(80% - 3px); margin-left:10%; font-family:sans-serif;">';
								if (this.lastResponseObject.t !== this.lastRecievedTime) {
									tempAddStr += '<div style="width:10%;text-align:right;margin-left:-10%;color:#7F7F7F;font-size:12px;font-family:aosProFont,monospace">' + String(new Date(this.lastResponseObject.t - 0)).split(' ')[4] + '&nbsp;</div>';
								}
								if (String(new Date(this.lastResponseObject.t - 0)).split(' ').slice(1, 4).join(' ') !== this.lastRecievedDate) {
									tempAddStr += '<div style="width:10%;text-align:left;color:#7F7F7F;font-size:12px;font-family:aosProFont,monospace;margin-left:80%;">' + String(new Date(this.lastResponseObject.t - 0)).split(' ').slice(1, 4).join(' ') + '</div>';
								}
								tempAddStr += this.parseBB(this.lastResponseObject.c) + '</div>';
								getId("MSGdiv").innerHTML += tempAddStr;
							}
						}
						this.lastRecievedDate = String(new Date(this.lastResponseObject.t - 0)).split(' ').slice(1, 4).join(' ');
						this.lastRecievedTime = this.lastResponseObject.t;
					} else {
						if (this.lastResponseObject.n !== this.lastUserRecieved) {
							if (this.lastResponseObject.n.indexOf('{ADMIN}') === 0) {
								getId('MSGdiv').innerHTML += '<div style="color:#0A0; position:static; width:80%; margin-left:10%; height:20px; font-family:monospace;">&nbsp;' + this.lastResponseObject.n + '</div>';
								getId('MSGdiv').innerHTML += '<div style="max-height:60%; overflow-y:auto; background-color:#CEA; position:static; padding-top:3px; padding-bottom:3px; border-radius:10px; color:#000; width:80%; margin-left:10%; font-family:monospace;">' + this.lastResponseObject.c.split('[IMG]').join('<img style="max-width:100%" src="').split('[/IMG]').join('">') + '</div>';
							} else {
								getId('MSGdiv').innerHTML += '<div style="color:#777; position:static; width:80%; margin-left:10%; height:20px; font-family:monospace;">&nbsp;' + this.lastResponseObject.n + '</div>';
								getId('MSGdiv').innerHTML += '<div style="max-height:60%; overflow-y:auto; background-color:#ACE; position:static; padding-top:3px; padding-bottom:3px; border-radius:10px; color:#000; width:80%; margin-left:10%; font-family:monospace;">' + this.lastResponseObject.c.split('[IMG]').join('<img style="max-width:100%" src="').split('[/IMG]').join('">') + '</div>';
							}
						} else {
							getId('MSGdiv').innerHTML += '<div style="color:#777; position:static; width:80%; margin-left:10%; height:2px;"></div>';
							if (this.lastResponseObject.n.indexOf('{ADMIN}') === 0) {
								getId('MSGdiv').innerHTML += '<div style="max-height:60%; overflow-y:auto; background-color:#CEA; position:static; padding-top:3px; padding-bottom:3px; border-radius:10px; color:#000; width:80%; margin-left:10%; font-family:monospace;">' + this.lastResponseObject.c.split('[IMG]').join('<img style="max-width:100%" src="').split('[/IMG]').join('">') + '</div>';
							} else {
								getId('MSGdiv').innerHTML += '<div style="max-height:60%; overflow-y:auto; background-color:#ACE; position:static; padding-top:3px; padding-bottom:3px; border-radius:10px; color:#000; width:80%; margin-left:10%; font-family:monospace;">' + this.lastResponseObject.c.split('[IMG]').join('<img style="max-width:100%" src="').split('[/IMG]').join('">') + '</div>';
							}
						}
					}
					this.lastUserRecieved = this.lastResponseObject.n;
					if (this.needsScroll) {
						getId('MSGdiv').scrollTop = getId('MSGdiv').scrollHeight;
					}
					if (!document.hasFocus() || getId('win_messaging_top').style.display === 'none') {
						this.notifPing.play();
						if (getId('win_messaging_top').style.display === 'none') {
							apps.prompt.vars.notify(apps.messaging.vars.parseBB(this.lastResponseObject.n, 1) + ' said:<br><br>' + this.parseBB(this.lastResponseObject.c),
								['Show App', 'Dismiss'],
								function (btn) {
									if (btn === 0) {
										openapp(apps.messaging, 'tskbr');
									}
								},
								'Messaging',
								'appicons/ds/MSG.png'
							);
						}
					}
					apps.messaging.vars.xhttpDelay = window.setTimeout('apps.messaging.vars.requestMessage()', 10);
				} else {
					apps.messaging.vars.xhttpDelay = window.setTimeout('apps.messaging.vars.requestMessage()', 1000);
				}
			},
			lastResponseTime: 0,
			requestMessage: function() {
				this.xhttp = new XMLHttpRequest();
				this.xhttp.onreadystatechange = function() {
					if (apps.messaging.vars.xhttp.readyState === 4) {
						apps.savemaster.vars.saving = 0;
						taskbarShowHardware();
						if (apps.messaging.vars.xhttp.status === 200) {
							apps.messaging.vars.lastResponseTime = perfCheck('messagingServer');
							if (apps.messaging.appWindow.appIcon) {
								apps.messaging.vars.nextMessage(apps.messaging.vars.xhttp.responseText);
							}
						} else {
							apps.prompt.vars.notify('Connection to messaging server lost.', [], function() {}, 'Messaging Error', 'appicons/ds/MSG.png');
						}
					}
				};
				this.xhttp.open("GET", "messaging.php?l=" + this.lastMsgRecieved, true);
				perfStart('messagingServer');
				this.xhttp.send();
				apps.savemaster.vars.saving = 3;
				taskbarShowHardware();
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
						if (ufload("aos_system/apps/messaging/chat_name")) {
							apps.messaging.vars.name = ufload("aos_system/apps/messaging/chat_name");
						}
						break;
					case 'shutdown':

						break;
					default:
						doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'", "#F00");
			}
		}
	});

	getId('aOSloadingInfo').innerHTML = 'Music Player';
});

/* MUSIC PLAYER */
c(function() {
	m('init MSC');
	apps.musicPlayer = new Application({
		title: "Music Player",
		abbreviation: "MPl",
		codeName: "musicPlayer",
		image: {
			backgroundColor: "#303947",
			foreground: "smarticons/musicPlayer/fg.png",
			backgroundBorder: {
				thickness: 2,
				color: "#252F3A"
			}
		},
		hideApp: 0,
		main: function() {
			if (!this.appWindow.appIcon) {
				this.appWindow.paddingMode(0);
				this.appWindow.setContent(`
					<iframe
						data-parent-app="musicPlayer"
						id="MPlframe"
						onload="apps.musicPlayer.vars.updateStyle()"
						style="border:none; display:block; width:100%; height:100%; overflow:hidden;"
						src="./Music/index.html"
					></iframe>`
				);
				requestAnimationFrame(this.vars.colorWindows);
				getId("icn_musicPlayer").style.display = "inline-block";
				requestAnimationFrame(() => {
					this.appWindow.appIcon = 1;
					this.vars.colorWindows();
				});
			}
			this.appWindow.setCaption('Music Player');
			// MUSIC PLAYER DIMENSIONS
			this.appWindow.setDims("auto", "auto", 600, 350);
			blockScreensaver("apps.musicVis");
			if (this.appWindow.appIcon) {
				this.appWindow.openWindow();
			}
		},
		vars: {
			appInfo: 'This is the official AaronOS Music Player. Select a folder of songs to loop through.',
			updateStyle: function() {},
			colorModified: 0,
			colorWindows: function() {
				if (apps.musicPlayer.appWindow.appIcon) {
					let MPlTitle = getId("MPlframe").contentDocument.title;
					if (MPlTitle.indexOf("WindowRecolor:") === 0) {
						apps.settings.vars.setWinColor(1, MPlTitle.split(":")[1]);
						if (!this.colorModified) this.colorModified = 1;
					} else if (this.colorModified) {
						apps.settings.vars.setWinColor(1, ufload("aos_system/windows/border_color") || 'rgba(150, 150, 200, 0.5)');
						this.colorModified = 0;
					}
					requestAnimationFrame(apps.musicPlayer.vars.colorWindows);
				} else if (this.colorModified) {
					apps.settings.vars.setWinColor(1, ufload("aos_system/windows/border_color") || 'rgba(150, 150, 200, 0.5)');
					this.colorModified = 0;
				}
			}
		}
	});

	getId('aOSloadingInfo').innerHTML = 'Apps Browser';
});

c(function() {
	apps.appsbrowser = new Application({
		title: "Apps Browser",
		abbreviation: "APB",
		codeName: "appsbrowser",
		image: {
			backgroundColor: "#303947",
			foreground: "smarticons/appsbrowser/fg.png",
			backgroundBorder: {
				thickness: 2,
				color: "#252F3A"
			}
		},
		hideApp: 1,
		main: function() {
			if (!this.appWindow.appIcon) {
				this.appWindow.paddingMode(0);
				this.appWindow.setDims("auto", "auto", 400, 500);
				this.appWindow.setCaption('Apps Browser');
				this.appWindow.setContent(
					'<div id="APBdiv" class="darkResponsive" style="width:100%;height:100%;overflow-y:auto;font-family:aosProFont;">' +
					'<div class="noselect" style="overflow-y:auto;font-size:12px;width:100%;height:40px;border-bottom:1px solid;position:relative;">' +
					'&nbsp;List of all applications installed on AaronOS.<br>' +
					'&nbsp;<input class="canselect" placeholder="Search" onkeyup="apps.appsbrowser.vars.search(this.value)">' +
					'</div></div>');
				this.vars.appsListed = 1;
				for (var appHandle in appsSorted) {
					var app = appsSorted[appHandle];
					this.vars.currAppImg = apps[app].appWindow.appImg;
					this.vars.currAppIcon = apps[app].dsktpIcon;
					this.vars.currAppName = apps[app].appDesc;
					if (apps[app].keepOffDesktop === 0) {
						this.vars.currAppDesktop = 'Available On Desktop';
					} else {
						this.vars.currAppDesktop = 'Not On Desktop';
					}
					if (apps[app].keepOffDesktop < 2) {
						this.vars.currAppOnList = 'Available In Apps List';
					} else {
						this.vars.currAppOnList = 'Not In Apps List';
					}
					if (apps[app].appWindow.onTop) {
						this.vars.currAppOnTop = 'Always On Top<br>';
					} else {
						this.vars.currAppOnTop = '';
					}
					if (ufload('aos_system/apm_apps/app_' + app)) {
						this.vars.currAppBuiltIn = 'User-Made App';
					} else if (ufload('aos_system/wap_apps/' + app)) {
						this.vars.currAppBuiltIn = 'User-Made Web App';
					} else if (app.indexOf('webApp_') === 0) {
						this.vars.currAppBuiltIn = 'Repository App from<br>' + app.substring(7).split('__')[0];
					} else {
						this.vars.currAppBuiltIn = 'Built-In aOS App';
					}
					getId("APBdiv").innerHTML += '<div id="APBapp_' + app + '" class="appsBrowserItem cursorPointer darkResponsive" onclick="c(function(){openapp(apps.' + app + ', \'dsktp\')});" ' +
						'style="padding-top:1px;padding-bottom:1px;position:relative;height:128px;width:100%;border-bottom:1px solid;" ' +
						'oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/window.png\', \'ctxMenu/beta/window.png\', \'ctxMenu/beta/file.png\', \'ctxMenu/beta/folder.png\', \'ctxMenu/beta/file.png\'], ' +
						'\' Open App\', \'c(function(){openapp(apps.' + app + ', \\\'dsktp\\\')})\', ' +
						'\' Open App via Taskbar\', \'c(function(){openapp(apps.' + app + ', \\\'tskbr\\\')})\', ' +
						'\'+About This App\', \'c(function(){openapp(apps.appInfo, \\\'' + app + '\\\')})\',  ' +
						'\' View Files\', \'c(function(){openapp(apps.files2, \\\'dsktp\\\');c(function(){apps.files2.vars.next(\\\'apps/\\\');apps.files2.vars.next(\\\'' + app + '/\\\')})})\'' +
						function (appname, builtin) {
							if (builtin === "User-Made App") {
								return ', \' Open Source File\', \'c(function(){openapp(apps.notepad2, \\\'open\\\');apps.notepad2.vars.openFile(\\\'aos_system/apm_apps/app_' + appname + '\\\')})\'';
							} else if (builtin === "User-Made Web App") {
								return ', \' Open Source File\', \'c(function(){openapp(apps.notepad2, \\\'open\\\');apps.notepad2.vars.openFile(\\\'aos_system/wap_apps/' + appname + '\\\')})\'';
							} else {
								return ''
							}
						}(app, this.vars.currAppBuiltIn) + ']);">' + buildSmartIcon(128, this.vars.currAppImg, "margin-left:1px;") +
						'<div class="APB_app_content" style="font-size:24px;left:132px;top:calc(50% - 1em);">' + this.vars.currAppName + '</div>' +
						'<div class="APB_app_content darkResponsive" style="opacity:0.75;background:none;left:132px;top:4px;font-size:12px;text-align:right">apps.' + app + '</div>' +
						'<div class="darkResponsive" style="opacity:0.75;background:none;font-size:12px;right:4px;bottom:4px;text-align:right">' + this.vars.currAppBuiltIn + '</div>' +
						'<div class="APB_app_content darkResponsive"style="opacity:0.75;background:none;font-size:12px;left:132px;bottom:4px;">' + this.vars.currAppIcon + '</div></div>';

					this.vars.appsListed++;
				}
			}
			this.appWindow.openWindow();
		},
		vars: {
			appInfo: 'Use this app to browse through every app installed on the aOS system, including internal system apps.',
			appsListed: 1,
			currAppImg: '',
			currAppIcon: '',
			currAppName: '',
			currAppDesktop: '',
			currAppOnList: '',
			currAppLaunchTypes: '',
			currAppBuiltIn: '',
			search: function (text) {
				let allDivs = getId("APBdiv").getElementsByClassName('appsBrowserItem');
				let textSplit = text.toLowerCase().split(" ");
				for (let i = 0; i < allDivs.length; i++) {
					let isVisible = false;
					let texts = allDivs[i].getElementsByClassName("APB_app_content");
					for (let txt = 0; txt < texts.length; txt++) {
						let textFound = 0;
						for (let j in textSplit) {
							if (texts[txt].innerText.toLowerCase().indexOf(textSplit[j]) > -1) {
								textFound++;
							}
						}
						if (textFound === textSplit.length) {
							isVisible = 1;
							break;
						}
					}
					if (isVisible) {
						allDivs[i].style.display = "";
					} else {
						allDivs[i].style.display = "none";
					}
				}
			}
		}
	});
	getId('aOSloadingInfo').innerHTML = 'Sticky Note';
});

/* STICKY NOTE */
c(function() {
	apps.postit = new Application({
		title: "Sticky Note",
		abbreviation: "SNt",
		codeName: "postit",
		image: {
			backgroundColor: "#303947",
			foreground: "smarticons/postit/fg.png",
			backgroundBorder: {
				thickness: 2,
				color: "#252F3A"
			}
		},
		hideApp: 1,
		main: function() {
			const margins = 15;
			const width = 250;
			const height = 150;
			const x = parseInt(getId("desktop").style.width) - width - margins;
			
			this.appWindow.setCaption('Sticky Note');
			if (!this.appWindow.appIcon) {
				this.appWindow.alwaysOnTop(1);
				this.appWindow.paddingMode(0);
				this.appWindow.setDims(x, margins, width, height);
				this.appWindow.setContent('<textarea id="stickyNotePad" onblur="apps.postit.vars.savePost()" style="padding:0;color:#000;font-family:Comic Sans MS;font-weight:bold;border:none;resize:none;display:block;width:100%;height:100%;background-color:#FF7;"></textarea>');
				if (ufload("aos_system/apps/postit/saved_note")) {
					getId('stickyNotePad').value = ufload("aos_system/apps/postit/saved_note");
				}
				this.appWindow.alwaysOnTop(1);
			}
			this.appWindow.openWindow();
		},
		vars: {
			appInfo: 'Simple stickynote that stays above other apps on your screen. The contents are saved across reboots.',
			savePost: function() {
				if (apps.postit.appWindow.appIcon) {
					apps.savemaster.vars.save('aos_system/apps/postit/saved_note', getId('stickyNotePad').value, 1);
				}
			}
		}
	});
	getId('aOSloadingInfo').innerHTML = 'Bootscript App';
});

/* BOOT SCRIPT */
c(function() {
	apps.bootScript = new Application({
		title: "Boot Script Editor",
		abbreviation: "BtS",
		codeName: "bootScript",
		image: 'appicons/ds/BtS.png',
		hideApp: 1,
		main: function() {
			if (!this.appWindow.appIcon) {
				this.appWindow.paddingMode(0);
				this.appWindow.setDims("auto", "auto", 701, 400);
				this.appWindow.setCaption('Boot Script Editor');
				this.appWindow.setContent(
					'<div id="BtS_scripts" class="noselect" style="width:40%;overflow-y:scroll;height:calc(100% - 2em + 8px)"></div>' +
					'<iframe id="BtS_edit_frame" data-parent-app="bootScript" src="ace/scriptEdit.html" onload="apps.bootScript.vars.openScript(\'main\');" style="position:absolute; right:0; padding:0; border:none; width:60%; height:calc(100% - 2em + 8px);"></iframe>' +
					'<div style="bottom:0;width:100%;">' +
					'<button style="position:relative;width:40%;height:calc(2em - 3px);" onclick="apps.bootScript.vars.newScript()">New Script</button>' +
					'<button style="float:right;width:30%;height:calc(2em - 3px);" onclick="apps.bootScript.vars.saveBootScript()">Save</button>' +
					'<button style="float:right;width:30%;height:calc(2em - 3px);" onclick="apps.bootScript.vars.helpBootScript()">Help</button>' +
					'</div>'
				);
				this.vars.listScripts();
			}
			this.appWindow.openWindow();
		},
		vars: {
			appInfo: 'This app runs your own custom JavaScript code just after aOS boots, just before the loading screen disappears. Any JS code will work here - mod aOS to your heart\'s content!<br><br>If you created something you would wish to be featured in aOS, please tell the developer so he can take a look!',
			bootScriptsToEvaluate: {
				repo: {

				},
				user: {

				}
			},
			doBootScript: function() {
				for (var i in installedPackages) {
					for (var j in installedPackages[i]) {
						if (installedPackages[i][j].appType === "bootscript") {
							try {
								apps.bootScript.vars.bootScriptsToEvaluate.repo[i + "_" + j] = {
									BOOT_SCRIPT_CODE: new Function(installedPackages[i][j].scriptContent)
								};
								apps.bootScript.vars.bootScriptsToEvaluate.repo[i + "_" + j].BOOT_SCRIPT_CODE();
							} catch (err) {
								doLog("aOS Hub Boot Script Error<br>Script: " + i + "." + j + "<br>" + err, "#F00");
								apps.prompt.vars.notify(
									"There was an error in one of your aOS Hub Boot Scripts (" + (i + "." + j) + "):<br><br>" + err,
									["Dismiss", "View in aOS Hub"],
									function (btn) {
										if (btn === 1) {
											openapp(apps.appCenter, "dsktp");
											apps.appCenter.vars.doSearch(i + "." + j);
										}
									},
									"Boot Script Error",
									"appicons/ds/BtS.png"
								);
							}
						}
					}
				}
				if (ufload("aos_system/user_boot_script")) {
					doLog("moving user bootscript to new folder");
					var theBootScript = ufload("aos_system/user_boot_script");
					ufsave("aos_system/apps/bootScript/main", theBootScript);
					ufdel("aos_system/user_boot_script");
				}
				var bootScripts = ufload("aos_system/apps/bootScript");
				for (var i in bootScripts) {
					try {
						apps.bootScript.vars.bootScriptsToEvaluate.user[i] = {
							BOOT_SCRIPT_CODE: new Function(bootScripts[i])
						};
						apps.bootScript.vars.bootScriptsToEvaluate.user[i].BOOT_SCRIPT_CODE();
					} catch (err) {
						doLog("Boot Script Error<br>Script: " + i + "<br>" + err, "#F00");
						apps.prompt.vars.notify(
							"There was an error in one of your Boot Scripts (" + i + "):<br><br>" + err,
							["Dismiss", "Debug"],
							function (btn) {
								if (btn === 1) {
									openapp(apps.jsConsole, "dsktp");
									openapp(apps.bootScript, "dsktp");
									apps.bootScript.vars.openScript(i);
								}
							},
							"Boot Script Error",
							"appicons/ds/BtS.png"
						);
					}
				}
			},
			currScript: 'main',
			openScript: function (scriptName) {
				if (ufload("aos_system/apps/bootScript/" + scriptName)) {
					if (
						ufload('aos_system/apps/bootScript/' + cleanStr(this.currScript)) !== getId("BtS_edit_frame").contentWindow.editor.getValue() &&
						getId("BtS_edit_frame").contentWindow.editor.getValue() !== ""
					) {
						apps.prompt.vars.confirm(
							"The current changes are NOT saved! Are you sure you want to load a different file?",
							["Cancel", "Load &amp; Lose Changes"],
							(btn) => {
								if (btn) {
									this.currScript = scriptName;
									var allScripts = document.getElementsByClassName('BtS_script');
									for (var i = 0; i < allScripts.length; i++) {
										allScripts[i].style.color = '';
									}
									getId("BtS_edit_frame").contentWindow.editor.session.setValue(ufload("aos_system/apps/bootScript/" + cleanStr(scriptName)));
									getId('BtS_edit_frame').contentWindow.editor.scrollToLine(0);
									getId("BtS_script_" + scriptName).style.color = "#0AA";
								}
							},
							"Boot Script Editor"
						)
					} else {
						this.currScript = scriptName;
						var allScripts = document.getElementsByClassName('BtS_script');
						for (var i = 0; i < allScripts.length; i++) {
							allScripts[i].style.color = '';
						}
						getId("BtS_edit_frame").contentWindow.editor.session.setValue(ufload("aos_system/apps/bootScript/" + cleanStr(scriptName)));
						getId('BtS_edit_frame').contentWindow.editor.scrollToLine(0);
						getId("BtS_script_" + scriptName).style.color = "#0AA";
					}
				}
			},
			newScript: function() {
				apps.prompt.vars.prompt("Please enter a name for the new script.<br><br>Leave blank to cancel.", "Submit", function (str) {
					if (str) {
						if (!ufload("aos_system/apps/bootScript").hasOwnProperty(cleanStr(str))) {
							apps.bootScript.vars.createScript(str);
						} else {
							apps.prompt.vars.alert("There is already a boot script with that name.", "Okay", function() {}, "Boot Script Editor");
						}
					}
				}, "Boot Script Editor");
			},
			createScript: function (name) {
				ufsave("aos_system/apps/bootScript/" + cleanStr(name), "// AaronOS Boot Script");
				this.listScripts();
				this.openScript(cleanStr(name));
			},
			delScript: function (name) {
				ufdel("aos_system/apps/bootScript/" + name);
				this.listScripts();
				this.openScript("main");
			},
			listScripts: function() {
				var allScripts = ufload("aos_system/apps/bootScript");
				var finalHTML = "<br>";
				finalHTML += "<span class='BtS_script' id='BtS_script_main'>main</span> <button onclick='apps.bootScript.vars.openScript(\"main\")'>Load</button>";
				for (var i in allScripts) {
					if (i !== "main") {
						finalHTML += "<br><br><span class='BtS_script' id='BtS_script_" + i + "'>" + i + "</span> <button onclick='apps.bootScript.vars.openScript(\"" + i + "\")'>Load</button> <button onclick='apps.bootScript.vars.delScript(\"" + i + "\")'>Delete</button>";
					}
				}
				getId("BtS_scripts").innerHTML = finalHTML;
			},
			saveBootScript: function() {
				ufsave('aos_system/apps/bootScript/' + this.currScript, getId('BtS_edit_frame').contentWindow.editor.getValue());
			},
			helpBootScript: function() {
				apps.prompt.vars.alert('WARNING - ADVANCED USERS ONLY<br>The Bootscript is your very own script to run on OS boot. Use it for useful things like... well, I can\'t think of anything. Here you are though.<br><br>BootScript will run your script one millisecond after the OS finishes loading your userfiles.<br><br>Save all variables for your script inside the \'this\' object. Example... this.myVar = 9000.1;<br><br>Bootscripts are written in JavaScript. Use the aOS API and assume that your script lives inside of an app\'s vars... (<b>apps.theoreticalApp.vars</b> <-- your script theoretically here) Check the aOS API doc for reference to what this means.<br><br>Your bootscript is NOT AN APP and has no window. Trying to call anything within this.appWindow WILL result in an error!', 'Okay, thanks.', function() {}, 'Boot Script');
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
						if (!safeMode) {
							window.setTimeout(apps.bootScript.vars.doBootScript, 1);
						} else {
							doLog('Refusing to run BootScripts because SafeMode is on.', "#F00");
						}
						break;
					case 'shutdown':

						break;
					default:
						doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'", "#F00");
			}
		}
	});
});

c(function() {
	apps.appCenter = new Application({
		title: "aOS Hub",
		abbreviation: "AH",
		codeName: "appCenter",
		image: {
			backgroundColor: "#303947",
			foreground: "smarticons/appCenter/fg.png",
			backgroundBorder: {
				thickness: 2,
				color: "#252F3A"
			}
		},
		hideApp: 0,
		launchTypes: 1,
		main: function (launchtype) {
			if (!this.appWindow.appIcon) {
				this.appWindow.setCaption("aOS Hub");
				this.appWindow.setDims("auto", "auto", 600, 400);
				this.appWindow.setContent(
					"<div style='position:relative;padding-top:3px;' id='APPCENTER_maindiv' class='noselect'>" +
					"<span id='APPCENTER_updates'>Checking for</span> available updates.<br>" +
					"<button onclick='apps.appCenter.vars.showUpdates()'>Updates</button><br>" +
					"<b><span id='APPCENTER_NOTICE' style='color:#A00'></span></b><br>" +
					"<div style='position:absolute;right:3px;line-height:1.5em;top:0;text-align:right'>" +
					"<input placeholder='Search' onkeyup='apps.appCenter.vars.doSearch(this.value)' id='APPCENTER_SEARCH'><br>" +
					"<button onclick='apps.appCenter.vars.listRepos()'>Repositories</button><br>" +
					"<button onclick='apps.appCenter.vars.checkUpdates()'>Refresh</button>" +
					"</div>" +
					"<div style='position:relative;text-align:center;margin-top:12px' id='APPCENTER_categories'></div>" +
					"<div style='position:relative;width:100%;min-height:20px;' id='APPCENTER_packages' class='canselect'></div>" +
					"</div>"
				);
				this.vars.listCategories();
				this.vars.setCategory('All');
				if (launchtype === "updates") {
					this.vars.checkUpdates(1);
				} else {
					this.vars.checkUpdates();
				}
				getId("win_appCenter_html").style.overflowY = "scroll";
			}
			this.appWindow.openWindow();
		},
		vars: {
			appInfo: 'aOS Hub is a GUI front-end for the aOS repository and package system.',
			previousScrollPoint: 0,
			displayUpdates: function (updateScreen) {
				getId("APPCENTER_updates").innerHTML = repoGetUpgradeable().length;
				if (!updateScreen || typeof updateScreen === "string") {
					apps.appCenter.vars.listAll();
				}
				apps.appCenter.vars.doSearch(getId("APPCENTER_SEARCH").value);
				getId("win_appCenter_html").scrollTop = apps.appCenter.vars.previousScrollPoint;
			},
			listCategories: function() {
				var currHTML = "";
				for (var i in this.categories) {
					currHTML += "<div class='cursorPointer' id='APPCENTER_CATEGORYSEARCH_" + i + "' style='position:relative;display:inline-block;padding:8px;padding-bottom:3px;padding-top:5px;margin-bottom:-4px;' onclick='apps.appCenter.vars.setCategory(\"" + i + "\")'>" + i + "</div>";
				}
				getId("APPCENTER_categories").innerHTML = currHTML;
			},
			setCategory: function (newCategory) {
				this.currCategorySearch = newCategory;
				for (var i = 0; i < getId('APPCENTER_categories').childNodes.length; i++) {
					try {
						getId("APPCENTER_categories").childNodes[i].style.background = '';
					} catch (err) {

					}
				}
				getId("APPCENTER_CATEGORYSEARCH_" + newCategory).style.background = 'rgba(127, 127, 127, 0.5)';
				this.listAll();
				this.doSearch(getId("APPCENTER_SEARCH").value);
			},
			currCategorySearch: "All",
			categories: {
				"All": "",
				"Apps": "App",
				"Styles": "stylesheet",
				"Scripts": "bootscript",
				//"Widgets": "widget"
			},
			doSearch: function (searchQuery) {
				for (var i = 0; i < getId("APPCENTER_packages").childNodes.length; i++) {
					if (getId("APPCENTER_packages").childNodes[i].id !== "APPCENTER_UPDATE_CONTROLS") {
						if (getId("APPCENTER_packages").childNodes[i].innerText.toLowerCase().indexOf(searchQuery.toLowerCase()) === -1) {
							getId("APPCENTER_packages").childNodes[i].style.display = "none";
						} else {
							getId("APPCENTER_packages").childNodes[i].style.display = "block";
						}
					}
				}
			},
			checkUpdates: function (updateScreen) {
				if (updateScreen) {
					repoUpdate(null, this.showUpdates);
				} else {
					repoUpdate(null, this.displayUpdates);
				}
			},
			applyUpdates: function() {
				repoUpgrade(null, this.showUpdates);
			},
			install: function (buttonElement) {
				apps.appCenter.vars.previousScrollPoint = getId("win_appCenter_html").scrollTop;
				if (repositories[repositoryIDs[buttonElement.getAttribute("data-appcenter-repo")]].packages[buttonElement.getAttribute("data-appcenter-package")].packageType === 'bootscript') {
					apps.prompt.vars.confirm("Use caution! Make sure you trust the developer of boot scripts; they can access all of your data and perform actions on your behalf.", ["Cancel", "Install"], (choice) => {
						if (choice) {
							repoAddPackage(buttonElement.getAttribute("data-appcenter-repo") + "." + buttonElement.getAttribute("data-appcenter-package"), null, apps.appCenter.vars.displayUpdates);
						}
					}, "AaronOS Hub");
				} else {
					repoAddPackage(buttonElement.getAttribute("data-appcenter-repo") + "." + buttonElement.getAttribute("data-appcenter-package"), null, apps.appCenter.vars.displayUpdates);
				}
			},
			uninstall: function (buttonElement) {
				apps.appCenter.vars.previousScrollPoint = getId("win_appCenter_html").scrollTop;
				repoRemovePackage(buttonElement.getAttribute("data-appcenter-repo") + "." + buttonElement.getAttribute("data-appcenter-package"), apps.appCenter.vars.displayUpdates);
			},
			listAll: function() {
				var packageList = [];
				for (var repo in repositories) {
					for (var package in repositories[repo].packages) {
						packageList.push([repositories[repo].packages[package].packageName, repo, package]);
					}
				}
				packageList.sort(function (a, b) {
					if (a[0] < b[0]) {
						return -1;
					}
					if (a[0] > b[0]) {
						return 1;
					}
					return 0;
				});
				var finalhtml = "";
				for (var i in packageList) {
					var selectedPackage = repositories[packageList[i][1]].packages[packageList[i][2]];
					if (selectedPackage.packageType.indexOf(apps.appCenter.vars.categories[apps.appCenter.vars.currCategorySearch]) !== -1) {
						finalhtml += "<div style='position:relative;width:calc(100% - 35px);min-height:128px;padding:16px;border-top:2px solid #7F7F7F;'>";
						finalhtml += "<div style='position:relative;height:128px;width:128px;'>" + buildSmartIcon(128, selectedPackage.icon) + "</div><div style='position:relative;width:calc(100% - 144px);margin-left:160px;margin-top:-128px;'>"
						finalhtml += "<b>" + selectedPackage.packageName + " <span id='APPCENTER_NOTICE_" + repositories[packageList[i][1]].repoID + "_" + packageList[i][2] + "' style='color:#A00'></span></b><br>" +
							"<span style='font-family:aosProFont, monospace; font-size:12px'>" + repositories[packageList[i][1]].repoID + "." + selectedPackage.packageID + "</span><br>" +
							(selectedPackage.description || "No Description.").split("\n").join("<br>");
						finalhtml += "<br><br></div><div style='right:16px;text-align:right;bottom:16px;'>"
						if (installedPackages.hasOwnProperty(repositories[packageList[i][1]].repoID)) {
							if (installedPackages[repositories[packageList[i][1]].repoID].hasOwnProperty(selectedPackage.packageID)) {
								if (selectedPackage.packageType === "webApp") {
									if (apps.hasOwnProperty("webApp_" + repositories[packageList[i][1]].repoID + "__" + selectedPackage.packageID)) {
										finalhtml += "<button onclick='c(function(){openapp(apps.webApp_" + repositories[packageList[i][1]].repoID + "__" + selectedPackage.packageID + ", \"dsktp\");});'>Launch</button> ";
									}
								}
								finalhtml += "<button data-appcenter-repo='" + repositories[packageList[i][1]].repoID + "' data-appcenter-package='" + packageList[i][2] + "' onclick='apps.appCenter.vars.uninstall(this)'>Uninstall</button>";
							} else {
								finalhtml += "<button data-appcenter-repo='" + repositories[packageList[i][1]].repoID + "' data-appcenter-package='" + packageList[i][2] + "' onclick='apps.appCenter.vars.install(this)'>Install</button>";
							}
						} else {
							finalhtml += "<button data-appcenter-repo='" + repositories[packageList[i][1]].repoID + "' data-appcenter-package='" + packageList[i][2] + "' onclick='apps.appCenter.vars.install(this)'>Install</button>";
						}
						finalhtml += "</div></div>";
					}
				}
				getId("APPCENTER_packages").innerHTML = finalhtml;
				getId("win_appCenter_html").scrollTop = apps.appCenter.vars.previousScrollPoint;
			},
			listRepos: function() {
				try {
					for (var i = 0; i < getId('APPCENTER_categories').childNodes.length; i++) {
						try {
							getId("APPCENTER_categories").childNodes[i].style.background = '';
						} catch (err) {

						}
					}
				} catch (err) {

				}
				var finalhtml = '';
				for (var repo in repositories) {
					finalhtml += "<div style='position:relative;width:calc(100% - 35px);padding:16px;border-top:2px solid #7F7F7F;'>" +
						"<b>" + repositories[repo].repoName + "</b><br>" +
						"<span style='font-family:aosProFont, monospace; font-size:12px'>" + repositories[repo].repoID + "</span><br><br>" +
						repo + "<br><br>" +
						"<div style='right:16px;text-align:right;bottom:16px;'>";
					finalhtml += '<button data-appcenter-repo="' + repo + '" onclick="apps.appCenter.vars.removeRepo(this)">Remove</button>' +
						'</div></div>';
				}
				finalhtml += "<div style='position:relative;width:calc(100% - 35px);padding:16px;border-top:2px solid #7F7F7F;'>" +
					"<p>Add a new repository:</p>" +
					"<input id='APPCENTER_ADD_REPO' placeholder='https://'> <button onclick='apps.appCenter.vars.addRepo()'>Add Repository</button>" +
					"<p>Disclaimer: AaronOS is not responsible for the content of third-party repositories. Be safe!</p>" +
					"</div>";
				try {
					getId("APPCENTER_packages").innerHTML = finalhtml;
				} catch (err) {

				}
			},
			showUpdates: function() {
				apps.appCenter.vars.displayUpdates(1);
				for (var i = 0; i < getId('APPCENTER_categories').childNodes.length; i++) {
					try {
						getId("APPCENTER_categories").childNodes[i].style.background = '';
					} catch (err) {

					}
				}
				var currUpdates = repoGetUpgradeable();
				var finalhtml = '<div id="APPCENTER_UPDATE_CONTROLS" style="width:calc(100% - 3px);padding-top:16px;padding-bottom:16px;border-top:2px solid #7F7F7F;text-align:center;position:relative;">' +
					'<button onclick="apps.appCenter.vars.checkUpdates(1)">Check for Updates</button> <button onclick="apps.appCenter.vars.applyUpdates()">Apply Updates</button>' +
					'</div>';
				for (var i in currUpdates) {
					currUpdates[i] = currUpdates[i].split('.');
					var selectedPackage = installedPackages[currUpdates[i][0]][currUpdates[i][1]];
					finalhtml += "<div style='position:relative;width:calc(100% - 35px);padding:16px;border-top:2px solid #7F7F7F;'>";
					finalhtml += "<b>" + selectedPackage.name + "</b><br>" +
						"<span style='font-family:aosProFont, monospace; font-size:12px'>" + currUpdates[i][0] + "." + selectedPackage.id + "</span><br>";
					finalhtml += "</div>";
				}
				getId("APPCENTER_packages").innerHTML = finalhtml;
			},
			addRepo: function() {
				if (getId("APPCENTER_ADD_REPO").value) {
					repoAddRepository(getId("APPCENTER_ADD_REPO").value, function() {}, apps.appCenter.vars.listRepos);
				}
			},
			removeRepo: function (elem) {
				repoRemoveRepository(elem.getAttribute("data-appcenter-repo"), function() {}, apps.appCenter.vars.listRepos);
			},
			compileWebApp: function (varSet, pkgName) {
				apps['webApp_' + pkgName] = new Application({
					title: varSet.name,
					abbreviation: varSet.abbreviation,
					codeName: 'webApp_' + pkgName,
					image: varSet.icon,
					hideApp: 1,
					main: function() {
						this.appWindow.setCaption(this.appDesc);
						if (!this.appWindow.appIcon) {
							this.appWindow.paddingMode(0);
							this.appWindow.setContent('<iframe data-parent-app="' + this.objName + '" style="width:100%;height:100%;border:none;" src="' + this.vars.appURL + '"></iframe>');
							this.appWindow.setDims("auto", "auto", this.vars.sizeX, this.vars.sizeY);
							if (!this.vars.manualOpen) {
								this.appWindow.openWindow();
							}
							requestAnimationFrame(() => {
								getId("icn_" + this.objName).style.display = "inline-block";
								this.appWindow.appIcon = 1;
							});
						} else {
							this.appWindow.openWindow();
						}
					},
					vars: {
						appInfo: 'This app was installed via the aOS Hub.<br><br>Home URL:<br>' + varSet.homeURL + '<br><br>Package name:<br>' + pkgName.split('__').join('.') + '<br><br>App object name:<br>apps.webApp_' + pkgName,
						appURL: varSet.homeURL,
						sizeX: varSet.windowSize[0],
						sizeY: varSet.windowSize[1],
						manualOpen: varSet.manualOpen || 0
					}
				});
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
						if (safeMode) {
							doLog("Failed initializing aOS Hub apps because Safe Mode is enabled.", "#F00");
						} else {
							repoLoad();
							for (var repository in installedPackages) {
								for (var package in installedPackages[repository]) {
									if (installedPackages[repository][package].appType === "webApp") {
										try {
											apps.appCenter.vars.compileWebApp(installedPackages[repository][package], repository + '__' + package);
										} catch (err) {
											doLog("Failed initializing " + repository + '.' + package + ":", "#F00");
											doLog(err, "#F00");
										}
									} else if (installedPackages[repository][package].appType === "stylesheet") {
										if (installedPackages[repository][package].hasOwnProperty("styleContent")) {
											var customCSS = document.createElement("style");
											customCSS.classList.add("customstyle_appcenter");
											customCSS.id = "customstyle_appcenter_" + repository + "_" + package;
											customCSS.innerHTML = installedPackages[repository][package].styleContent;
											document.head.appendChild(customCSS);
										} else {
											var customCSS = document.createElement("link");
											customCSS.setAttribute("rel", "stylesheet");
											customCSS.href = installedPackages[repository][package].styleLink;
											customCSS.classList.add("customstyle_appcenter");
											customCSS.id = "customstyle_appcenter_" + repository + "_" + package;
											document.head.appendChild(customCSS);
										}
									}
								}
							}
							c(() => {
								repoUpdate(null, () => {
									var updates = repoGetUpgradeable();
									if (updates.length > 0) {
										apps.prompt.vars.notify(updates.length + " app updates available.", ["Dismiss", "View Updates"], function (btn) {
											if (btn === 1) {
												openapp(apps.appCenter, "updates");
											}
										}, "aOS Hub");
									}
								});
							});

							// Alphabetized array of apps
							appsSorted = [];
							for (var i in apps) {
								appsSorted.push(apps[i].appDesc.toLowerCase() + "|AC_apps_sort|" + i);
							}
							appsSorted.sort();
							for (var i in appsSorted) {
								var tempStr = appsSorted[i].split("|AC_apps_sort|");
								tempStr = tempStr[tempStr.length - 1];
								appsSorted[i] = tempStr;
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
	getId('aOSloadingInfo').innerHTML = 'Developer Documentation';
});

/* DEVELOPER DOCUMENTATION */
c(function() {
	m('init DD');
	apps.devDocumentation = new Application({
		title: "Developer Documentation",
		abbreviation: "DD",
		codeName: "devDocumentation",
		image: {
			backgroundColor: "#303947",
			foreground: "smarticons/aOS/fg.png",
			backgroundBorder: {
				thickness: 2,
				color: "#252F3A"
			}
		},
		hideApp: 0,
		main: function() {
			if (!this.appWindow.appIcon) {
				this.appWindow.paddingMode(0);
				this.appWindow.setContent('<iframe data-parent-app="devDocumentation" id="DDframe" style="border:none; display:block; width:100%; height:100%; overflow:hidden;" src="documentation/"></iframe>');
				getId("icn_devDocumentation").style.display = "inline-block";
				requestAnimationFrame(() => {
					this.appWindow.appIcon = 1;
				});
			}
			this.appWindow.setCaption('Developer Documentation');
			this.appWindow.setDims("auto", "auto", 1000, 600);
			if (this.appWindow.appIcon) {
				this.appWindow.openWindow();
			}
		},
		vars: {
			appInfo: 'This is the official AaronOS developer documentation. This is mostly useful to those writing Web Apps.'
		}
	});
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

// Function to allow app windows to be moved
var winmoveSelect = "";
var winmovex = 0;
var winmovey = 0;
var winmoveOrX = 0;
var winmoveOrY = 0;
var winmovecurrapp = '';

function winmove(e) {
	if (e.currentTarget !== getId("winmove")) {
		getId("winmove").style.display = "block";
		winmoveSelect = e.currentTarget.id.substring(0, e.currentTarget.id.length - 4);
		winmovex = e.pageX;
		winmovey = e.pageY;
		for (let app in apps) {
			if (apps[app].objName == winmoveSelect.substring(4, winmoveSelect.length)) {
				winmovecurrapp = app;
				break;
			}
		}
		winmoveOrX = apps[winmovecurrapp].appWindow.windowX;
		winmoveOrY = apps[winmovecurrapp].appWindow.windowY;
		if (document.activeElement.tagName === "IFRAME") {
			if (document.activeElement.getAttribute("data-parent-app")) {
				if (e.currentTarget.id) {
					if ("win_" + document.activeElement.getAttribute("data-parent-app") + "_cap" !== e.currentTarget.id) {
						document.activeElement.blur();
					}
				} else {
					if ("win_" + document.activeElement.getAttribute("data-parent-app") + "_cap" !== e.currentTarget.parentNode.id) {
						document.activeElement.blur();
					}
				}
			}
		}
	} else {
		getId("winmove").style.display = "none";
		if (!mobileMode) {
			apps[winmovecurrapp].appWindow.setDims(
				winmoveOrX + (e.pageX - winmovex) * (1 / screenScale), winmoveOrY + (e.pageY - winmovey) * (1 / screenScale),
				apps[winmovecurrapp].appWindow.windowH, apps[winmovecurrapp].appWindow.windowV
			);
		}
	}
}
getId("winmove").addEventListener("click", winmove);

function winmoving(e) {
	winmovelastx = e.pageX;
	winmovelasty = e.pageY;
	if (!mobileMode) {
		apps[winmovecurrapp].appWindow.setDims(
			winmoveOrX + (e.pageX - winmovex) * (1 / screenScale), winmoveOrY + (e.pageY - winmovey) * (1 / screenScale),
			apps[winmovecurrapp].appWindow.windowH, apps[winmovecurrapp].appWindow.windowV
		);
	}
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

var tempwinres = "";
var tempwinresa = "";
var tempwinresmode = [1, 1];
var winresOrX = 0;
var winresOrY = 0;

function winres(e) {
	if (e.currentTarget !== getId("winres")) {
		getId("winres").style.display = "block";
		winmoveSelect = e.currentTarget.id.substring(0, e.currentTarget.id.length - 5);
		winmovex = e.pageX;
		winmovey = e.pageY;
		for (let app in apps) {
			if (apps[app].objName == winmoveSelect.substring(4, winmoveSelect.length)) {
				winmovecurrapp = app;
				break;
			}
		}

		winmoveOrX = apps[winmovecurrapp].appWindow.windowH;
		winmoveOrY = apps[winmovecurrapp].appWindow.windowV;

		tempwinresmode = [1, 1];
		if (winmovex - apps[winmovecurrapp].appWindow.windowX < apps.settings.vars.winBorder * 5) {
			tempwinresmode[0] = 0;
			winresOrX = apps[winmovecurrapp].appWindow.windowX;
		} else if (winmovex - apps[winmovecurrapp].appWindow.windowX - apps[winmovecurrapp].appWindow.windowH > apps.settings.vars.winBorder * -5) {
			tempwinresmode[0] = 2;
		}
		if (winmovey - apps[winmovecurrapp].appWindow.windowY < apps.settings.vars.winBorder * 5) {
			tempwinresmode[1] = 0;
			winresOrY = apps[winmovecurrapp].appWindow.windowY;
		} else if (winmovey - apps[winmovecurrapp].appWindow.windowY - apps[winmovecurrapp].appWindow.windowV > apps.settings.vars.winBorder * -5) {
			tempwinresmode[1] = 2;
		}

		if (document.activeElement.tagName === "IFRAME") {
			if (document.activeElement.getAttribute("data-parent-app")) {
				if (e.currentTarget.id) {
					if ("win_" + document.activeElement.getAttribute("data-parent-app") + "_size" !== e.currentTarget.id) {
						document.activeElement.blur();
					}
				}
			}
		}
	} else {
		getId("winres").style.display = "none";
		var newWidth = apps[winmovecurrapp].appWindow.windowH;
		var newHeight = apps[winmovecurrapp].appWindow.windowV;
		var newLeft = apps[winmovecurrapp].appWindow.windowX;
		var newTop = apps[winmovecurrapp].appWindow.windowY;
		if (tempwinresmode[0] === 2) {
			newWidth = winmoveOrX + (e.pageX - winmovex) * (1 / screenScale);
		} else if (tempwinresmode[0] === 0) {
			newWidth = winmoveOrX - (e.pageX - winmovex) * (1 / screenScale);
			newLeft = winresOrX + (e.pageX - winmovex) * (1 / screenScale);
		}

		if (tempwinresmode[1] === 2) {
			newHeight = winmoveOrY + (e.pageY - winmovey) * (1 / screenScale);
		} else if (tempwinresmode[1] === 0) {
			newHeight = winmoveOrY - (e.pageY - winmovey) * (1 / screenScale);
			newTop = winresOrY + (e.pageY - winmovey) * (1 / screenScale)
		}

		apps[winmovecurrapp].appWindow.setDims(
			newLeft, newTop,
			newWidth, newHeight
		);
	}
}

getId("winres").addEventListener("click", winres);

function winresing(e) {
	var newWidth = apps[winmovecurrapp].appWindow.windowH;
	var newHeight = apps[winmovecurrapp].appWindow.windowV;
	var newLeft = apps[winmovecurrapp].appWindow.windowX;
	var newTop = apps[winmovecurrapp].appWindow.windowY;
	if (tempwinresmode[0] === 2) {
		newWidth = winmoveOrX + (e.pageX - winmovex) * (1 / screenScale);
	} else if (tempwinresmode[0] === 0) {
		newWidth = winmoveOrX - (e.pageX - winmovex) * (1 / screenScale);
		newLeft = winresOrX + (e.pageX - winmovex) * (1 / screenScale);
	}
	if (tempwinresmode[1] === 2) {
		newHeight = winmoveOrY + (e.pageY - winmovey) * (1 / screenScale);
	} else if (tempwinresmode[1] === 0) {
		newHeight = winmoveOrY - (e.pageY - winmovey) * (1 / screenScale);
		newTop = winresOrY + (e.pageY - winmovey) * (1 / screenScale)
	}

	apps[winmovecurrapp].appWindow.setDims(
		newLeft, newTop,
		newWidth, newHeight
	);
}

function scrollHorizontally(event) {
	this.scrollBy({
		left: event.deltaY,
		behavior: 'smooth'
	});
}
getId("icons").addEventListener("wheel", scrollHorizontally);

function highlightWindow(app) {
	getId('windowFrameOverlay').style.display = 'block';
	// The 32 is to compensate for the absoltely positioned top bar, which isn't factored in by default
	getId('windowFrameOverlay').style.top = apps[app].appWindow.windowY + 32 + "px";
	getId('windowFrameOverlay').style.left = apps[app].appWindow.windowX + "px";
	getId('windowFrameOverlay').style.width = apps[app].appWindow.windowH + "px";
	getId('windowFrameOverlay').style.height = apps[app].appWindow.windowV + "px";
}

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
		}, 'ctxMenu/beta/gear.png'],
		[' ' + lang('ctxMenu', 'desktopBackground'), function() {
			openapp(apps.settings, 'dsktp');
			apps.settings.vars.showMenu(apps.settings.vars.menus.background);
			getId('bckGrndImg').focus();
		}, 'ctxMenu/beta/cool.png']
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

window.bgNaturalSize = [1920, 1080];
window.bgSize = [1920, 1080];
window.bgPosition = [0, 0];

function updateBgSize(noWinblur) {
	bgNaturalSize = [
		getId("bgSizeElement").naturalWidth,
		getId("bgSizeElement").naturalHeight
	];
	switch (apps.settings.vars.bgFit) {
		case 'corner':
			bgSize = [bgNaturalSize[0], bgNaturalSize[1]];
			bgPosition = [0, 0];
			break;
		case 'stretch':
			bgSize = [parseInt(getId("monitor").style.width), parseInt(getId("monitor").style.height)];
			bgPosition = [0, 0];
			break;
		case 'center':
			var monsize = [parseInt(getId("monitor").style.width), parseInt(getId("monitor").style.height)];
			bgSize = [bgNaturalSize[0], bgNaturalSize[1]];
			bgPosition = [monsize[0] / 2 - bgSize[0] / 2, monsize[1] / 2 - bgSize[1] / 2];
			break;
		case 'fit':
			var monsize = [parseInt(getId("monitor").style.width), parseInt(getId("monitor").style.height)];
			var sizeratio = [monsize[0] / bgNaturalSize[0], monsize[1] / bgNaturalSize[1]];
			if (sizeratio[0] <= sizeratio[1]) {
				bgSize = [monsize[0], Math.round(bgNaturalSize[1] * (monsize[0] / bgNaturalSize[0]))];
				bgPosition = [0, Math.round((monsize[1] - bgSize[1]) / 2)];
			} else {
				bgSize = [Math.round(bgNaturalSize[0] * (monsize[1] / bgNaturalSize[1])), monsize[1]];
				bgPosition = [Math.round((monsize[0] - bgSize[0]) / 2), 0];
			}
			break;
		case 'cover':
			var monsize = [parseInt(getId("monitor").style.width), parseInt(getId("monitor").style.height)];
			var sizeratio = [monsize[0] / bgNaturalSize[0], monsize[1] / bgNaturalSize[1]];
			if (sizeratio[0] >= sizeratio[1]) {
				bgSize = [monsize[0], Math.round(bgNaturalSize[1] * (monsize[0] / bgNaturalSize[0]))];
				bgPosition = [0, Math.round((monsize[1] - bgSize[1]) / 2)];
			} else {
				bgSize = [Math.round(bgNaturalSize[0] * (monsize[1] / bgNaturalSize[1])), monsize[1]];
				bgPosition = [Math.round((monsize[0] - bgSize[0]) / 2), 0];
			}
			break;
		default:
			bgSize = [bgNaturalSize[0], bgNaturalSize[1]];
			bgPosition = [0, 0];
	}
	getId("monitor").style.backgroundSize = bgSize[0] + 'px ' + bgSize[1] + 'px';
	getId("monitor").style.backgroundPosition = bgPosition[0] + 'px ' + bgPosition[1] + 'px';
	if (!noWinblur) calcWindowblur(null, 1);
}

function calcWindowblur(win, noBgSize) {
	if (!noBgSize) updateBgSize(1);
	var aeroOffset = [0, -32];
	if (screenScale === 1 || screenScale < 0.25) {
		getId('monitor').style.transform = '';
		var numberOfScreenScale = 1;
	} else {
		getId('monitor').style.transform = 'scale(' + screenScale + ')';
		var numberOfScreenScale = screenScale;
	}
	if (win === "taskbar") {
		getId("tskbrAero").style.backgroundSize = bgSize[0] + 'px ' + bgSize[1] + 'px';
		getId("tskbrAero").style.backgroundPosition = (20 + bgPosition[0]) + "px " + (20 + bgPosition[1]) + "px";
	} else if (win) {
		getId('win_' + win + '_aero').style.backgroundPosition = (-1 * apps[win].appWindow.windowX + 40 + aeroOffset[0] + bgPosition[0]) + "px " + (-1 * (apps[win].appWindow.windowY * (apps[win].appWindow.windowY > -1)) + 40 + aeroOffset[1] + bgPosition[1]) + "px"
	} else {
		for (var i in apps) {
			getId('win_' + i + '_aero').style.backgroundSize = bgSize[0] + 'px ' + bgSize[1] + 'px';
			getId('win_' + i + '_aero').style.backgroundPosition = (-1 * apps[i].appWindow.windowX + 40 + aeroOffset[0] + bgPosition[0]) + "px " + (-1 * (apps[i].appWindow.windowY * (apps[i].appWindow.windowY > -1)) + 40 + aeroOffset[1] + bgPosition[1]) + "px";
		}
		getId("tskbrAero").style.backgroundSize = bgSize[0] + 'px ' + bgSize[1] + 'px';
		getId("tskbrAero").style.backgroundPosition = (20 + bgPosition[0]) + "px " + (20 + bgPosition[1]) + "px";
	}
}

function fitWindowIfPermitted() {
	if (!lfload("aos_system/apps/settings/saved_screen_res")) {
		fitWindow();
	}
}

function fitWindow() {
	perfStart('fitWindow');
	if (screenScale === 1 || screenScale < 0.25) {
		getId('monitor').style.transform = '';
		var numberOfScreenScale = 1;
	} else {
		getId('monitor').style.transform = 'scale(' + screenScale + ')';
		var numberOfScreenScale = screenScale;
	}
	getId("monitor").style.width = window.innerWidth * (1 / numberOfScreenScale) + "px";
	getId("monitor").style.height = window.innerHeight * (1 / numberOfScreenScale) + "px";
	getId("desktop").style.width = window.innerWidth * (1 / numberOfScreenScale) + "px";
	getId("desktop").style.height = window.innerHeight * (1 / numberOfScreenScale) - 32 + "px";
	getId("taskbar").style.width = window.innerWidth * (1 / numberOfScreenScale) + "px";
	getId("tskbrAero").style.backgroundPosition = "20px " + (-1 * (window.innerHeight * (1 / numberOfScreenScale)) + 52) + "px";
	getId("tskbrAero").style.width = window.innerWidth * (1 / numberOfScreenScale) + 40 + "px";
	getId("tskbrAero").style.height = '';
	getId('tskbrAero').style.transform = '';
	getId('tskbrAero').style.transformOrigin = '';

	getId('desktop').style.left = '';
	getId('desktop').style.top = '32px';
	getId('desktop').style.width = getId('monitor').style.width;
	getId('desktop').style.height = parseInt(getId('monitor').style.height, 10) - 32 + "px";
	getId('taskbar').style.top = '0';
	getId('taskbar').style.left = '';
	getId('taskbar').style.right = '';
	getId('taskbar').style.bottom = 'auto';
	getId('taskbar').style.transform = '';
	getId('taskbar').style.width = getId('monitor').style.width;
	getId('tskbrAero').style.backgroundPosition = "20px 20px";

	checkMobileSize();
	arrangeDesktopIcons();
	try {
		updateBgSize();
	} catch (err) {

	}
}

function fitWindowOuter() {
	perfStart('fitWindow');
	if (screenScale === 1 || screenScale < 0.25) {
		getId('monitor').style.transform = '';
		var numberOfScreenScale = 1;
	} else {
		getId('monitor').style.transform = 'scale(' + screenScale + ')';
		var numberOfScreenScale = screenScale;
	}
	getId("monitor").style.width = window.outerWidth * (1 / numberOfScreenScale) + "px";
	getId("monitor").style.height = window.outerHeight * (1 / numberOfScreenScale) + "px";
	getId("desktop").style.width = window.outerWidth * (1 / numberOfScreenScale) + "px";
	getId("desktop").style.height = window.outerHeight * (1 / numberOfScreenScale) - 32 + "px";
	getId("taskbar").style.width = window.outerWidth * (1 / numberOfScreenScale) + "px";
	getId("tskbrAero").style.backgroundPosition = "20px " + (-1 * (window.outerHeight * (1 / numberOfScreenScale)) + 52) + "px";
	getId("tskbrAero").style.width = window.outerWidth * (1 / numberOfScreenScale) + 40 + "px";
	getId("tskbrAero").style.height = '';
	getId('tskbrAero').style.transform = '';
	getId('tskbrAero').style.transformOrigin = '';

	getId('desktop').style.left = '';
	getId('desktop').style.top = '32px';
	getId('desktop').style.width = getId('monitor').style.width;
	getId('desktop').style.height = parseInt(getId('monitor').style.height, 10) - 32 + "px";
	getId('taskbar').style.top = '0';
	getId('taskbar').style.left = '';
	getId('taskbar').style.right = '';
	getId('taskbar').style.bottom = 'auto';
	getId('taskbar').style.transform = '';
	getId('taskbar').style.width = getId('monitor').style.width;

	checkMobileSize();
	arrangeDesktopIcons();
	try {
		updateBgSize();
	} catch (err) {

	}
}

function fitWindowRes(newmonX, newmonY) {
	perfStart('fitWindow');
	if (screenScale === 1 || screenScale < 0.25) {
		getId('monitor').style.transform = '';
		var numberOfScreenScale = 1;
	} else {
		getId('monitor').style.transform = 'scale(' + screenScale + ')';
		var numberOfScreenScale = screenScale;
	}
	getId("monitor").style.width = newmonX * (1 / numberOfScreenScale) + "px";
	getId("monitor").style.height = newmonY * (1 / numberOfScreenScale) + "px";
	getId("desktop").style.width = newmonX * (1 / numberOfScreenScale) + "px";
	getId("desktop").style.height = newmonY * (1 / numberOfScreenScale) - 32 + "px";
	getId("taskbar").style.width = newmonX * (1 / numberOfScreenScale) + "px";
	getId("tskbrAero").style.backgroundPosition = "20px " + (-1 * (newmonY * (1 / numberOfScreenScale)) + 52) + "px";
	getId("tskbrAero").style.width = newmonX * (1 / numberOfScreenScale) + 40 + "px";
	getId("tskbrAero").style.height = '';
	getId('tskbrAero').style.transform = '';
	getId('tskbrAero').style.transformOrigin = '';

	getId('desktop').style.left = '';
	getId('desktop').style.top = '32px';
	getId('desktop').style.width = getId('monitor').style.width;
	getId('desktop').style.height = parseInt(getId('monitor').style.height, 10) - 32 + "px";
	getId('taskbar').style.top = '0';
	getId('taskbar').style.left = '';
	getId('taskbar').style.right = '';
	getId('taskbar').style.bottom = 'auto';
	getId('taskbar').style.transform = '';
	getId('taskbar').style.width = getId('monitor').style.width;

	checkMobileSize();
	arrangeDesktopIcons();
	try {
		updateBgSize();
	} catch (err) {

	}
}

// Test that the code is intact (2c22 68747470733a2f2f6161726f6e6f73 2e64)
c(function() {
	var hexTestStr = "76617220616e74695069726163793d7b7d3b7472797b616e74695069726163793d7b6c6f6164696e67456c656d656e743a6e756c6c213d3d67657449642822614f53697" +
		"34c6f6164696e6722292c636f707972696768744578697374733a766f69642030213d3d617070732e73657474696e67732e766172732e6d656e75732e696e666f2e636f" +
		"707972696768742c636f70797269676874436f6e7461696e734e616d653a2d31213d3d617070732e73657474696e67732e766172732e6d656e75732e696e666f2e636f7" +
		"07972696768742e6465736372697074696f6e28292e696e6465784f6628224161726f6e204164616d7322297d7d63617463682861297b616e74695069726163793d7b6c" +
		"6f6164696e67456c656d656e743a6e756c6c213d3d67657449642822614f5369734c6f6164696e6722292c636f707972696768744578697374733a766f69642030213d3" +
		"d617070732e73657474696e67732e766172732e6d656e75732e696e666f2e636f707972696768742c636f70797269676874436f6e7461696e734e616d653a21317d7d0a" +
		"76617220616e7469506972616379436865636b3d7b6c6f6164696e67456c656d656e743a21302c636f707972696768744578697374733a21302c636f707972696768744" +
		"36f6e7461696e734e616d653a21307d2c706972616379436865636b506173733d21303b666f7228766172206920696e20616e7469506972616379290a696628616e7469" +
		"5069726163795b695d213d3d616e7469506972616379436865636b5b695d297b706972616379436865636b506173733d21313b627265616b7d696628217069726163794" +
		"36865636b50617373297b76617220636f70797269676874537472696e673b636f70797269676874537472696e673d616e74695069726163792e636f7079726967687445" +
		"78697374733f617070732e73657474696e67732e766172732e6d656e75732e696e666f2e636f707972696768742e6465736372697074696f6e28293a226e756c6c223b7" +
		"661722070697261637944657461696c733d7b687265663a77696e646f772e6c6f636174696f6e2e687265662c626c6173743a617070732e73657474696e67732e766172" +
		"732e73637265656e7361766572732e626c6173742e6e616d652c6c6f6164696e67456c656d656e743a537472696e6728616e74695069726163792e6c6f6164696e67456" +
		"c656d656e74292c636f707972696768744578697374733a537472696e6728616e74695069726163792e636f70797269676874457869737473292c636f70797269676874" +
		"537472696e673a617070732e73657474696e67732e766172732e6d656e75732e696e666f2e636f707972696768742e6465736372697074696f6e28292c64617368626f6" +
		"172644e616d653a617070732e73746172744d656e752e617070446573632c64617368626f617264446573635374723a617070732e73746172744d656e752e766172732e" +
		"617070496e666f7d2c666f726d446174613d6e657720466f726d446174613b666f7228766172206920696e2070697261637944657461696c7329666f726d446174612e6" +
		"17070656e6428692c70697261637944657461696c735b695d293b76617220706972616379487474705265713d6e657720584d4c48747470526571756573743b646f4c6f" +
		"672822536f6d657468696e67207365656d7320776569726420686572652e2e2e222c222346463746303022293b646f4c6f672822456d61696c207468697320636f64652" +
		"0746f204161726f6e20286d696e65616e646372616674313240676d61696c2e636f6d2920666f7220737570706f7274212023374137373133222c222346303022293b70" +
		"6972616379487474705265712e6f70656e2822504f5354222c2268747470733a2f2f636f72732d616e7977686572652e6865726f6b756170702e636f6d2f68747470733" +
		"a2f2f6161726f6e6f732e6465762f4161726f6e4f532f6c6f67732f6c6f6749737375652e70687022292c706972616379487474705265712e73656e6428666f726d4461" +
		"7461292c6572726f724d657373616765733d5b22456d61696c207468697320636f646520746f204161726f6e20286d696e65616e646372616674313240676d61696c2e6" +
		"36f6d2920666f7220737570706f7274212023374137373133225d2c633d66756e6374696f6e28636f64652c61726773297b6576616c28600a2020202020202020202020" +
		"2020202020696628747970656f6620636f6465203d3d3d202766756e6374696f6e27297b0a202020202020202020202020202020202020202069662861726773297b0a2" +
		"02020202020202020202020202020202020202020202020636f6465546f52756e2e70757368285b636f64652c20617267735d293b0a2020202020202020202020202020" +
		"2020202020207d656c73657b0a202020202020202020202020202020202020202020202020636f6465546f52756e2e7075736828636f6465293b0a20202020202020202" +
		"020202020202020202020207d0a202020202020202020202020202020207d0a0909097d0a60297d7d"
	var hexConverted = "";
	for (var i = 0; i < hexTestStr.length; i += 2) {
		hexConverted += String.fromCharCode(parseInt(hexTestStr.substring(i, i + 2), 16));
	}
	eval(hexConverted);
	hexConverted = "";
	hexTestStr = "";
});

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
			if (USERFILES === null) {
				USERFILES = {};
			}
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