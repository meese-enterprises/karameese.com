var aosToolsConnected = 0;
var newScriptTag = document.createElement("script");
newScriptTag.setAttribute("data-light", "true");
newScriptTag.src = "../aosTools.js";
document.head.appendChild(newScriptTag);

window.aosTools_connectListener = function () {
	aosTools.openWindow();
	aosToolsConnected = 1;
	aosTools.getBorders(recieveWindowBorders);
}

// ask for window type
var windowType = "opaque";

// prevent the display from going to sleep
var preventingSleep = 0;
var sleepID = null;
function blockSleep() {
	if (!preventingSleep && aosToolsConnected) {
		aosTools.blockScreensaver(() => {});
		preventingSleep = 1;
	}
}

function unblockSleep() {
	if (preventingSleep && aosToolsConnected) {
		aosTools.unblockScreensaver(() => {});
		preventingSleep = 0;
	}
}

window.onerror = function (errorMsg, url, lineNumber) {
	console.log("oof, u got a error\n\n" + url + '[' + lineNumber + ']:\n' + errorMsg);
}

function getId(target) {
	return document.getElementById(target);
}

var windowBorders = [6, 35, 0];
function recieveWindowBorders(response) {
	windowBorders = [
		response.content.left + response.content.right,
		response.content.top + response.content.bottom,
		1
	];
}

var audio = new Audio();
var audioDuration = 1;

function updateProgress() {
	progressBar.style.width = audio.currentTime / audioDuration * 100 + "%";
	progressBar.style.backgroundColor = getColor(audio.currentTime / audioDuration * 255);
	requestAnimationFrame(updateProgress);
}
requestAnimationFrame(updateProgress);

var audioContext;
var mediaSource;
var delayNode;
function setDelay(newDelay) {
	delayNode.delayTime.value = (newDelay || 0);
	localStorage.setItem("AaronOSMusic_Delay", String(newDelay));
}

function setVolume(newVolume) {
	audio.volume = newVolume;
}

var analyser;
var visData;
var songList = getId("songList");
var progressBar = getId("progress");
var fileNames = [];
var fileInfo = {};
var currentSong = -1;
var winsize = [window.innerWidth, window.innerHeight];
var size = [window.innerWidth - 8, window.innerHeight - 81];
var supportedFormats = ['aac', 'aiff', 'wav', 'm4a', 'mp3', 'amr', 'au', 'weba', 'oga', 'wma', 'flac', 'ogg', 'opus', 'webm'];

function generateSongInfo() {
	var tempFileInfo = {
		_color_tutorial: {
			colorTypes: ['gradient', 'peak', 'solid'],
			colorTypesExplanations: {
				gradient: 'All colors are evenly distributed.',
				peak: 'Same as gradient, but the last color is used as a peak of sorts, at very high volumes.',
				solid: 'Solid color, no gradient'
			},
			colorFormat: [
				"Each file requires a colorType and list of colors.",
				"The _default_colors are selected when a specific song has no colors.",
				[
					'Red Channel',
					'Green Channel',
					'Blue Channel',
					'Alpha Channel'
				],
				[
					127,
					255,
					204,
					0.8
				]
			]
		},
		_default_colors: {
			colorType: 'peak',
			colors: [
				[0, 0, 255, 1],
				[0, 255, 0, 1],
				[255, 0, 0, 1]
			]
		}
	};
	for (var i in fileNames) {
		tempFileInfo[fileNames[i][0]] = {
			colorType: '',
			colors: []
		};
	}
	for (var i in fileInfo) {
		tempFileInfo[i] = fileInfo[i];
	}
	getId("songInfoTemplate").value = JSON.stringify(tempFileInfo, null, '\t');
}

function listSongs() {
	var str = "";
	fileNames.forEach(song => {
		let songName = song[0];
		let songNumber = song[1];
		let songPath = song[2];
		str += `<div id="song${songNumber}" onclick="selectSong(${songNumber})">${songNumber}: ${songName}</div>`;
	});

	songList.innerHTML = str;
}

function readFileInfo(event) {
	try {
		fileInfo = JSON.parse(event.target.result);
	} catch (err) {
		console.log("Error parsing file info");
	}
}

