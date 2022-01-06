const AppBrowser = () => {

apps.appsbrowser = new Application({
	title: "Apps Browser",
	abbreviation: "APB",
	codeName: "appsbrowser",
	image: {
		backgroundColor: "#303947",
		foreground: "smarticons/appsbrowser/fg.png",
		backgroundBorder: {
			thickness: 2,
			color: "#252F3A"
		}
	},
	hideApp: 1,
	main: function() {
		this.appWindow.paddingMode(0);
		this.appWindow.setDims("auto", "auto", 400, 500);
		this.appWindow.setCaption('Apps Browser');
		this.appWindow.setContent(
			'<div id="APBdiv" class="darkResponsive" style="width:100%;height:100%;overflow-y:auto;font-family:W95FA;">' +
			'<div class="noselect" style="overflow-y:auto;font-size:12px;width:100%;height:40px;border-bottom:1px solid;position:relative;">' +
			'&nbsp;List of all applications installed.<br>' +
			'&nbsp;<input class="canselect" placeholder="Search" onkeyup="apps.appsbrowser.vars.search(this.value)">' +
			'</div></div>');
		this.vars.appsListed = 1;
		for (var appHandle in appsSorted) {
			var app = appsSorted[appHandle];
			this.vars.currAppImg = apps[app].appWindow.appImg;
			this.vars.currAppIcon = apps[app].dsktpIcon;
			this.vars.currAppName = apps[app].appDesc;
			getId("APBdiv").innerHTML += '<div id="APBapp_' + app + '" class="appsBrowserItem cursorPointer darkResponsive" onclick="c(function(){openapp(apps.' + app + ', \'dsktp\')});" ' +
				'style="padding-top:1px;padding-bottom:1px;position:relative;height:128px;width:100%;border-bottom:1px solid;" ' +
				'oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/window.png\', \'ctxMenu/beta/window.png\', \'ctxMenu/beta/file.png\', \'ctxMenu/beta/folder.png\', \'ctxMenu/beta/file.png\'], ' +
				'\' Open App\', \'c(function(){openapp(apps.' + app + ', \\\'dsktp\\\')})\', ' +
				'\' Open App via Taskbar\', \'c(function(){openapp(apps.' + app + ', \\\'tskbr\\\')})\', ' +
				'\'+About This App\', \'c(function(){openapp(apps.appInfo, \\\'' + app + '\\\')})\',  ' +
				'\' View Files\', \'c(function(){openapp(apps.files, \\\'dsktp\\\');c(function(){apps.files.vars.next(\\\'apps/\\\');apps.files.vars.next(\\\'' + app + '/\\\')})})\'' +
				function (appname, builtin) {
					if (builtin === "User-Made App") {
						return ', \' Open Source File\', \'c(function(){openapp(apps.notepad, \\\'open\\\');apps.notepad.vars.openFile(\\\'system/apm_apps/app_' + appname + '\\\')})\'';
					}
					
					return ''
				}(app) + ']);">' + buildSmartIcon(128, this.vars.currAppImg, "margin-left:1px;") +
				'<div class="APB_app_content" style="font-size:24px;left:132px;top:calc(50% - 1em);">' + this.vars.currAppName + '</div>' +
				'<div class="APB_app_content darkResponsive" style="opacity:0.75;background:none;left:132px;top:4px;font-size:12px;text-align:right">apps.' + app + '</div>' +
				'<div class="APB_app_content darkResponsive"style="opacity:0.75;background:none;font-size:12px;left:132px;bottom:4px;">' + this.vars.currAppIcon + '</div></div>';

			this.vars.appsListed++;
		}

		this.appWindow.openWindow();
	},
	vars: {
		appInfo: '',
		appsListed: 1,
		currAppImg: '',
		currAppIcon: '',
		currAppName: '',
		search: function (text) {
			let allDivs = getId("APBdiv").getElementsByClassName('appsBrowserItem');
			let textSplit = text.toLowerCase().split(" ");
			for (let i = 0; i < allDivs.length; i++) {
				let isVisible = false;
				let texts = allDivs[i].getElementsByClassName("APB_app_content");
				for (let txt = 0; txt < texts.length; txt++) {
					let textFound = 0;
					for (let j in textSplit) {
						if (texts[txt].innerText.toLowerCase().indexOf(textSplit[j]) > -1) {
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
		}
	}
});

} // End initial variable declaration