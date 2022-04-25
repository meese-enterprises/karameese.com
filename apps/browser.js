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

			// https://stackoverflow.com/a/61548595/6456163
			const iframe = document.getElementById("browserApp");
			iframe.addEventListener("load", function () {
				/** https://muffinman.io/blog/json-stringify-removes-undefined */
				const replacer = (key, value) =>
  				typeof value === "function" ? value.toString() : value;

				// Creates a message with the stringified vars for the browser app
				const vars = JSON.stringify(apps.browser.vars, replacer);
				const message = { value: vars };

				// Pass the message to the iframe
				// https://stackoverflow.com/a/54691801/6456163
				iframe.contentWindow.postMessage(message, window.location.origin);
			});
		},
		vars: {
			// NOTE: The reason that we don't use the `vars` keyword here is because
			// we need to access the vars from the iframe, so `vars` is `this`
			appInfo: "A way to browse the web without leaving the site.",
			DDG: {},
			search: function (event) {
				if (event.keyCode === 13) {
					// Search the designated query on enter key
					this.sendQueryToDDG(event.target.value);
				}
			},
			sendQueryToDDG: function (query) {
				this.DDG = new XMLHttpRequest();
				this.DDG.onreadystatechange = () => this.displayResults();

				this.DDG.open("GET", "/ddgSearch.php?q=" + query);
				this.DDG.send();
			},
			displayResults: function () {
				if (this.DDG.readyState !== 4) return;

				const response = JSON.parse(this.DDG.responseText);
				console.log("Response:", response);

				document.getElementById("searchResults").innerHTML = response;
			},
		},
	});
}; // End initial variable declaration
