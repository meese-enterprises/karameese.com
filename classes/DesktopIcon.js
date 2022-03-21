/**
 * An extensible DesktopIcon class for creating icons that will
 * be visible on the desktop.
 */
class DesktopIcon {
	// IDEA: Merge this with `iconFunctions.js` for a bigger
	// overall Icon class.

	/**
	 * TODO: @typedefs
	 * @param {string} id the unique identifier for the application
	 * @param {string} title the title of the application
	 * @param {string} icon the path to the app's icon
	 * @param {*} action
	 * @param {*} actionArgs
	 * @param {*} ctxAction
	 * @param {*} ctxActionArgs
	 */
	constructor({
		id,
		title,
		icon,
		action,
		actionArgs = [],
		ctxAction,
		ctxActionArgs = []
	}) {
		if (typeof action === "string") action = [action];
		if (typeof ctxAction === "string") ctxAction = [ctxAction];
		if (typeof icon === "string") {
			icon = { foreground: icon };
		}

		dsktp[id] = {
			id: id,
			position: null,
			title: title,
			icon: icon,
			action: action,
			actionArgs: actionArgs,
			ctxAction: ctxAction,
			ctxActionArgs: ctxActionArgs,
		};

		if (getId("app_" + id)) {
			getId("desktop").removeChild(getId("app_" + id));
		}

		const iconElement = document.createElement("div");
		iconElement.classList.add("app");
		iconElement.classList.add("cursorPointer");
		iconElement.classList.add("noselect");
		iconElement.id = "app_" + id;
		iconElement.setAttribute("data-icon-id", id);
		iconElement.setAttribute(
			"onclick",
			'Function(...dsktp[this.getAttribute("data-icon-id")].action)(...dsktp[this.getAttribute("data-icon-id")].actionArgs)'
		);
		iconElement.setAttribute(
			"oncontextmenu",
			'Function(...dsktp[this.getAttribute("data-icon-id")].ctxAction)(...dsktp[this.getAttribute("data-icon-id")].ctxActionArgs)'
		);
		iconElement.innerHTML =
			`<div class="appIcon" id="ico_${id}" style="pointer-events:none">` +
			buildIcon({ size: 64, image: icon }) +
			"</div>" +
			`<div class="appName" id="dsc_${id}">` +
			title +
			"</div>";
		getId("desktop").appendChild(iconElement);
		arrangeDesktopIcons();
	}

	// TODO: Import other functions from widgetFunctions.js
}
