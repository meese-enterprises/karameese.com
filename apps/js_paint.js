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

			//imageURL = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Test-Logo.svg/783px-Test-Logo.svg.png";
			let url = "https://jspaint.app";
			if (imageURL) url += "#load:" + imageURL;

			// TODO: Make this work on localhost somehow
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
			openFile: function() {
				// TODO: Implement the callback URL like
				// https://jspaint.app/#load:https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Test-Logo.svg/783px-Test-Logo.svg.png
				function locationHREFWithoutResource() {
					var pathWORes   = location.pathname.substring(0, location.pathname.lastIndexOf("/")+1);
					var protoWDom   = location.href.substr(0, location.href.indexOf("/", 8));
					return protoWDom + pathWORes;
			};
			},
		},
	});
}; // End initial variable declaration