var currentSong = -1;
function selectSong(id) {
	currentSong = id;
	audio.pause();
	audio.currentTime = 0;
	audio.src = fileNames[id][2];
	blockSleep();
	getId("currentlyPlaying").innerHTML = fileNames[id][1] + ": " + fileNames[id][0];
	document.title = fileNames[id][0] + " - AaronOS Music Player";
	if (aosToolsConnected) {
		aosTools.sendRequest({
			action: "appwindow:set_caption",
			content: "Music Player - " + fileNames[id][0],
			conversation: "set_caption"
		});
	}
	try {
		document.getElementsByClassName("selected")[0].classList.remove("selected");
	} catch (err) {
		// no song is selected
	}

	getId("song" + id).classList.add("selected");
	if (automaticColorCtx) {
		var autoColorPassed = 0;
		if (fileInfo[fileNames[id][0]]) {
			automaticColor = {
				colorType: fileInfo[fileNames[id][0]].colorType,
				colorArr: fileInfo[fileNames[id][0]].colors
			};
			autoColorPassed = 1;
		} else if (fileInfo['_default_colors']) {
			automaticColor = {
				colorType: fileInfo['_default_colors'].colorType,
				colorArr: fileInfo['_default_colors'].colors
			}
			autoColorPassed = 1;
		} else {
			automaticColor = {
				colorType: 'gradient',
				colorArr: [
					[0, 64, 0],
					[0, 255, 0]
				]
			};
			autoColorPassed = 1;
		}
		if (automaticColor.colorArr.length === 0) {
			if (fileInfo['_default_colors']) {
				automaticColor = {
					colorType: fileInfo['_default_colors'].colorType,
					colorArr: fileInfo['_default_colors'].colors
				}
				autoColorPassed = 1;
			} else {
				automaticColor = {
					colorType: 'gradient',
					colorArr: [
						[0, 64, 0],
						[0, 255, 0]
					]
				};
				autoColorPassed = 1;
			}
		}
		if (autoColorPassed) {
			if (automaticColor.colorArr.length === 1) {
				automaticColorCtx.fillColor = 'rgba(' + automaticColor.colorArr[0][0] + ',' + automaticColor.colorArr[0][1] + ',' + automaticColor.colorArr[0][2] + (automaticColor.colorArr[0][3] || 1) + ')';
				automaticColorCtx.fillRect(0, 0, 512, 0);
			} else {
				var newGradient = automaticColorCtx.createLinearGradient(0, 0, 512, 0);
				if (automaticColor.colorType === "gradient") {
					for (var i = 0; i < automaticColor.colorArr.length; i++) {
						newGradient.addColorStop(
							i / (automaticColor.colorArr.length - 1),
							'rgba(' + automaticColor.colorArr[i][0] + ',' + automaticColor.colorArr[i][1] + ',' + automaticColor.colorArr[i][2] + ',' + (automaticColor.colorArr[i][3] || 1) + ')'
						);
					}
				} else if (automaticColor.colorType === "peak") {
					if (automaticColor.colorArr.length === 2) {
						newGradient.addColorStop(
							0.85,
							'rgba(' + automaticColor.colorArr[i][0] + ',' + automaticColor.colorArr[i][1] + ',' + automaticColor.colorArr[i][2] + ',' + (automaticColor.colorArr[i][3] || 1) + ')'
						);
					} else {
						for (var i = 0; i < automaticColor.colorArr.length - 1; i++) {
							newGradient.addColorStop(
								(i / (automaticColor.colorArr.length - 2)) * 0.85,
								'rgba(' + automaticColor.colorArr[i][0] + ',' + automaticColor.colorArr[i][1] + ',' + automaticColor.colorArr[i][2] + ',' + (automaticColor.colorArr[i][3] || 1) + ')'
							);
						}
					}
					newGradient.addColorStop(
						1,
						'rgba(' + automaticColor.colorArr[i][0] + ',' + automaticColor.colorArr[i][1] + ',' + automaticColor.colorArr[i][2] + ',' + (automaticColor.colorArr[i][3] || 1) + ')'
					);
				}
				automaticColorCtx.fillStyle = newGradient;
				automaticColorCtx.fillRect(0, 0, 512, 1);
			}
			automaticColor.resultList = [];
			for (var i = 0; i < 512; i++) {
				var rgbaResult = automaticColorCtx.getImageData(i, 0, 1, 1).data;
				automaticColor.resultList.push('rgba(' + rgbaResult[0] + ',' + rgbaResult[1] + ',' + rgbaResult[2] + ',' + rgbaResult[3] + ')');
			}
		}
	}
}

