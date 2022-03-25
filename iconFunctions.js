/**
 * Creates and returns a stringified new icon element.
 * @param {number} size
 * @param {Object|string} image
 * @param {string} css
 * @returns {string}
 */
function buildIcon({
	size,
	image = {},
	css = ""
}) {
	if (typeof image === "string") {
		image = {
			foreground: image,
		};
	}
	let icoTemp =
		'<div class="appicon" style="width:' + size + "px;height:" + size + "px;";
	icoTemp += css;
	icoTemp += '">';
	if (image.foreground) {
		icoTemp +=
			'<div class="appicon_nobg" style="background:url(' +
			cleanStr(image.foreground.split(";")[0]) +
			');"></div>';
	}
	icoTemp +=
		'<div class="appicon_bg" data-appicon-size="' +
		size + '"';
	if (image.backgroundColor) {
		icoTemp +=
			"background-color:" +
			cleanStr(image.backgroundColor.split(";")[0]) +
			";";
	}
	icoTemp += '">';
	if (image.foreground) {
		icoTemp +=
			'<div class="appicon_fg" style="background:url(' +
			cleanStr(image.foreground.split(";")[0]) +
			');"></div>';
	}
	if (image.backgroundBorder) {
		icoTemp +=
			'<div class="appicon_border" data-appicon-size="' +
			size +
			'" style="box-shadow:inset 0 0 0 ' +
			(size / 32) * (image.backgroundBorder.thickness || 1) +
			"px " +
			cleanStr(image.backgroundBorder.color.split(";")[0]) +
			';"></div>';
	}
	icoTemp += "</div></div>";
	return icoTemp;
}
