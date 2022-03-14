/* global getId */

let totalWidgets = 0;
const widgets = {};

// skipcq JS-0128
function addWidget(widgetName) {
	const widget = widgets[widgetName];
	if (!widget || widget.place !== -1) return;

	// TODO: Convert this to JavaScript
	getId("time").innerHTML +=
		`<div id="widget_${widgetName}" ` +
		`class="widget" data-widget-name="${widgetName}" ` +
		`onclick="widgets.${widgetName}.main()"` +
		"></div>";
	widget.element = getId("widget_" + widgetName);
	widget.place = totalWidgets;
	totalWidgets++;
	widget.start();
}

// skipcq JS-0128
function widgetMenu(title, content) {
	getId("widgetMenu").style.bottom = "auto";
	getId("widgetMenu").style.top = "0";
	getId("widgetMenu").style.borderTop = "none";
	getId("widgetMenu").style.borderTopLeftRadius = "0";
	getId("widgetMenu").style.borderTopRightRadius = "0";

	getId("widgetMenu").style.opacity = "1";
	getId("widgetMenu").style.pointerEvents = "auto";
	getId("widgetTitle").innerHTML = title;
	getId("widgetContent").innerHTML = "<hr>" + content;
}

// skipcq JS-0128
function closeWidgetMenu() {
	getId("widgetMenu").style.bottom = "auto";
	getId("widgetMenu").style.top = "-350px";

	getId("widgetMenu").style.opacity = "0";
	getId("widgetMenu").style.pointerEvents = "none";
	getId("widgetTitle").innerHTML = "";
	getId("widgetContent").innerHTML = "";
}