function play() {
	if (currentSong === -1) {
		selectSong(0);
	} else {
		audio.play();
		blockSleep();
	}
	if (ambienceWaiting) {
		ambienceWaiting = 0;
		clearTimeout(ambienceTimeout);
		getId("currentlyPlaying").innerHTML = fileNames[currentSong][1] + ": " + fileNames[currentSong][0];
	}
	getId("playbutton").innerHTML = "<b>&nbsp;||&nbsp;</b>";
}

function pause() {
	audio.pause();
	unblockSleep();
	getId("playbutton").innerHTML = "&#9658;";
}

function firstPlay() {
	audioDuration = audio.duration;
	play();
}
audio.addEventListener("canplaythrough", firstPlay);

function setProgress(e) {
	if (currentSong !== -1) {
		var timeToSet = e.pageX - 5;
		if (timeToSet < 5) timeToSet = 0;
		timeToSet /= size[0];
		timeToSet *= audio.duration;
		audio.currentTime = timeToSet;
		if (ambienceWaiting) {
			ambienceWaiting = 0;
			clearTimeout(ambienceTimeout);
			getId("currentlyPlaying").innerHTML = fileNames[currentSong][1] + ": " + fileNames[currentSong][0];
		}
	}
}

function back() {
	if (audio.currentTime < 3) {
		currentSong--;
		if (currentSong < 0) {
			currentSong = fileNames.length - 1;
		}
		selectSong(currentSong);
	} else {
		audio.currentTime = 0;
		if (ambienceWaiting) {
			ambienceWaiting = 0;
			clearTimeout(ambienceTimeout);
			getId("currentlyPlaying").innerHTML = fileNames[currentSong][1] + ": " + fileNames[currentSong][0];
		}
	}
}

var ambienceWaiting = 0;
var ambienceTimeout = null;
function next() {
	if (ambienceMode) {
		if (ambienceWaiting) {
			ambienceWaiting = 0;
			clearTimeout(ambienceTimeout);
		}
		var nextAmbienceSong = Math.floor(Math.random() * fileNames.length);
		if (fileNames.length !== 1) {
			while (nextAmbienceSong === currentSong) {
				nextAmbienceSong = Math.floor(Math.random() * fileNames.length);
			}
		}
		currentSong = nextAmbienceSong;
	} else {
		currentSong++;
		if (currentSong > fileNames.length - 1) {
			currentSong = 0;
		}
	}
	selectSong(currentSong);
}

function ambienceNext() {
	if (ambienceWaiting) {
		ambienceWaiting = 0;
		clearTimeout(ambienceTimeout);
	}
	var nextAmbienceSong = Math.floor(Math.random() * fileNames.length);
	if (fileNames.length !== 1) {
		while (nextAmbienceSong === currentSong) {
			nextAmbienceSong = Math.floor(Math.random() * fileNames.length);
		}
	}
	currentSong = nextAmbienceSong;
	selectSong(currentSong);
}

function songEnd() {
	var windowWillClose = checkSelfClose();
	if (!windowWillClose) {
		if (ambienceMode) {
			var randomTime = Math.floor(Math.random() * 300000) + 1;
			var randomTimeSeconds = Math.floor(randomTime / 1000);
			var randomTimeMinutes = Math.floor(randomTimeSeconds / 60);
			randomTimeSeconds -= randomTimeMinutes * 60;
			getId("currentlyPlaying").innerHTML = "Next song in " + randomTimeMinutes + ":" + randomTimeSeconds;
			ambienceTimeout = setTimeout(ambienceNext, randomTime);
			ambienceWaiting = 1;
			getId("playbutton").innerHTML = "&#9658;";
		} else {
			next();
		}
	}
}

audio.addEventListener("ended", songEnd);
function shuffleArray(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}

function shuffle() {
	audio.pause();
	audio.currentTime = 0;
	currentSong = 0;
	shuffleArray(fileNames);
	listSongs();
	selectSong(0);
}

