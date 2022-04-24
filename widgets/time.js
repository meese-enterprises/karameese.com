const getTimeWidgetContents = () => {
	let currentTime = new Date().getTime() - bootTime;
	const currentDays = Math.floor(currentTime / 86400000);
	currentTime -= currentDays * 86400000;
	const currentHours = Math.floor(currentTime / 3600000);
	currentTime -= currentHours * 3600000;
	const currentMinutes = Math.floor(currentTime / 60000);
	currentTime -= currentMinutes * 60000;
	const currentSeconds = Math.floor(currentTime / 1000);

	return (
		`${websiteTitle} has been running for:<br>${currentDays} days, ` +
		`${currentHours} hours, ${currentMinutes} minutes, and ${currentSeconds} seconds.`
	);
};

const TimeWidget = () => {
	widgets.time = new Widget({
		title: "Time",
		name: "time",
		clickFunc: function () {
			widgetMenu(
				"Time Widget",
				// TODO: MAKE THIS UPDATE EVERY SECOND
				getTimeWidgetContents()
			);
		},
		startFunc: function () {
			widgets.time.vars.running = 1;
			widgets.time.frame();
		},
		frameFunc: function () {
			// TODO: Poll the frames less frequently
			if (!widgets.time.vars.running) return;

			const date = String(new Date());
			if (date !== widgets.time.vars.lastTime) {
				getId("widget_time").innerHTML =
					'<div id="compactTime">' +
					formDate("M-/D-/y") +
					"<br>" +
					formDate("h-:m-:S") +
					"</div>";
				widgets.time.vars.lastTime = date;
			}
			requestAnimationFrame(widgets.time.frame);
		},
		endFunc: function () {
			widgets.time.vars.running = 0;
		},
		vars: {
			running: 0,
			lastTime: String(new Date()),
		},
	});
}; // End initial variable declaration
