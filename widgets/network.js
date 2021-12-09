const NetworkWidget = () => {

widgets.network = new Widget(
	'Network',
	'network',
	function() {
		widgetMenu('Network Widget',
			'This widget displays your connection status to AaronOS. Additionally, it will show when you are sending / recieving data from AaronOS.'
		);
	},
	function() {
		widgets.network.vars.running = 1;
		getId('widget_network').style.lineHeight = '26px';
		getId('widget_network').style.paddingLeft = '6px';
		getId('widget_network').style.paddingRight = '6px';
		if (ufload('aos_system/widgets/network/style')) {
			widgets.network.vars.displayType = ufload('aos_system/widgets/network/style');
		}
		widgets.network.frame();
	},
	function() {
		if (widgets.network.vars.running) {
			var displayStr = '';
			getId('widget_network').style.lineHeight = '26px';
			if (widgets.network.vars.onlinestrConvert[taskbarOnlineStr]) {
				displayStr = '<img style="width:10px;filter:invert(1) brightness(1.5) drop-shadow(0px 0px 1px #000);" src="ctxMenu/beta/' + widgets.network.vars.onlinestrConvert[taskbarOnlineStr] + '.png">';
			} else {
				displayStr = '<img style="width:10px;filter:invert(1) brightness(1.5) drop-shadow(0px 0px 1px #000);" src="ctxMenu/beta/networkBad.png">';
			}

			if (displayStr !== widgets.network.vars.lastDisplayStr) {
				getId('widget_network').innerHTML = displayStr;
				widgets.network.vars.lastDisplayStr = displayStr;
			}
			requestAnimationFrame(widgets.network.frame);
		}
	},
	function() {
		widgets.network.vars.running = 0;
	}, {
		running: 0,
		onlinestrConvert: {
			'] [': 'network',
			'}-[': 'networkUp',
			']-{': 'networkDown',
			'}-{': 'networkBoth',
			']X[': 'networkBad'
		},
		lastDisplayStr: '',
		displayType: "new"
	}
);

} // End initial variable declaration