var ambienceMode = 0;
function toggleAmbience() {
	ambienceMode = Math.abs(ambienceMode - 1);
	if (getId("ambienceButton")) {
		getId("ambienceButton").style.borderColor = debugColors[ambienceMode];
	}
	if (ambienceMode && currentSong === -1) {
		songEnd();
	}
}

var debugColors = ["#C00", "#0A0"];
var canvasElement = getId("visCanvas");
var canvas = canvasElement.getContext("2d");

var highFreqRange = 0;
var perfLast = performance.now();
var perfCurrent = perfLast;
var perfTime = 0;
var fpsApproximate = 60;
var fpsCompensation = 1;

function globalFrame() {
	requestAnimationFrame(globalFrame);
	perfLast = perfCurrent;
	perfCurrent = performance.now();
	perfTime = perfCurrent - perfLast;
	fpsApproximate = 1000 / perfTime;
	fpsCompensation = 1 / (fpsApproximate / 60);

	// fpsCompensation is a helper for adjusting timing based on the FPS
	// multiply a value by fpsCompensation to adjust it to the current performance.
	// 120fps = 0.5
	// 60fps = 1
	// 30fps = 2

	if (winsize[0] !== window.innerWidth || winsize[1] !== window.innerHeight) {
		winsize = [window.innerWidth, window.innerHeight];
		size = [window.innerWidth - 8, window.innerHeight - 81];
		getId("visCanvas").width = size[0];
		getId("visCanvas").height = size[1];
		if (currVis !== "none") {
			if (vis[currVis].sizechange) {
				vis[currVis].sizechange();
			}
		}
	}

	if (currVis !== "none") {
		analyser.getByteFrequencyData(visData);

		// If the audio's volume is lowered, the visualizer can't hear it, so
		// this attempts to artificially bring the volume back up to full
		if (audio.volume < 0.9) {
			var gainFactor = 0.9 - audio.volume + 1;
			for (var i = 0; i < visData.length; i++) {
				visData[i] = Math.floor(visData[i] * gainFactor);
			}
		}

		// Modify the data values with Power
		for (let i = 0; i < 128; i++) {
			visData[i] = Math.pow(visData[i], 2) / 255;
		}

		// Do the visualizer
		vis[currVis].frame();
	}
}

var automaticColorCtx = null;
var automaticColor = {
	colorType: 'peak',
	colorArr: ['#005500', '#00FF00', '#FF0000'],
	resultList: new Array(512)
}

/*
    // a gradient is a set of points from 0 to 255
    // each point has a value (0 - 1, 0 - 255, 0 - 360, etc)
    // one gradient represents one color channel
    grad: {
        r: [],
        g: [],
        b: [],
        a: []
    },

    example:
    r: [[0, 127], [127, 64], [255, 192]]
    [[point, value], [point, value], ...]

    // to calculate a point in the gradient:
    // supply the gradient and the value
    gcalc(this.grad.r, value)

    // if the value is before the first gradient point, first point is used.
    // if the value is after the first gradient point, last point is used.
*/
function gcalc(grad, value) {
	for (var point = grad.length - 1; point >= 0; point--) {
		if (grad[point][0] <= value) {
			if (point === grad.length - 1 || grad[point][0] === value) {
				return grad[point][1];
			}
			var weight = (value - grad[point][0]) / (grad[point + 1][0] - grad[point][0]);
			return grad[point][1] * (1 - weight) + grad[point + 1][1] * weight;
		}
	}
	return grad[0][1];
}

const barbie       = "#fe00c0";
const cotton_candy = "#fa87f4";
const barney       = "#9701ff";
const bsod         = "#4900ff";
const blue_razz    = "#01b9ff";
const carribbean   = "#01fff8";
const VaporwaveColors = [cotton_candy, barbie, barney, bsod, blue_razz, carribbean];

const getColor = (amount, position) => {
	if (typeof position === "number") {
		let numOfCols = VaporwaveColors.length;
		let selCol = Math.floor(position / 255 * numOfCols);
		if (selCol < 0) selCol = 0;
		if (selCol > numOfCols - 1) selCol = numOfCols;
		return VaporwaveColors[selCol];
	} else {
		let numOfCols = VaporwaveColors.length;
		let selCol = Math.floor(amount / 255 * numOfCols);
		if (selCol < 0) selCol = 0;
		if (selCol > numOfCols - 1) selCol = numOfCols;
		return VaporwaveColors[selCol];
	}
}
progressBar.style.outline = "2px solid " + getColor(255);

