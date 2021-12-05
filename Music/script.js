var webVersion = 1;
var aosToolsConnected = 0;
var newScriptTag = document.createElement("script");
newScriptTag.setAttribute("data-light", "true");
newScriptTag.src = "../aosTools.js";
document.head.appendChild(newScriptTag);

window.aosTools_connectListener = function() {
	aosTools.openWindow();
	aosToolsConnected = 1;
	getId("tskbrModeRange").style.display = "none";
	aosTools.getBorders(recieveWindowBorders);
	aosTools.updateStyle = checkDarkTheme;
	checkDarkTheme();
}

// ask for window type
var windowType = "opaque";
if (!webVersion) {
	ipcRenderer.on("giveWindowType", function (e, arg) {
		windowType = arg.windowType;
		updateWindowType();
		remote.getCurrentWindow().setIgnoreMouseEvents(false);
	});

	function sendTypeRequest() {
		ipcRenderer.send("getWindowType");
	}
	window.requestAnimationFrame(sendTypeRequest);
}

// prevent the display from going to sleep
var preventingSleep = 0;
var sleepID = null;

function blockSleep() {
	if (!preventingSleep) {
		if (webVersion) {
			if (aosToolsConnected) {
				aosTools.blockScreensaver(() => {});
				preventingSleep = 1;
			}
		} else {
			sleepID = remote.powerSaveBlocker.start("prevent-display-sleep");
			preventingSleep = 1;
		}
	}
}

function unblockSleep() {
	if (preventingSleep) {
		if (webVersion) {
			if (aosToolsConnected) {
				aosTools.unblockScreensaver(() => {});
				preventingSleep = 0;
			}
		} else {
			remote.powerSaveBlocker.stop(sleepID);
			sleepID = null;
			preventingSleep = 0;
		}
	}
}

// web version can't be transparent or use system audio
getId("tskbrModeRange").style.display = "none";

window.onerror = function (errorMsg, url, lineNumber) {
	console.log("oof, u got a error\n\n" + url + '[' + lineNumber + ']:\n' + errorMsg);
}

function getId(target) {
	return document.getElementById(target);
}

function recieveWindowBorders(response) {
	windowBorders = [
		response.content.left + response.content.right,
		response.content.top + response.content.bottom,
		1
	];
}

function checkDarkTheme() {
	if (webVersion) {
		if (aosToolsConnected) {
			aosTools.getDarkMode((response) => {
				if (response.content === true) {
					document.body.classList.add("darkMode");
				} else {
					document.body.classList.remove("darkMode");
				}
			});
		}
	} else {
		if (remote.nativeTheme.shouldUseDarkColors) {
			document.body.classList.add("darkMode");
		} else {
			document.body.classList.remove("darkMode");
		}
	}
}

checkDarkTheme();
if (!webVersion) {
	remote.nativeTheme.on('updated', checkDarkTheme);
}

var audio = new Audio();
var audioDuration = 1;
var audioContext;
var mediaSource;
var delayNode;

function setVolume(newVolume) {
	audio.volume = newVolume;
}

var analyser;
function setSmoothingTimeConstant(newValue) {
	analyser.smoothingTimeConstant = newValue;
	localStorage.setItem("AaronOSMusic_SmoothingTimeConstant", String(newValue));
}

var visDataBuffer;
var visData;
var songList = getId("songList");
var progressBar = getId("progress");
var size;
var fileNames = [];
var fileInfo = {};
var latencyReduction = 0;
var currentSong = -1;
var winsize = [window.innerWidth, window.innerHeight];
var size = [window.innerWidth - 8, window.innerHeight - 81];
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

function readFileInfo(event) {
	try {
		fileInfo = JSON.parse(event.target.result);
	} catch (err) {
		console.log("Error parsing file info");
	}
}


