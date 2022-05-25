const Browser = () => {
	apps.browser = new Application({
		name: "browser",
		title: "Browser",
		abbreviation: "BRS",
		image: "icons/internet_explorer_v1.png",
		hideApp: 0,
		main: function () {
			this.appWindow.setDims("auto", "auto", 753, 507);
			this.appWindow.paddingMode(0);

			this.appWindow.setContent(`
				<iframe
					data-parent-app="browser"
					class="full-iframe"
					id="browserApp"
					src="./apps/browser.html"
				></iframe>
			`);

			getId("icn_browser").style.display = "inline-block";
			this.appWindow.setCaption("Browser");
			this.appWindow.openWindow();
		},
		vars: {
			appInfo: "A way to browse the web without leaving the site.",
		},
	});
}; // End initial variable declaration
