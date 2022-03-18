// skipcq JS-0128
const OldSite = () => {
	apps.oldSite = new Application({
		name: "oldSite",
		title: "Old Site",
		abbreviation: "OLD",
		description: "My previous website, which was crafted for me by my husband for our first Valentine's Day.",
		image: "icons/heart.png",
		hideApp: 0,
		launchTypes: 1,
		main: function () {
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
			appInfo:
				"My previous website, which was crafted for me by my husband for our first Valentine's Day.",
		},
	});
}; // End initial variable declaration
