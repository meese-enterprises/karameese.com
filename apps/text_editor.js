const TextEditor = () => {

apps.notepad = new Application({
	title: "Text Editor",
	abbreviation: "TEX",
	codeName: "notepad",
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
				'<iframe id="np2Env" src="ace/textEdit.html" data-parent-app="notepad" onload="apps.notepad.vars.catchError()" style="width:100%; height:calc(100% - 17px); position:absolute; border:none; bottom:0px;"></iframe>' +
				'<div class="darkResponsive" style="width:100%; border-bottom:1px solid; height:16px;">' +
				'<input class="darkResponsive" id="np2Load" placeholder="file name" style="padding-left:3px; font-family: aosProFont, monospace; font-size:12px; left: 16px; border:none; height:16px; border-left:1px solid; border-right:1px solid; position:absolute; top:0; width:calc(100% - 115px);"></input>' +
				'<div id="np2Mode" onclick="apps.notepad.vars.toggleFileMode()" class="cursorPointer noselect" style="color:#7F7F7F; font-family:aosProFont, monospace; font-size:12px; height:16px;line-height:16px; padding-right:3px; padding-left: 3px; right:95px">Text Mode</div>' +
				'<div class="darkResponsive" onclick="apps.notepad.vars.openFile(getId(\'np2Load\').value)" class="cursorPointer noselect" style="font-family:aosProFont, monospace; font-size:12px; height:16px; line-height:16px; top:0; right:55px; text-align:center;width:38px; border-left:1px solid; border-right:1px solid;">Load</div> ' +
				'<div class="darkResponsive" onclick="apps.notepad.vars.saveFile(getId(\'np2Load\').value)" class="cursorPointer noselect" style="font-family:aosProFont, monospace; font-size:12px; height:16px; line-height:16px; top:0; right:16px; text-align:center;width:38px; border-left:1px solid; border-right:1px solid;">Save</div> ' +
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
			if (!apps.notepad.appWindow.appIcon) {
				openapp(apps.notepad, "dsktp");
			} else {
				openapp(apps.notepad, 'tskbr');
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
					toTop(apps.notepad);
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
							toTop(apps.notepad);
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
					toTop(apps.notepad);
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

} // End initial variable declaration