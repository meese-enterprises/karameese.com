const SaveMaster = () => {

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

} // End initial variable declaration