var currVis = null;
var vis = {
	none: {
		name: "Song List",
		start: function () {
			getId("visualizer").classList.add("disabled");
			getId("songList").classList.remove("disabled");
		},
		frame: function () {},
		stop: function () {
			getId("visualizer").classList.remove("disabled");
			getId("songList").classList.add("disabled");
		}
	},
	monstercat: {
		name: "Monstercat",
		image: "visualizers/monstercat.png",
		start: function () {

		},
		frame: function () {
			canvas.clearRect(0, 0, size[0], size[1]);
			var left = size[0] * 0.1;
			var maxWidth = size[0] * 0.8;
			var barWidth = maxWidth / 96;
			var barSpacing = maxWidth / 64;
			var maxHeight = size[1] * 0.5 - size[1] * 0.2;

			var monstercatGradient = canvas.createLinearGradient(0, Math.round(size[1] / 2) + 4, 0, size[1]);
			monstercatGradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)'); // 0.8
			monstercatGradient.addColorStop(0.025, 'rgba(0, 0, 0, 0.9)'); // 0.9
			monstercatGradient.addColorStop(0.1, 'rgba(0, 0, 0, 1)'); // 1

			for (var i = 0; i < 64; i++) {
				var strength = visData[i];

				var fillColor = getColor(strength, i * 4);
				canvas.fillStyle = fillColor;
				canvas.fillRect(
					Math.round(left + i * barSpacing),
					Math.floor(size[1] / 2) - Math.round(strength / 255 * maxHeight),
					Math.round(barWidth),
					Math.round(strength / 255 * maxHeight + 5)
				);
				
				if (strength > 10) {
					canvas.fillRect(
						Math.round(left + i * barSpacing),
						Math.floor(size[1] / 2) + 4,
						Math.round(barWidth),
						Math.round(10 / 255 * maxHeight + 4)
					);
					canvas.fillRect(
						Math.round(left + i * barSpacing - 1),
						Math.floor(size[1] / 2) + 4 + (10 / 255 * maxHeight) + 4,
						Math.round(barWidth + 2),
						Math.round((strength - 10) / 255 * maxHeight)
					);
				} else {
					canvas.fillRect(
						Math.round(left + i * barSpacing),
						Math.floor(size[1] / 2) + 4,
						Math.round(barWidth),
						Math.round(strength / 255 * maxHeight + 4)
					);
				}
			}

			canvas.fillStyle = monstercatGradient;
			canvas.fillRect(0, Math.round(size[1] / 2) + 4, size[0], Math.round(size[1] / 2) - 4);

			canvas.fillStyle = '#FFF';
			canvas.font = (size[1] * 0.25) + 'px aosProFont, sans-serif';
			canvas.fillText((fileNames[currentSong] || ["No Song"])[0].toUpperCase(), Math.round(left) + 0.5, size[1] * 0.75, Math.floor(maxWidth));
		},
		stop: function () {

		},
		sqrt255: Math.sqrt(255)
	},
	central: {
		name: "Central",
		image: "visualizers/central.png",
		start: function () {

		},
		frame: function () {
			canvas.clearRect(0, 0, size[0], size[1]);
			var left = size[0] * 0.1;
			var maxWidth = size[0] * 0.8;
			var barWidth = maxWidth / 96;
			var barSpacing = maxWidth / 64;
			var maxHeight = size[1] * 0.5 - size[1] * 0.25;

			for (var i = 0; i < 64; i++) {
				var strength = visData[i];

				var fillColor = getColor(strength, i * 4);
				canvas.fillStyle = fillColor;
				canvas.fillRect(
					Math.round(left + i * barSpacing),
					Math.floor(size[1] / 2) - Math.round(strength / 255 * maxHeight) - 5,
					Math.round(barWidth),
					Math.round(strength / 255 * maxHeight * 2 + 10)
				);
			}
		},
		stop: function () {

		},
		sqrt255: Math.sqrt(255)
	},
	curvedAudioVision: {
		name: "Curved Lines",
		image: "visualizers/curvedLines_av.png",
		start: function () {

		},
		frame: function () {
			canvas.clearRect(0, 0, size[0], size[1]);
			canvas.lineCap = "round";
			canvas.lineWidth = this.lineWidth - (0.5 * this.lineWidth);
			var xdist = size[0] / (this.lineCount + 2) / 2;
			var ydist = size[1] / (this.lineCount + 2) / 2;
			xdist = Math.min(xdist, ydist);
			var colorstep = 255 / this.lineCount;
			var ringPools = [0, 0, 0, 0, 0, 0, 0, 0, 0];
			for (let i = 0; i < 64; i++) {
				var currPool = Math.floor(i / (64 / 9));
				ringPools[currPool] = Math.max(visData[i], ringPools[currPool]);
			}
			for (let i = 0; i < this.lineCount; i++) {
				var strength = ringPools[i] * 0.85;
				canvas.strokeStyle = getColor(strength, i * colorstep);

				var circlePoints = [{
						x: xdist * this.lineCount,
						y: 0
					},
					{
						x: xdist * this.lineCount,
						y: 2 * xdist * this.lineCount
					},
					{
						x: xdist * this.lineCount + (xdist * (i + 1)),
						y: xdist * this.lineCount
					}
				]
				var currCircle = this.circleFromThreePoints(...circlePoints);
				var tri = [
					Math.sqrt(
						Math.pow(
							circlePoints[2].x -
							circlePoints[0].x, 2) +
						Math.pow(
							circlePoints[2].y -
							circlePoints[0].y, 2)
					),
					currCircle.r,
					currCircle.r
				];
				// (b2 + c2 − a2) / 2bc
				var angle = Math.acos(this.deg2rad((tri[1] * tri[1] + tri[2] * tri[2] - tri[0] * tri[0]) / (2 * tri[1] * tri[2])));
				canvas.beginPath();
				canvas.arc(
					currCircle.x + (size[0] - xdist * this.lineCount * 2) / 2,
					currCircle.y + (size[1] / 2 - xdist * this.lineCount),
					currCircle.r,
					((angle - this.deg2rad(Math.pow((this.lineCount - i - 1) * 1.83, 1.61))) * -1) * (strength / 255),
					((angle - this.deg2rad(Math.pow((this.lineCount - i - 1) * 1.83, 1.61)))) * (strength / 255)
				);
				canvas.stroke();

				circlePoints[0].x *= -1;
				circlePoints[1].x *= -1;
				circlePoints[2].x *= -1;
				currCircle = this.circleFromThreePoints(...circlePoints);
				canvas.beginPath();
				canvas.arc(
					currCircle.x + (size[0] / 2 + xdist * this.lineCount),
					currCircle.y + (size[1] / 2 - xdist * this.lineCount),
					currCircle.r,
					((angle - this.deg2rad(Math.pow((this.lineCount - i - 1) * 1.83, 1.61))) * -1) * (strength / 255) + this.deg2rad(180),
					((angle - this.deg2rad(Math.pow((this.lineCount - i - 1) * 1.83, 1.61)))) * (strength / 255) + this.deg2rad(180)
				);
				canvas.stroke();
			}
		},
		stop: function () {
			canvas.lineCap = "square";
			canvas.lineWidth = 1;
		},
		sizechange: function () {},
		lineWidth: 6,
		lineCount: 9,
		sqrt255: Math.sqrt(255),
		deg2rad: function (degrees) {
			return degrees * this.piBy180;
		},
		piBy180: Math.PI / 180,
		circleFromThreePoints: function (p1, p2, p3) { // from Circle.js
			var x1 = p1.x;
			var y1 = p1.y;
			var x2 = p2.x;
			var y2 = p2.y;
			var x3 = p3.x;
			var y3 = p3.y;

			var a = x1 * (y2 - y3) - y1 * (x2 - x3) + x2 * y3 - x3 * y2;
			var b = (x1 * x1 + y1 * y1) * (y3 - y2) +
				(x2 * x2 + y2 * y2) * (y1 - y3) +
				(x3 * x3 + y3 * y3) * (y2 - y1);

			var c = (x1 * x1 + y1 * y1) * (x2 - x3) +
				(x2 * x2 + y2 * y2) * (x3 - x1) +
				(x3 * x3 + y3 * y3) * (x1 - x2);

			var x = -b / (2 * a);
			var y = -c / (2 * a);

			return {
				x: x,
				y: y,
				r: Math.hypot(x - x1, y - y1)
			};
		}
	},
	seismograph: {
		name: "Beatmograph 1",
		image: "visualizers/seismograph.png",
		start: function () {
			this.graph = new Array(size[0]);
			this.graph.fill(-1, 0, size[0]);
		},
		frame: function () {
			canvas.clearRect(0, 0, size[0], size[1]);
			let avg = visData.reduce((sum, num) => sum + num) / visData.length;
			this.graph.push(avg);
			while (this.graph.length > size[0]) {
				this.graph.shift();
			}
			var graphLength = this.graph.length;
			var multiplier = size[1] / 255;
			canvas.lineWidth = 2;
			for (var i = 0; i < graphLength; i++) {
				canvas.strokeStyle = getColor(this.graph[i], 255 - i / size[0] * 255);
				canvas.beginPath();
				canvas.moveTo(size[0] - i - 1.5, size[1] - (this.graph[i] * multiplier));
				canvas.lineTo(size[0] - i - 0.5, size[1] - (((typeof this.graph[i - 1] === "number") ? this.graph[i - 1] : this.graph[i]) * multiplier));
				canvas.stroke();
			}
		},
		stop: function () {
			this.graph = [];
		},
		graph: []
	},
	waveform: {
		name: "Waveform",
		image: "visualizers/waveform.png",
		start: function () {
			this.waveArray = new Uint8Array(analyser.fftSize);
			this.arrsize = analyser.fftSize;
		},
		frame: function () {
			analyser.getByteTimeDomainData(this.waveArray);
			canvas.clearRect(0, 0, size[0], size[1]);
			let avg = visData.reduce((sum, num) => sum + num) / visData.length;
			let multiplier = size[1] / 255;
			let step = this.arrsize / size[0];
			canvas.lineWidth = 2;

			for (let i = 0; i < size[0]; i++) {
				canvas.strokeStyle = getColor(avg, 255 - i / size[0] * 255);
				canvas.beginPath();
				canvas.moveTo(size[0] - i - 1.5, size[1] - (this.waveArray[Math.round(i * step)] / 2 * multiplier) - size[1] / 4);
				canvas.lineTo(size[0] - i - 0.5, size[1] - (((typeof this.waveArray[Math.round((i - 1) * step)] === "number") ? this.waveArray[Math.round((i - 1) * step)] / 2 : this.waveArray[Math.round(i * step)] / 2) * multiplier) - size[1] / 4);
				canvas.stroke();
			}
		},
		stop: function () {},
		waveArray: new Uint8Array()
	}
};

