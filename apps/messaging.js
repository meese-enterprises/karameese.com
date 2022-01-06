const Messaging = () => {

apps.messaging = new Application({
	title: "Messaging",
	abbreviation: "MSG",
	codeName: "messaging",
	image: {
		backgroundColor: "#303947",
		foreground: "smarticons/messaging/fg.png",
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
			this.appWindow.setDims("auto", "auto", 800, 500);
		}
		this.appWindow.setCaption('Messaging');
		if (launchType === 'dsktp') {
			this.appWindow.setContent("test");
		}
		this.appWindow.openWindow();
	},
	vars: {
		appInfo: ''
	}
});

} // End initial variable declaration