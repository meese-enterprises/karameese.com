const OldSite = () => {

apps.oldSite = new Application({
	title: "Old Site",
	abbreviation: "OLD",
	codeName: "oldSite",
	desc: "My previous website, which was crafted for me by my husband for our first Valentine's Day.",
	image: {
		backgroundColor: "#303947",
		foreground: "appicons/heart.png",
		backgroundBorder: {
			thickness: 2,
			color: "#252F3A"
		}
	},
	hideApp: 0,
	launchTypes: 1,
	main: function (launchType) {
		if (!this.appWindow.appIcon) {
			this.appWindow.paddingMode(0);
			this.appWindow.setDims("auto", "auto", 525, 350);
		}

		this.appWindow.setCaption("Old Site");
		this.appWindow.setContent(`
			<iframe
				data-parent-app="oldSite"
				id="oldSiteFrame"
				src="./old-site/public/index.html"
			></iframe>
		`);
		this.appWindow.openWindow();
	},
	vars: {
		appInfo: "My previous website, which was crafted for me by my husband for our first Valentine's Day."
	}
});

} // End initial variable declaration