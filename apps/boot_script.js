const BootScript = () => {

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
			if (ufload("system/user_boot_script")) {
				doLog("moving user bootscript to new folder");
				var theBootScript = ufload("system/user_boot_script");
				ufsave("system/apps/bootScript/main", theBootScript);
				ufdel("system/user_boot_script");
			}
			var bootScripts = ufload("system/apps/bootScript");
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
			if (ufload("system/apps/bootScript/" + scriptName)) {
				if (
					ufload('system/apps/bootScript/' + cleanStr(this.currScript)) !== getId("BtS_edit_frame").contentWindow.editor.getValue() &&
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
								getId("BtS_edit_frame").contentWindow.editor.session.setValue(ufload("system/apps/bootScript/" + cleanStr(scriptName)));
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
					getId("BtS_edit_frame").contentWindow.editor.session.setValue(ufload("system/apps/bootScript/" + cleanStr(scriptName)));
					getId('BtS_edit_frame').contentWindow.editor.scrollToLine(0);
					getId("BtS_script_" + scriptName).style.color = "#0AA";
				}
			}
		},
		newScript: function() {
			apps.prompt.vars.prompt("Please enter a name for the new script.<br><br>Leave blank to cancel.", "Submit", function (str) {
				if (str) {
					if (!ufload("system/apps/bootScript").hasOwnProperty(cleanStr(str))) {
						apps.bootScript.vars.createScript(str);
					} else {
						apps.prompt.vars.alert("There is already a boot script with that name.", "Okay", function() {}, "Boot Script Editor");
					}
				}
			}, "Boot Script Editor");
		},
		createScript: function (name) {
			ufsave("system/apps/bootScript/" + cleanStr(name), "// Boot Script");
			this.listScripts();
			this.openScript(cleanStr(name));
		},
		delScript: function (name) {
			ufdel("system/apps/bootScript/" + name);
			this.listScripts();
			this.openScript("main");
		},
		listScripts: function() {
			var allScripts = ufload("system/apps/bootScript");
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
			ufsave('system/apps/bootScript/' + this.currScript, getId('BtS_edit_frame').contentWindow.editor.getValue());
		},
		helpBootScript: function() {
			apps.prompt.vars.alert('WARNING - ADVANCED USERS ONLY<br>The Bootscript is your very own script to run on OS boot. Use it for useful things like... well, I can\'t think of anything. Here you are though.<br><br>BootScript will run your script one millisecond after the OS finishes loading your userfiles.<br><br>Save all variables for your script inside the \'this\' object. Example... this.myVar = 9000.1;<br><br>Bootscripts are written in JavaScript. Use the API and assume that your script lives inside of an app\'s vars... (<b>apps.theoreticalApp.vars</b> <-- your script theoretically here) Check the API doc for reference to what this means.<br><br>Your bootscript is NOT AN APP and has no window. Trying to call anything within this.appWindow WILL result in an error!', 'Okay, thanks.', function() {}, 'Boot Script');
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
					window.setTimeout(apps.bootScript.vars.doBootScript, 1);
					break;
				case 'shutdown':

					break;
				default:
					doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'", "#F00");
		}
	}
});

} // End initial variable declaration