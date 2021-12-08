import { getId } from "./HelperFunctions.js";
import { AudioVisualizer } from "./AudioVisualizer.js";
const vis = AudioVisualizer;
const currVis = "waveform";

var aosToolsConnected = 0;
var newScriptTag = document.createElement("script");
newScriptTag.setAttribute("data-light", "true");
newScriptTag.src = "../aosTools.js";
document.head.appendChild(newScriptTag);

window.aosTools_connectListener = function () {
	aosTools.openWindow();
	aosToolsConnected = 1;
}

// prevent the display from going to sleep
var preventingSleep = 0;
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

var audio = new Audio();
window.audio = audio;
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

const setVolume = (newVolume) => audio.volume = newVolume;
window.setVolume = setVolume;

var songList = getId("songList");
var progressBar = getId("progress");
var fileNames = [];
window.fileNames = fileNames;
var fileInfo = {};
var currentSong = -1;
window.currentSong = currentSong;
var winsize = [window.innerWidth, window.innerHeight];
window.size = [window.innerWidth - 8, window.innerHeight - 81];
var supportedFormats = ['aac', 'aiff', 'wav', 'm4a', 'mp3', 'amr', 'au', 'weba', 'oga', 'wma', 'flac', 'ogg', 'opus', 'webm'];

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
window.selectSong = selectSong;

function play() {
	if (currentSong === -1) {
		selectSong(0);
	} else {
		audio.play();
		blockSleep();
	}

	getId("playbutton").innerHTML = "<b>&nbsp;||&nbsp;</b>";
}
window.play = play;

function pause() {
	audio.pause();
	unblockSleep();
	getId("playbutton").innerHTML = "&#9658;";
}
window.pause = pause;

function firstPlay() {
	audioDuration = audio.duration;
	play();
}
audio.addEventListener("canplaythrough", firstPlay);

function setProgress(e) {
	if (currentSong == -1) return;

	let timeToSet = e.pageX - 5;
	if (timeToSet < 5) timeToSet = 0;
	timeToSet /= size[0];
	timeToSet *= audio.duration;
	audio.currentTime = timeToSet;
}
window.setProgress = setProgress;

function back() {
	if (audio.currentTime >= 3) return audio.currentTime = 0;
	currentSong--;
	if (currentSong < 0) currentSong = fileNames.length - 1;
	selectSong(currentSong);
}
window.back = back;

function next() {
	currentSong++;
	if (currentSong > fileNames.length - 1) currentSong = 0;
	selectSong(currentSong);
}
window.next = next;

function songEnd() {
	if (!willWindowClose()) next();
}

audio.addEventListener("ended", songEnd);
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		let temp = array[i];
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
window.shuffle = shuffle;

var perfLast = performance.now();
var perfCurrent = perfLast;

function globalFrame() {
	requestAnimationFrame(globalFrame);
	perfLast = perfCurrent;
	perfCurrent = performance.now();

	if (winsize[0] !== window.innerWidth || winsize[1] !== window.innerHeight) {
		winsize = [window.innerWidth, window.innerHeight];
		window.size = [window.innerWidth - 8, window.innerHeight - 81];
		// TODO!
		getId("visCanvas").width = window.size[0]; // * 0.7;
		getId("visCanvas").height = window.size[1]; // * 0.7;
		if (currVis !== "none" && vis[currVis].sizechange) {
			vis[currVis].sizechange();
		}
	}

	if (currVis == "none") return;
	window.analyser.getByteFrequencyData(window.visData);

	// If the audio's volume is lowered, the visualizer can't hear it, so
	// this attempts to artificially bring the volume back up to full
	if (audio.volume < 0.9) {
		var gainFactor = 0.9 - audio.volume + 1;
		for (let i = 0; i < window.visData.length; i++) {
			window.visData[i] = Math.floor(window.visData[i] * gainFactor);
		}
	}

	// Modify the data values with Power
	for (let i = 0; i < 128; i++) {
		window.visData[i] = Math.pow(window.visData[i], 2) / 255;
	}

	// Do the visualizer
	vis[currVis].frame();
}

var automaticColorCtx = null;
var automaticColor = {
	colorType: 'peak',
	colorArr: ['#005500', '#00FF00', '#FF0000'],
	resultList: new Array(512)
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
window.getColor = getColor;
progressBar.style.outline = "2px solid " + getColor(255);

function loadAudio() {
	// https://stackoverflow.com/a/55270278/6456163
	let files = [];
	let xhr = new XMLHttpRequest();
	xhr.open("GET", "./audio", false);
	xhr.onload = () => {
		if (xhr.status !== 200) return alert('Request failed. Returned status of ' + xhr.status);
		let parser = new DOMParser();
		let HTML = parser.parseFromString(xhr.response, 'text/html');
		let elements = HTML.getElementsByTagName("a");
		for (let x of elements) {
			let fileName = x.href;
			let fileNameParts = fileName.split("Music");
			if (supportedFormats.includes(fileName.split(".")[2])) {
				files.push(fileNameParts[0] + "Music/audio" + fileNameParts[1]);
			}
		};
	}

	xhr.send();
	return files;
}

function loadAudioFiles() {
	audio.pause();
	currentSong = -1;
	const filePaths = loadAudio();

	for (let i = 0; i < filePaths.length; i++) {
		let fileName = filePaths[i].split('audio/')[1].split(".")[0];
		fileNames.push([fileName, i, filePaths[i]]);
	}

	listSongs();
	const disabledElements = document.getElementsByClassName('disabled');
	while (disabledElements.length > 0) {
		disabledElements[0].classList.remove('disabled');
	}

	audioContext = new AudioContext({
		latencyHint: 'playback',
		//sampleRate: 8000,
	});
	
	mediaSource = audioContext.createMediaElementSource(audio);
	delayNode = audioContext.createDelay();
	delayNode.delayTime.value = 0.07;
	delayNode.connect(audioContext.destination);

	window.analyser = audioContext.createAnalyser();
	window.analyser.fftSize = 2048;
	window.analyser.maxDecibels = -20;
	window.analyser.minDecibels = -60;
	window.analyser.smoothingTimeConstant = 0.8;

	mediaSource.connect(window.analyser);
	window.analyser.connect(delayNode);
	window.visData = new Uint8Array(window.analyser.frequencyBinCount);

	winsize = [window.innerWidth, window.innerHeight];
	window.size = [window.innerWidth - 8, window.innerHeight - 81];

	vis[currVis].start();
	requestAnimationFrame(globalFrame);
}
loadAudioFiles();

var selfCloseEnabled = 0;
var selfCloseSongs = 10;

function willWindowClose() {
	if (!selfCloseEnabled) return 0;

	selfCloseSongs--;
	if (selfCloseSongs > 0) return 0;
	getId("currentlyPlaying").innerHTML = "Window will close in 5 seconds."
	setTimeout(() => {
		remote.getCurrentWindow().close();
	}, 5000);
	return 1;
}