var currVis = null;
var vis = {
	none: {
		name: "Song List",
		start: function () {
			getId("visualizer").classList.add("disabled");
			getId("songList").classList.remove("disabled");
		},
		frame: function () {
			
		},
		stop: function () {
			getId("visualizer").classList.remove("disabled");
			getId("songList").classList.add("disabled");
		}
	},
	reflection: {
		name: "Reflection",
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
			monstercatGradient.addColorStop(0, 'rgba(0, 0, 0, 0.85)'); // 0.8
			monstercatGradient.addColorStop(0.1, 'rgba(0, 0, 0, 0.9)'); // 0.9
			monstercatGradient.addColorStop(0.25, 'rgba(0, 0, 0, 0.95)');
			monstercatGradient.addColorStop(0.5, 'rgba(0, 0, 0, 1)'); // 1

			for (let i = 0; i < 64; i++) {
				var strength = visData[i];

				var fillColor = getColor(strength, i * 4);
				canvas.fillStyle = fillColor;
				canvas.fillRect(
					Math.round(left + i * barSpacing),
					Math.floor(size[1] / 2) - Math.round(strength / 255 * maxHeight),
					Math.round(barWidth),
					Math.round(strength / 255 * maxHeight + 5)
				);
				canvas.fillRect(
					Math.round(left + i * barSpacing),
					Math.floor(size[1] / 2) + 4,
					Math.round(barWidth),
					Math.round(strength / 255 * maxHeight + 4)
				);
			}

			canvas.fillStyle = monstercatGradient;
			canvas.fillRect(0, Math.round(size[1] / 2) + 4, size[0], Math.round(size[1] / 2) - 4);
		},
		stop: function () {

		},
		sqrt255: Math.sqrt(255)
	},
	monstercat: {
		name: "Monstercat",
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
	obelisks: {
		name: "Obelisks",
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
			monstercatGradient.addColorStop(0, 'rgba(0, 0, 0, 0.75)'); // 0.8
			monstercatGradient.addColorStop(0.1, 'rgba(0, 0, 0, 0.85)'); // 0.9
			monstercatGradient.addColorStop(0.25, 'rgba(0, 0, 0, 0.95)');
			monstercatGradient.addColorStop(0.5, 'rgba(0, 0, 0, 1)'); // 1

			for (var i = 0; i < 64; i++) {
				var strength = visData[i];

				var fillColor = getColor(strength, i * 4);
				canvas.fillStyle = "#000";
				canvas.fillRect(
					Math.round(left + i * barSpacing),
					Math.floor(size[1] / 2) - Math.round(strength / 255 * maxHeight),
					Math.round(barWidth),
					Math.round(strength / 255 * maxHeight + 5)
				);
				canvas.fillRect(
					Math.round(left + i * barSpacing),
					Math.floor(size[1] / 2) + 4,
					Math.round(barWidth),
					Math.round(strength / 255 * maxHeight + 4)
				);
			}

			canvas.fillStyle = monstercatGradient;
			canvas.fillRect(0, Math.round(size[1] / 2) + 4, size[0], Math.round(size[1] / 2) - 4);
			canvas.fillStyle = '#FFF';
			canvas.font = "12px aosProFont, Courier, monospace";
			canvas.fillText("Enable Smoke for this visualizer.", Math.round(left) + 0.5, size[1] * 0.25, Math.floor(maxWidth));
		},
		stop: function () {

		},
		sqrt255: Math.sqrt(255)
	},
	central: {
		name: "Central",
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
	wave: {
		name: "Wave",
		start: function () {

		},
		frame: function () {
			canvas.clearRect(0, 0, size[0], size[1]);
			var step = size[0] / 64;
			var last = -1;
			var heightFactor = (size[1] / 3) / 255;
			var widthFactor = 64 / size[0] * 2;

			for (var i = 0; i < size[0] / 2; i++) {
				// width is larger than data
				var pcnt = i / (size[0] / 2);
				var closestPoint = visData[Math.floor(pcnt * 64)];
				var nextPoint = visData[Math.floor(pcnt * 64) + 1];
				if (nextPoint === undefined) {
					nextPoint = closestPoint;
				}
				var u = pcnt * 64 - Math.floor(pcnt * 64);
				this.drawLine(i, ((1 - u) * closestPoint) + (u * nextPoint), heightFactor, widthFactor);
			}
		},
		stop: function () {

		},
		drawLine: function (x, h, fact, widthFact) {
			var fillColor = getColor(h, x / (size[0] / 2) * 255);
			canvas.fillStyle = fillColor;
			canvas.fillRect(x + size[0] / 2, (255 - h) * fact - 2 + (size[1] / 6), 1, h * fact * 2 + 4);
			if (x !== 0) {
				canvas.fillRect(size[0] / 2 - x, (255 - h) * fact - 2 + (size[1] / 6), 1, h * fact * 2 + 4);
			}
		}
	},
	edgeBars: {
		name: "Edge Bars",
		start: function () {

		},
		frame: function () {
			canvas.clearRect(0, 0, size[0], size[1]);
			var left = size[1] * 0.1;
			var maxWidth = size[1] * 0.8;
			var barWidth = maxWidth / 96;
			var barSpacing = maxWidth / 64;
			var maxHeight = size[0] * 0.025;

			for (var i = 0; i < 64; i++) {
				strength = visData[i];

				var fillColor = getColor(strength, i * 4);
				canvas.fillStyle = fillColor;
				canvas.fillRect(
					0,
					Math.round(size[1] - (left + i * barSpacing)),
					Math.round(strength / 255 * maxHeight + 3),
					Math.round(barWidth)
				);
				canvas.fillRect(
					Math.floor(size[0] - Math.round(strength / 255 * maxHeight) - 3),
					Math.round(size[1] - (left + i * barSpacing)),
					Math.round(strength / 255 * maxHeight + 3),
					Math.round(barWidth)
				);
			}
		},
		stop: function () {

		},
		sqrt255: Math.sqrt(255)
	},
	bottomBars: {
		name: "Bottom Bars",
		start: function () {

		},
		frame: function () {
			canvas.clearRect(0, 0, size[0], size[1]);
			var left = size[0] * 0.1;
			var maxWidth = size[0] * 0.8;
			var barWidth = maxWidth / 96;
			var barSpacing = maxWidth / 64;
			var maxHeight = size[1] * 0.05;

			for (var i = 0; i < 64; i++) {
				strength = visData[i];

				var fillColor = getColor(strength, i * 4);
				canvas.fillStyle = fillColor;
				canvas.fillRect(
					Math.round(left + i * barSpacing),
					size[1] - (strength / 255 * maxHeight + 3),
					Math.round(barWidth),
					(strength / 255 * maxHeight + 3)
				);
			}
		},
		stop: function () {

		},
		sqrt255: Math.sqrt(255)
	},
	bottomSpectrum: {
		name: "Bottom Spectrum",
		start: function () {

		},
		frame: function () {
			canvas.clearRect(0, 0, size[0], size[1]);
			var step = size[0] / 64;
			var last = -1;
			for (var i = 0; i < 65; i++) {
				var strength = 0;
				if (i === 0) {
					strength = visData[i];
					this.drawLine(0, strength);
				} else {
					var last = Math.floor(step * (i - 1));
					var curr = Math.floor(step * i);
					var next = Math.floor(step * (i + 1));
					if (last < curr - 1) {
						// stretched
						for (var j = 0; j < curr - last - 1; j++) {
							var pcntBetween = j / (curr - last - 1);
							strength = visData[i] * pcntBetween + visData[i - 1] * (1 - pcntBetween);
							this.drawLine(curr - (curr - last - 1 - j), strength);
						}
						strength = visData[i];
						this.drawLine(curr, strength);
					} else if (curr === last && next > curr) {
						// compressed
						for (var j = 0; j < (1 / step); j++) {
							strength += visData[i - j];
						}
						strength /= Math.floor(1 / step) + 1;
						this.drawLine(curr, strength);
					} else if (last === curr - 1) {
						strength = visData[i];
						this.drawLine(curr, strength);
					}
				}
			}
		},
		stop: function () {

		},
		drawLine: function (x, colorAmount) {
			canvas.fillStyle = getColor(colorAmount, x * (255 / size[0]));
			canvas.fillRect(x, size[1] - (colorAmount / 8 + 1), 1, colorAmount / 8 + 1);
		}
	},
	spectrum: {
		name: "Spectrum",
		start: function () {

		},
		frame: function () {
			canvas.clearRect(0, 0, size[0], size[1]);
			var step = size[0] / 64;
			var last = -1;
			for (var i = 0; i < 65; i++) {
				var strength = 0;
				if (i === 0) {
					strength = visData[i];
					this.drawLine(0, strength);
				} else {
					var last = Math.floor(step * (i - 1));
					var curr = Math.floor(step * i);
					var next = Math.floor(step * (i + 1));
					if (last < curr - 1) {
						// stretched
						for (var j = 0; j < curr - last - 1; j++) {
							//strength = ((j + 1) / (curr - last + 1) * visData[i - 1] + (curr - last - j + 1) / (curr - last + 1) * visData[i]);
							var pcntBetween = j / (curr - last - 1);
							strength = visData[i] * pcntBetween + visData[i - 1] * (1 - pcntBetween);
							this.drawLine(curr - (curr - last - 1 - j), strength);
						}
						strength = visData[i];
						this.drawLine(curr, strength);
					} else if (curr === last && next > curr) {
						// compressed
						for (var j = 0; j < (1 / step); j++) {
							strength += visData[i - j];
						}
						strength /= Math.floor(1 / step) + 1;
						this.drawLine(curr, strength);
					} else if (last === curr - 1) {
						strength = visData[i];
						this.drawLine(curr, strength);
					}
				}
			}
		},
		stop: function () {

		},
		drawLine: function (x, colorAmount) {
			canvas.fillStyle = getColor(colorAmount, x * (255 / size[0]));
			canvas.fillRect(x, 0, 1, size[1]);
		}
	},
	spectrumCentered: {
		name: "Centered Spectrum",
		start: function () {

		},
		frame: function () {
			canvas.clearRect(0, 0, size[0], size[1]);
			var step = size[0] / 2 / 64;
			var last = -1;
			for (var i = 0; i < 65; i++) {
				var strength = 0;
				if (i === 0) {
					strength = visData[i];
					this.drawLine(0, strength);
				} else {
					var last = Math.floor(step * (i - 1));
					var curr = Math.floor(step * i);
					var next = Math.floor(step * (i + 1));
					if (last < curr - 1) {
						// stretched
						for (var j = 0; j < curr - last - 1; j++) {
							//strength = ((j + 1) / (curr - last + 1) * visData[i - 1] + (curr - last - j + 1) / (curr - last + 1) * visData[i]);
							var pcntBetween = j / (curr - last - 1);
							strength = visData[i] * pcntBetween + visData[i - 1] * (1 - pcntBetween);
							this.drawLine(curr - (curr - last - 1 - j), strength);
						}
						strength = visData[i];
						this.drawLine(curr, strength);
					} else if (curr === last && next > curr) {
						// compressed
						for (var j = 0; j < (1 / step); j++) {
							strength += visData[i - j];
						}
						strength /= Math.floor(1 / step) + 1;
						this.drawLine(curr, strength);
					} else if (last === curr - 1) {
						strength = visData[i];
						this.drawLine(curr, strength);
					}
				}
			}
		},
		stop: function () {

		},
		drawLine: function (x, colorAmount) {
			canvas.fillStyle = getColor(colorAmount, x * (255 / (size[0] / 2)));
			canvas.fillRect(x + size[0] / 2, 0, 1, size[1]);
			if (x !== 0) {
				canvas.fillRect(size[0] / 2 - x, 0, 1, size[1]);
			}
		}
	},
	windowRecolor: {
		name: "Window Color",
		start: function () {

		},
		frame: function () {
			var avg = 0;
			for (let i = 0; i < 64; i++) {
				avg += Math.sqrt(visData[i]) * this.sqrt255;
			}

			avg /= 64;
			canvas.clearRect(0, 0, size[0], size[1]);
			canvas.fillStyle = getColor(avg);
			canvas.fillRect(0, 0, size[0], size[1]);
			canvas.fillStyle = "#FFF";
			canvas.font = "12px aosProFont, Courier, monospace";
			canvas.fillText("Load this visualizer in AaronOS and your window borders will color themselves to the beat.", 10.5, 20);
			document.title = "WindowRecolor:" + getColor(avg);
		},
		stop: function () {
			document.title = "AaronOS Music Player";
		},
		sqrt255: Math.sqrt(255)
	},
	solidColor: {
		name: "Solid Color",
		start: function () {

		},
		frame: function () {
			var avg = 0;
			for (var i = 0; i < 64; i++) {
				avg += Math.sqrt(visData[i]) * this.sqrt255;
			}

			avg /= 64;
			canvas.clearRect(0, 0, size[0], size[1]);
			canvas.fillStyle = getColor(avg);
			canvas.fillRect(0, 0, size[0], size[1]);
		},
		stop: function () {

		},
		sqrt255: Math.sqrt(255)
	},
	waveform: {
		name: "Waveform",
		start: function () {
			this.waveArray = new Uint8Array(analyser.fftSize);
			this.arrsize = analyser.fftSize;
		},
		frame: function () {
			analyser.getByteTimeDomainData(this.waveArray);
			canvas.clearRect(0, 0, size[0], size[1]);
			var avg = 0;
			for (let i = 0; i < 12; i++) {
				avg += visData[i];
			}
			avg /= 12;
			var multiplier = size[1] / 255;
			var step = this.arrsize / size[0];
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
	},
	realseismograph: {
		name: "Seismograph",
		start: function () {
			this.graph = new Array(Math.floor(size[1] / 2));
			this.graph.fill([-1, 0], 0, Math.floor(size[1] / 2));
			this.waveArray = new Uint8Array(1);
		},
		frame: function () {
			analyser.getByteTimeDomainData(this.waveArray);

			var avgVolume = 0;
			for (let i = 0; i < 12; i++) {
				avgVolume += Math.sqrt(visData[i]) * this.sqrt255;
			}
			avgVolume /= 12;

			canvas.clearRect(0, 0, size[0], size[1]);
			this.graph.push([this.waveArray[0], avgVolume]);
			while (this.graph.length > Math.floor(size[1] / 2)) {
				this.graph.shift();
			}
			var graphLength = this.graph.length;
			var multiplier = size[0] / 255;
			canvas.lineWidth = 2;
			for (let i = 0; i < graphLength; i++) {
				canvas.strokeStyle = getColor(this.graph[i][1], 255 - i / size[0] * 255);
				canvas.beginPath();
				canvas.moveTo(this.graph[i][0] * multiplier, size[1] - i * 2 - 2);
				canvas.lineTo(((typeof this.graph[i - 1] === "object") ? this.graph[i - 1] : this.graph[i])[0] * multiplier, size[1] - i * 2);
				canvas.stroke();
			}
		},
		stop: function () {
			this.graph = [];
		},
		graph: [],
		sqrt255: Math.sqrt(255)
	},
	avgPitch: {
		name: "Average Pitch",
		start: function () {

		},
		frame: function () {
			canvas.clearRect(0, 0, size[0], size[1]);
			var mult = size[0] / 64;
			for (let i = 1; i < 10; i++) {
				if (this.history[i].length === 0) continue;

				canvas.globalAlpha = Math.sqrt(i - 1) * 3.16227766 / 10;
				canvas.fillStyle = getColor(this.history[i][1], this.history[i][2] / 4);
				canvas.fillRect(this.history[i - 1][0], 0, this.history[i][0] - this.history[i - 1][0], size[1]);
			}
			var avgPitch = 0;
			var avgPitchMult = 0;
			var avgVolume = 0;
			for (let i = 0; i < 12; i++) {
				avgVolume += Math.sqrt(visData[i]) * this.sqrt255;
			}
			for (var i = 0; i < 64; i++) {
				avgPitch += i * visData[i];
				avgPitchMult += visData[i];
			}
			avgVolume /= 12;
			avgPitch /= avgPitchMult;
			canvas.globalAlpha = 1;
			canvas.fillStyle = getColor(avgVolume, avgPitch * 4);
			canvas.fillRect(this.history[9][0], 0, Math.round(avgPitch * mult) - this.history[9][0], size[1]);
			this.history.shift();
			this.history[9] = [Math.round(avgPitch * mult), avgVolume, avgPitch];
		},
		stop: function () {
			this.history = [
				[],
				[],
				[],
				[],
				[],
				[],
				[],
				[],
				[],
				[]
			];
		},
		history: [
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[]
		],
		sqrt255: Math.sqrt(255)
	},
	colorTest2: {
		name: "2D Color Test",
		start: function () {
			canvas.clearRect(0, 0, size[0], size[1]);
			var leftEdge = size[0] / 2 - 128;
			var bottomEdge = size[1] / 2 + 128;
			for (var i = 0; i < 256; i++) {
				for (var j = 0; j < 256; j++) {
					canvas.fillStyle = getColor(i, j);
					canvas.fillRect(leftEdge + j, bottomEdge - i, 1, 1);
				}
			}
		},
		frame: function () {},
		stop: function () {

		},
		sizechange: function () {
			canvas.clearRect(0, 0, size[0], size[1]);
			var leftEdge = size[0] / 2 - 128;
			var bottomEdge = size[1] / 2 + 128;
			for (var i = 0; i < 256; i++) {
				for (var j = 0; j < 256; j++) {
					canvas.fillStyle = getColor(i, j);
					canvas.fillRect(leftEdge + j, bottomEdge - i, 1, 1);
				}
			}
		}
	},
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
	latencyReduction = 1;
	analyser.maxDecibels = -20;
	analyser.minDecibels = -60;
	if (localStorage.getItem("AaronOSMusic_SmoothingTimeConstant")) {
		analyser.smoothingTimeConstant = parseFloat(localStorage.getItem("AaronOSMusic_SmoothingTimeConstant"));
		getId("currentlyPlaying").innerHTML += " | SmoothingTimeConstant is custom";
	} else {
		analyser.smoothingTimeConstant = 0.8;
	}
	mediaSource.connect(analyser);
	analyser.connect(delayNode);

	visData = new Uint8Array(analyser.frequencyBinCount);

	getId("introduction").classList.add('disabled');
	getId("visualizer").classList.add('disabled');
	getId("selectOverlay").classList.add('disabled');
	setVis("none");

	winsize = [window.innerWidth, window.innerHeight];
	size = [window.innerWidth - 8, window.innerHeight - 81];

	requestAnimationFrame(globalFrame);
}
loadAudioFiles();

function selectSong(id) {
	currentSong = id;
	audio.pause();
	audio.currentTime = 0;
	audio.src = fileNames[id][2];
	blockSleep();
	getId("currentlyPlaying").innerHTML = fileNames[id][1] + ": " + fileNames[id][0];
	document.title = fileNames[id][0] + " - AaronOS Music Player";
	if (webVersion && aosToolsConnected) {
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
	if (currentSong == -1) return;

	let timeToSet = e.pageX - 5;
	if (timeToSet < 5) timeToSet = 0;
	timeToSet /= size[0]; // TODO
	timeToSet *= audio.duration;
	audio.currentTime = timeToSet;

	if (ambienceWaiting) {
		ambienceWaiting = 0;
		clearTimeout(ambienceTimeout);
		getId("currentlyPlaying").innerHTML = fileNames[currentSong][1] + ": " + fileNames[currentSong][0];
	}
}

function back() {
	if (audio.currentTime < 3) {
		currentSong--;
		if (currentSong < 0) currentSong = fileNames.length - 1;
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
		if (currentSong > fileNames.length - 1) currentSong = 0;
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

audio.addEventListener("ended", songEnd);
function songEnd() {
	var windowWillClose = checkSelfClose();
	if (windowWillClose) return;
	if (!ambienceMode) return next();

	var randomTime = Math.floor(Math.random() * 300000) + 1;
	var randomTimeSeconds = Math.floor(randomTime / 1000);
	var randomTimeMinutes = Math.floor(randomTimeSeconds / 60);
	randomTimeSeconds -= randomTimeMinutes * 60;
	getId("currentlyPlaying").innerHTML = "Next song in " + randomTimeMinutes + ":" + randomTimeSeconds;
	ambienceTimeout = setTimeout(ambienceNext, randomTime);
	ambienceWaiting = 1;
	getId("playbutton").innerHTML = "&#9658;";
}

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

var ambienceMode = 0;
var lastSecond = 0;
var perfLast = performance.now();
var perfCurrent = perfLast;

function globalFrame() {
	requestAnimationFrame(globalFrame);
	perfLast = perfCurrent;
	perfCurrent = performance.now();

	if (winsize[0] !== window.innerWidth || winsize[1] !== window.innerHeight) {
		winsize = [window.innerWidth, window.innerHeight];
		size = [window.innerWidth - 8, window.innerHeight - 81];

		if (currVis !== "none" && vis[currVis].sizechange) {
			vis[currVis].sizechange();
		}
	}

	if (currVis !== "none") {
		if (latencyReduction !== 2) {
			analyser.getByteFrequencyData(visData);
		} else {
			analyser.getByteFrequencyData(visDataBuffer);
		}

		// if the audio's volume is lowered, the visualizer can't hear it
		// attempt to artificially bring the volume back up to full
		// very mixed results
		if (audio.volume < 0.9) {
			var gainFactor = 0.9 - audio.volume + 1;
			for (var i = 0; i < visData.length; i++) {
				visData[i] = Math.floor(visData[i] * gainFactor);
			}
		}

		// do the visualizer
		vis[currVis].frame();
		var currSecond = (new Date().getSeconds());
		if (currSecond !== lastSecond) {
			lastSecond = currSecond;
		}
	}
}

var pink = {
	func: function() {
		return '#fe00c0';
	}
}

progressBar.style.outline = "2px solid " + getColor(255);
function getColor(power, position) {
	return pink.func(power, position);
}

function updateProgress() {
	progressBar.style.width = audio.currentTime / audioDuration * 100 + "%";
	progressBar.style.backgroundColor = getColor(audio.currentTime / audioDuration * 255);
	requestAnimationFrame(updateProgress);
}
requestAnimationFrame(updateProgress);

var selfCloseEnabled = 0;
var selfCloseSongs = 10;

function checkSelfClose() {
	if (!selfCloseEnabled) return 0;
	selfCloseSongs--;
	if (selfCloseSongs > 0) return 0;

	getId("currentlyPlaying").innerHTML = "Window will close in 5 seconds."
	setTimeout(() => {
		remote.getCurrentWindow().close();
	}, 5000);
	return 1;
}

var taskbarMode = 0;
function toggleTaskbarMode() {
	if (taskbarMode) {
		remote.getCurrentWindow().setBounds({
			x: (screen.width - 1048) / 2,
			y: (screen.height - 632) / 2,
			width: 1048,
			height: 650
		});
		taskbarMode = 0;
		getId("taskbarButton").style.borderColor = "#C00";
	} else {
		remote.getCurrentWindow().setBounds({
			x: -9,
			y: screen.height - 148,
			width: screen.width + 17,
			height: 160
		});
		taskbarMode = 1;
		getId("taskbarButton").style.borderColor = "#0A0";
	}
}

if (!webVersion) {
	delete vis.windowRecolor;
	delete vis.bassWindowRecolor;
	getId("filesNotUploadedDisclaimer").style.display = "none";
}