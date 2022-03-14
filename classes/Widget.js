/**
 * An extensible Widget class for creating taskbar widgets.
 */
class Widget {
	/**
	 * @param {string} title
	 * @param {string} name Name of the widget to be used in the widget object
	 * @param {Function} clickFunc Onclick function
	 * @param {Function} startFunc Start/initialize function
	 * @param {Function} frameFunc Frame function (this.vars.frame())
	 * @param {Function} endFunc Stop/cleanup function
	 * @param {Object} vars Relevant variables for the widget
	 */
	constructor(
		title,
		name,
		clickFunc,
		startFunc,
		frameFunc,
		endFunc,
		vars
	) {
		this.title = title;
		this.name = name;
		this.main = clickFunc;
		this.start = startFunc;
		this.frame = frameFunc;
		this.end = endFunc;
		this.vars = vars;
		this.place = -1;
		this.element = null;
		this.setWidth = function (width) { //(width) => {
			if (this.element !== null) {
				this.element.style.width = width;
			}
		};
		this.setContent = function (content) { //(content) => {
			if (this.element !== null) {
				this.element.innerHTML = content;
			}
		};
	};

	// TODO: Import other functions from widgetFunctions.js
}
