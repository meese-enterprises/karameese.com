/**
 * An extensible DesktopIcon class for creating icons that will
 * be visible on the desktop.
 */
 class DesktopIcon {
	/**
	 * TODO: @typedefs
	 * @param {string} id
	 * @param {string} title
	 * @param {string} icon the path to the app's icon
	 * @param {*} action
	 * @param {*} actionArgs
	 * @param {*} ctxAction
	 * @param {*} ctxActionArgs
	 */
	constructor(
		id,
		title,
		icon,
		action,
		actionArgs,
		ctxAction,
		ctxActionArgs
	) {
		if (!id) id = "uico_" + new Date().getTime();
		if (!title) {
			title = apps[id] ? apps[id].appName : "Icon";
		}
		if (!icon) {
			icon = apps[id]
				? {
						...apps[id].appWindow.appImg,
					}
				: {
						...apps.startMenu.appWindow.appImg,
					};
		}
		if (typeof icon === "string") {
			icon = { foreground: icon };
		}

		if (!action) {
			if (apps[id]) {
				action = ["arg", 'openapp(apps[arg], "dsktp");'];
				actionArgs = [id];
			} else {
				action = [
					'apps.prompt.vars.alert("This icon has no assigned action.", "Okay.", function(){}, "");',
				];
				actionArgs = [];
			}
		}

		if (typeof action === "string") action = [action];
		if (!actionArgs) actionArgs = [];
		if (!ctxAction) {
			if (apps[id]) {
				ctxAction = [
					"arg1",
					"arg2",
					"ctxMenu(baseCtx.appXXX, 1, event, [event, arg1, arg2]);",
				];
				ctxActionArgs = [id, apps[id].dsktpIcon];
			} else {
				ctxAction = [
					"arg1",
					'ctxMenu(baseCtx.appXXX, 1, event, [event, arg1, "site"]);',
				];
				ctxActionArgs = [id];
			}
		}

		if (typeof ctxAction === "string") ctxAction = [ctxAction];
		if (!ctxActionArgs) ctxActionArgs = [];
		dsktp[id] = {
			id: id,
			position: null,
			title: title,
			icon: icon,
			action: action,
			actionArgs: actionArgs || [],
			ctxAction: ctxAction,
			ctxActionArgs: ctxActionArgs || [],
		};

		if (getId("app_" + id)) {
			getId("desktop").removeChild(getId("app_" + id));
		}

		const tempIco = document.createElement("div");
		tempIco.classList.add("app");
		tempIco.classList.add("cursorPointer");
		tempIco.classList.add("noselect");
		tempIco.id = "app_" + id;
		tempIco.setAttribute("data-icon-id", id);
		tempIco.setAttribute(
			"onclick",
			'Function(...dsktp[this.getAttribute("data-icon-id")].action)(...dsktp[this.getAttribute("data-icon-id")].actionArgs)'
		);
		tempIco.setAttribute(
			"oncontextmenu",
			'Function(...dsktp[this.getAttribute("data-icon-id")].ctxAction)(...dsktp[this.getAttribute("data-icon-id")].ctxActionArgs)'
		);
		tempIco.innerHTML =
			`<div class="appIcon" id="ico_${id}" style="pointer-events:none">` +
				buildSmartIcon(64, icon) +
			"</div>" +
			`<div class="appName" id="dsc_${id}">` +
				title +
			"</div>";
		getId("desktop").appendChild(tempIco);
		arrangeDesktopIcons();
	};

	// TODO: Import other functions from widgetFunctions.js
}
