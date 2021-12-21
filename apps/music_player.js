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
					style="border:none; display:block; width:100%; height:100%; overflow:hidden;"
					src="./Music/index.html"
				></iframe>`
			);
			getId("icn_musicPlayer").style.display = "inline-block";
			requestAnimationFrame(() => {
				this.appWindow.appIcon = 1;
			});
		}
		this.appWindow.setCaption('Music Player');
		// MUSIC PLAYER DIMENSIONS
		this.appWindow.setDims("auto", "auto", 600, 350);
		blockScreensaver("apps.musicVis");
		if (this.appWindow.appIcon) {
			this.appWindow.openWindow();
		}
	}
});

} // End initial variable declaration