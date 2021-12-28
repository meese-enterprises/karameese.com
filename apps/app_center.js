const AppCenter = () => {

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
						"<span style='font-family:W95FA, monospace; font-size:12px'>" + repositories[packageList[i][1]].repoID + "." + selectedPackage.packageID + "</span><br>" +
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
					"<span style='font-family:W95FA, monospace; font-size:12px'>" + repositories[repo].repoID + "</span><br><br>" +
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
					"<span style='font-family:W95FA, monospace; font-size:12px'>" + currUpdates[i][0] + "." + selectedPackage.id + "</span><br>";
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

} // End initial variable declaration