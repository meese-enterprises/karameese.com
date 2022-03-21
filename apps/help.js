const Help = () => {
	apps.help = new Application({
		name: "help",
		title: "Help",
		abbreviation: "hlp",
		image: "icons/question_mark_v1.png",
		hideApp: 0,
		main: function () {
			this.appWindow.paddingMode(0);
			this.appWindow.setDims("auto", "auto", 400, 500);
			this.appWindow.setCaption("Help");
			this.appWindow.setContent(
				'<div id="helpDiv" class="darkResponsive">' +
					'<div class="noselect" style="overflow-y:auto;font-size:12px;width:100%;height:40px;border-bottom:1px solid;position:relative;">' +
					"&nbsp;List of all applications installed.<br>" +
					'&nbsp;<input class="canselect" placeholder="Search" onkeyup="apps.help.vars.search(this.value)">' +
					"</div></div>"
			);
			this.vars.appsListed = 1;

			const appsSorted = Object.keys(apps).sort();
			for (const appHandle in appsSorted) {
				const app = appsSorted[appHandle];
				this.vars.currAppImg = apps[app].appWindow.image;
				this.vars.currAppAbbr = apps[app].abbreviation;
				this.vars.currAppTitle = apps[app].title;
				this.vars.currAppDesc = apps[app].description;
				getId("helpDiv").innerHTML +=
					'<div id="APBapp_' +
					app +
					'" class="helpItem cursorPointer darkResponsive" onclick="c(function(){openapp(apps.' +
					app +
					", 'dsktp')});\" " +
					"oncontextmenu=\"ctxMenu([[event.pageX, event.pageY, 'ctxMenu/window.png', 'ctxMenu/window.png', 'ctxMenu/file.png', 'ctxMenu/folder.png', 'ctxMenu/file.png'], " +
					"' Open App', 'c(function(){openapp(apps." +
					app +
					", \\'dsktp\\')})', " +
					"' Open App via Taskbar', 'c(function(){openapp(apps." +
					app +
					", \\'tskbr\\')})', " +
					"'+About This App', 'c(function(){openapp(apps.appInfo, \\'" +
					app +
					"\\')})',  " +
					"' View Files', 'c(function(){openapp(apps.files, \\'dsktp\\');c(function(){apps.files.vars.next(\\'apps/\\');apps.files.vars.next(\\'" +
					app +
					"/\\')})})'" +
					']);">' +
					buildIcon({
						size: 128,
						image: this.vars.currAppImg,
						css: "margin-left:1px;"
					}) +
					'<div class="helpItemText">' +
					'<p class="helpAppName">' +
					this.vars.currAppTitle +
					"</p>" +
					'<p class="helpAppDesc">' +
					this.vars.currAppDesc +
					"</p>" +
					"</div>" +
					"</div>";

				this.vars.appsListed++;
			}

			this.appWindow.openWindow();
		},
		vars: {
			appInfo: "A handy tool to navigate all of the apps you may come across.",
			appsListed: 1,
			currAppImg: "",
			currAppAbbr: "",
			currAppTitle: "",
			search: function (text) {
				const allDivs = getId("helpDiv").getElementsByClassName("helpItem");
				const textSplit = text.toLowerCase().split(" ");
				for (let i = 0; i < allDivs.length; i++) {
					let isVisible = false;
					const texts = allDivs[i].getElementsByClassName("helpAppName");
					for (let txt = 0; txt < texts.length; txt++) {
						let textFound = 0;
						for (const j in textSplit) {
							if (
								texts[txt].innerText.toLowerCase().indexOf(textSplit[j]) > -1
							) {
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
			},
		},
	});
}; // End initial variable declaration
