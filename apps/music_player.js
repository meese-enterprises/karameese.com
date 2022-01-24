const MusicPlayer = () => {
	apps.musicPlayer = new Application({
		title: "Music Player",
		abbreviation: "MPl",
		codeName: "musicPlayer",
		image: "appicons/vinyl_v2.png",
		hideApp: 0,
		resizeable: false,
		main: function () {
			if (!this.appWindow.appIcon) {
				this.appWindow.paddingMode(0);
				this.appWindow.setContent(`
					<iframe
						data-parent-app="musicPlayer"
						id="MPlframe"
						src="./Music/index.html"
					></iframe>
				`);
				getId("icn_musicPlayer").style.display = "inline-block";
				requestAnimationFrame(() => {
					this.appWindow.appIcon = 1;
				});
			}

			this.appWindow.setCaption("Music Player");
			this.appWindow.setDims("auto", "auto", 500, 150);
			if (this.appWindow.appIcon) {
				this.appWindow.openWindow();
			}
		},
		vars: {
			appInfo:
				"If you would like to understand me a little more and have a little entertainment while exploring my website, take a listen to these tunes, hand curated by yours truly.",
		},
	});
}; // End initial variable declaration