function setVis(newvis) {
	if (currVis) vis[currVis].stop();
	currVis = vis[newvis] ? newvis : "none";
	vis[currVis].start();
}

function loadAudio() {
	// https://stackoverflow.com/a/55270278/6456163
	let files = [];
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "./audio", false);
	xhr.onload = () => {
		if (xhr.status === 200) {
			var parser = new DOMParser();
			let HTML = parser.parseFromString(xhr.response, 'text/html');
			var elements = HTML.getElementsByTagName("a");
			for (x of elements) {
				let fileName = x.href;
				let fileNameParts = fileName.split("Music");
				if (supportedFormats.includes(fileName.split(".")[2])) {
					files.push(fileNameParts[0] + "Music/audio" + fileNameParts[1]);
				}
			};
		} else {
			alert('Request failed. Returned status of ' + xhr.status);
		}
	}

	xhr.send();
	return files;
}

function loadAudioFiles() {
	audio.pause();
	currentSong = -1;
	let filePaths = loadAudio();

	for (let i = 0; i < filePaths.length; i++) {
		let fileName = filePaths[i].split('audio/')[1].split(".")[0];
		fileNames.push([fileName, i, filePaths[i]]);
	}

	listSongs();
	var disabledElements = document.getElementsByClassName('disabled');
	while (disabledElements.length > 0) {
		disabledElements[0].classList.remove('disabled');
	}

	audioContext = new AudioContext();
	mediaSource = audioContext.createMediaElementSource(audio);
	delayNode = audioContext.createDelay();
	delayNode.delayTime.value = 0.07;
	delayNode.connect(audioContext.destination);

	analyser = audioContext.createAnalyser();
	analyser.fftSize = 2048;
	analyser.maxDecibels = -20;
	analyser.minDecibels = -60;
	analyser.smoothingTimeConstant = 0.8;

	mediaSource.connect(analyser);
	analyser.connect(delayNode);
	visData = new Uint8Array(analyser.frequencyBinCount);

	getId("visualizer").classList.add('disabled');
	getId("selectOverlay").classList.add('disabled');
	setVis("none");

	winsize = [window.innerWidth, window.innerHeight];
	size = [window.innerWidth - 8, window.innerHeight - 81];

	requestAnimationFrame(globalFrame);
}
loadAudioFiles();

