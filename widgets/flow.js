/* global getId */

// skipcq JS-0128
const FlowWidget = () => {
	let flowMode = 0;

	// skipcq JS-0128
	function exitFlowMode() {
		if (getId("monitor").classList.contains("flowDesktop")) {
			getId("monitor").classList.remove("flowDesktop");
		}
		flowMode = 0;
	}

	function toggleFlowMode() {
		if (flowMode) {
			if (getId("monitor").classList.contains("flowDesktop")) {
				getId("monitor").classList.remove("flowDesktop");
			}
			flowMode = 0;
		} else {
			if (!getId("monitor").classList.contains("flowDesktop")) {
				getId("monitor").classList.add("flowDesktop");
				getId("desktop").scrollTop = 0;
			}
			flowMode = 1;
		}
	}

	widgets.flow = new Widget(
		"Flow Mode",
		"flow",
		function () {
			toggleFlowMode();
		},
		function () {
			getId("widget_flow").innerHTML = "~";
			getId("widget_flow").style.lineHeight = "150%";
			getId("widget_flow").style.paddingLeft = "6px";
			getId("widget_flow").style.paddingRight = "6px";
		},
		function () {},
		function () {},
		{}
	);
}; // End initial variable declaration
