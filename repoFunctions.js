var repositories = {
	"repository/repository.json": {}
};
var repositoryIDs = {};
var installedPackages = {};

function repoSave() {
	lfsave("system/repositories", JSON.stringify(repositories));
	lfsave("system/repositories_installed", JSON.stringify(installedPackages));
}

function repoLoad() {
	try {
		repositories = JSON.parse(lfload("system/repositories") || '{"repository/repository.json": {}}');
	} catch (err) {
		alert(err);
		repositories = {
			"repository/repository.json": {}
		};
	}
	try {
		installedPackages = JSON.parse(lfload("system/repositories_installed") || '{}');
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
	for (let repo in repositories) {
		if (repositories[repo].hasOwnProperty('packages')) {
			for (let package in repositories[repo].packages) {
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