for (var i in vis) {
	getId('visfield').innerHTML += '<option value="' + i + '">' + vis[i].name + '</option>';
}

function openVisualizerMenu() {
	if (getId("selectOverlay").classList.contains("disabled")) {
		getId("selectOverlay").classList.remove("disabled");
		var tempHTML = '';
		var namecolor = "";
		if ('none' === getId("visfield").value) {
			namecolor = ' style="outline:2px solid ' + getColor(255) + ';"';
		}
		if (vis.none.image) {
			tempHTML += '<div' + namecolor + ' class="visOption visNone" onclick="overrideVis(\'' + i + '\')"><img src="' + vis.none.image + '">' + vis.none.name + '</div>';
		} else {
			tempHTML += '<div' + namecolor + ' class="visOption visNone" onclick="overrideVis(\'' + i + '\')"><span></span>' + vis.none.name + '</div>';
		}
		tempHTML += '<div style="height:auto;background:none;"><hr></div>';
		tempHTML += '<div class="visCategory">&nbsp;<button onclick="this.parentElement.classList.toggle(\'hiddenCategory\')">&nbsp; v &nbsp;</button> Featured<br>';
		for (var i in vis) {
			if (i.indexOf("SEPARATOR") === -1) {
				if (i !== 'none') {
					var namecolor = "";
					if (i === getId("visfield").value) {
						namecolor = ' style="outline:2px solid ' + getColor(255) + ';"';
					}
					if (vis[i].image) {
						tempHTML += '<div' + namecolor + ' class="visOption" onclick="overrideVis(\'' + i + '\')"><img src="' + vis[i].image + '">' + vis[i].name + '&nbsp;</div>';
					} else {
						tempHTML += '<div' + namecolor + ' class="visOption" onclick="overrideVis(\'' + i + '\')"><span></span>' + vis[i].name + '</div>';
					}
				}
			} else {
				tempHTML += '</div><div style="height:auto;background:none;"><br></div>';
				tempHTML += '<div class="visCategory hiddenCategory">&nbsp;<button onclick="this.parentElement.classList.toggle(\'hiddenCategory\')">&nbsp; v &nbsp;</button> ' + vis[i].name + '<br>';
			}
		}
		tempHTML += '</div>';
		getId("selectContent").innerHTML = tempHTML;
		getId("selectContent").scrollTop = 0;
	} else {
		closeMenu();
	}
}

function overrideVis(selectedVisualizer) {
	getId("visfield").value = selectedVisualizer;
	closeMenu();
	getId("visfield").onchange();
}

function overrideColor(selectedColor) {
	getId("colorfield").value = selectedColor;
	closeMenu();
	getId("colorfield").onchange();
}

function overrideMod(selectedMod) {
	getId("modfield").value = selectedMod;
	closeMenu();
	getId("modfield").onchange();
}

function closeMenu() {
	getId("selectContent").innerHTML = "";
	getId("selectOverlay").classList.add("disabled");
}

var selfCloseEnabled = 0;
var selfCloseSongs = 10;

function toggleSelfClose() {
	selfCloseEnabled = Math.abs(selfCloseEnabled - 1);
	if (getId("selfclosebutton")) {
		getId("selfclosebutton").style.borderColor = debugColors[selfCloseEnabled];
	}
}

function checkSelfClose() {
	if (selfCloseEnabled) {
		selfCloseSongs--;
		if (selfCloseSongs <= 0) {
			getId("currentlyPlaying").innerHTML = "Window will close in 5 seconds."
			setTimeout(() => {
				remote.getCurrentWindow().close();
			}, 5000);
			return 1;
		} else {
			return 0;
		}
	} else {
		return 0;
	}
}