const BatteryWidget = () => {

widgets.battery = new Widget(
	'Battery',
	'battery',
	function() {},
	function() {
		widgets.battery.vars.running = 1;
		widgets.battery.vars.styles["default"][0]();
		widgets.battery.frame();
	},
	function() {
		if (widgets.battery.vars.running) {
			if (batteryLevel !== -1) widgets.battery.vars.styles["default"][1]();
			requestAnimationFrame(widgets.battery.frame);
		}
	},
	function() {
		widgets.battery.vars.running = 0;
	}, {
		running: 0,
		styles: {
			default: [
				function() {
					getId('widget_battery').innerHTML = '<div id="batteryWidgetFrame">????</div><div style="position:static;margin-top:-8px;border:1px solid #FFF;width:0;height:3px;margin-left:32px"></div>';
				},
				function() {
					getId('batteryWidgetFrame').innerHTML = taskbarBatteryStr;
				}
			]
		},
		generateMenu: function() {}
	}
);

} // End initial variable declaration