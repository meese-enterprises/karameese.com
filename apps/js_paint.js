const JSPaint = () => {
	apps.jsPaint = new Application({
		name: "jsPaint",
		title: "JS Paint",
		abbreviation: "jsP",
		image: "icons/paint_bucket_v1.png",
		hideApp: 0,
		main: function (imageURL) {
			this.appWindow.setDims("auto", "auto", 753, 507);
			this.appWindow.paddingMode(0);

			let url = "https://jspaint.app";
			if (imageURL) url += "#load:" + imageURL;

			// TODO: Make sure there is a working zoom in/out feature
			this.appWindow.setContent(`
				<iframe
					data-parent-app="jsPaint"
					id="jsPframe"
					src="${url}"
					style="width:100%;height:100%;border:none;"
				></iframe>
			`);

			getId("icn_jsPaint").style.display = "inline-block";
			this.appWindow.setCaption("JS Paint");
			this.appWindow.openWindow();
		},
		vars: {
			appInfo:
				"A retro throwback app intended to show off my most recent creation.",
		},
	});
}; // End initial variable declaration
