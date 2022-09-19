import { getId } from "./HelperFunctions.js";
import { AudioVisualizer } from "./AudioVisualizer.js";
const vis = AudioVisualizer;
const currVis = "waveform";

let devToolsConnected = 0;
const newScriptTag = document.createElement("script");
newScriptTag.setAttribute("data-light", "true");
newScriptTag.src = "../devTools.js";
document.head.appendChild(newScriptTag);

window.devTools_connectListener = function () {
	devTools.openWindow();
	devToolsConnected = 1;
};

const audio = new Audio();
window.audio = audio;

let audioContext;
let mediaSource;
let delayNode;

const setVolume = (newVolume) => (audio.volume = newVolume);
window.setVolume = setVolume;

const fileNames = [];
window.fileNames = fileNames;
var currentSong = -1;
window.currentSong = currentSong;
let winsize = [window.innerWidth, window.innerHeight];
window.size = [window.innerWidth - 8, window.innerHeight - 81];
const supportedFormats = [
	"aac",
	"aiff",
	"wav",
	"m4a",
	"mp3",
	"amr",
	"au",
	"weba",
	"oga",
	"wma",
	"flac",
	"ogg",
	"opus",
	"webm",
];

function selectSong(id) {
	if (!fileNames.length) return;
	currentSong = id;
	audio.pause();
	audio.currentTime = 0;
	audio.src = fileNames[id][2];
	getId("currentlyPlaying").innerHTML = `
		<p class="marqueetext1">${fileNames[id][0]}</p>
	`;
	if (devToolsConnected) {
		devTools.sendRequest({
			action: "appwindow:set_caption",
			content: "Music Player",
			conversation: "set_caption",
		});
	}
}
window.selectSong = selectSong;

/** Play or pause audio, depending on which state was previously in play. */
window.toggleAudioState = () => (audio.paused ? play() : pause());
function play() {
	if (currentSong === -1) {
		shuffle();
	} else {
		audio.play();
	}

	getId("playpauseicon").src = "pause.svg";
}
function pause() {
	audio.pause();
	getId("playpauseicon").src = "play.svg";
}

audio.addEventListener("canplaythrough", play);

function back() {
	if (audio.currentTime >= 3) return (audio.currentTime = 0);
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
	next();
}

audio.addEventListener("ended", songEnd);
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}

function shuffle() {
	audio.pause();
	audio.currentTime = 0;
	currentSong = 0;
	shuffleArray(fileNames);
	selectSong(0);
}

let perfLast = performance.now();
let perfCurrent = perfLast;

function globalFrame() {
	requestAnimationFrame(globalFrame);
	perfLast = perfCurrent;
	perfCurrent = performance.now();

	if (winsize[0] !== window.innerWidth || winsize[1] !== window.innerHeight) {
		winsize = [window.innerWidth, window.innerHeight];
		window.size = [window.innerWidth, window.innerHeight];
		getId("visCanvas").width = window.size[0];
		getId("visCanvas").height = window.size[1];
	}

	window.analyser.getByteFrequencyData(window.visData);

	// If the audio's volume is lowered, the visualizer can't hear it, so
	// this attempts to artificially bring the volume back up to full
	if (audio.volume < 0.9) {
		const gainFactor = 0.9 - audio.volume + 1;
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

/**
 * Loads all the audio files in the given URL directory.
 * @link https://stackoverflow.com/a/48969580/6456163
 *
 * @param {String} [url="./audio"] The URL to load the audio files from
 * @returns {Promise<Array>}
 */
function loadAudio(url = "./audio") {
	const files = [];

	return new Promise((resolve, reject) => {
		// https://stackoverflow.com/a/55270278/6456163
		const xhr = new XMLHttpRequest();
		xhr.open("GET", url);
		xhr.onload = () => {
			if (xhr.status !== 200) {
				reject("Request failed. Returned status of " + xhr.status);
			}

			const parser = new DOMParser();
			const HTML = parser.parseFromString(xhr.response, "text/html");
			const elements = HTML.getElementsByTagName("a");
			for (const elem of elements) {
				const filePath = elem.href;
				const extension = filePath.split(".").pop();

				// Ensure that only audio files are loaded
				if (supportedFormats.includes(extension)) {
					// Push the correct file path to the files array
					const filePathParts = filePath.split("Music");
					const file = filePathParts[0] + "Music/audio" + filePathParts[1];
					files.push(file);
				}
			}

			resolve(files);
		};
		xhr.onerror = function () {
			reject({
				status: this.status,
				statusText: xhr.statusText
			});
		};

		xhr.send();
	});
}

async function loadAudioFiles() {
	audio.pause();
	currentSong = -1;
	const filePaths = await loadAudio();

	for (let i = 0; i < filePaths.length; i++) {
		const fileName = filePaths[i].split("audio/")[1].split(".")[0];
		fileNames.push([decodeURI(fileName), i, filePaths[i]]);
	}

	audioContext = new AudioContext({
		latencyHint: "playback",
		// sampleRate: 8000,
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

	console.log("All audio assets are loaded...");
	play();
}
loadAudioFiles();
