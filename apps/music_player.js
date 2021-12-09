const MusicPlayer = () => {

apps.musicPlayer = new Application({
	title: "Music Player",
	abbreviation: "MPl",
	codeName: "musicPlayer",
	image: {
		backgroundColor: "#303947",
		foreground: "smarticons/musicPlayer/fg.png",
		backgroundBorder: {
			thickness: 2,
			color: "#252F3A"
		}
	},
	hideApp: 0,
	main: function() {
		if (!this.appWindow.appIcon) {
			this.appWindow.paddingMode(0);
			this.appWindow.setContent(`
				<iframe
					data-parent-app="musicPlayer"
					id="MPlframe"
					onload="apps.musicPlayer.vars.updateStyle()"
					style="border:none; display:block; width:100%; height:100%; overflow:hidden;"
					src="./Music/index.html"
				></iframe>`
			);
			requestAnimationFrame(this.vars.colorWindows);
			getId("icn_musicPlayer").style.display = "inline-block";
			requestAnimationFrame(() => {
				this.appWindow.appIcon = 1;
				this.vars.colorWindows();
			});
		}
		this.appWindow.setCaption('Music Player');
		// MUSIC PLAYER DIMENSIONS
		this.appWindow.setDims("auto", "auto", 600, 350);
		blockScreensaver("apps.musicVis");
		if (this.appWindow.appIcon) {
			this.appWindow.openWindow();
		}
	},
	vars: {
		//appInfo: 'This is the official AaronOS Music Player. Select a folder of songs to loop through.',
		updateStyle: function() {},
		colorModified: 0,
		colorWindows: function() {
			if (apps.musicPlayer.appWindow.appIcon) {
				let MPlTitle = getId("MPlframe").contentDocument.title;
				if (MPlTitle.indexOf("WindowRecolor:") === 0) {
					apps.settings.vars.setWinColor(1, MPlTitle.split(":")[1]);
					if (!this.colorModified) this.colorModified = 1;
				} else if (this.colorModified) {
					apps.settings.vars.setWinColor(1, ufload("aos_system/windows/border_color") || 'rgba(150, 150, 200, 0.5)');
					this.colorModified = 0;
				}
				requestAnimationFrame(apps.musicPlayer.vars.colorWindows);
			} else if (this.colorModified) {
				apps.settings.vars.setWinColor(1, ufload("aos_system/windows/border_color") || 'rgba(150, 150, 200, 0.5)');
				this.colorModified = 0;
			}
		}
	}
});

} // End initial variable declaration