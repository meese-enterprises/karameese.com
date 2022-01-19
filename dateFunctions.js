// Function to format a string into a date into a string
let tempDate;
let date;
let skipKey;
let tempDayt;
const dateDays = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];
const dateForms = {
	D: function () {
		// day number
		tempDate += date.getDate();
	},
	d: function () {
		// day of week
		tempDate += dateDays[date.getDay()];
	},
	y: function () {
		// 2-digit year
		tempDate += String(date.getFullYear() - 2000);
	},
	Y: function () {
		// 4-digit year
		tempDate += date.getFullYear();
	},
	h: function () {
		// 12-hour time
		tempDayt =
			date.getHours() > 12
				? String(date.getHours() - 12)
				: String(date.getHours());
		tempDate += tempDayt === "0" ? "12" : tempDayt;
	},
	H: function () {
		// 24-hour time
		tempDate += String(date.getHours());
	},
	s: function () {
		// milliseconds
		if (date.getMilliseconds() < 10) {
			tempDate += "00" + date.getMilliseconds();
		} else if (date.getMilliseconds() < 100) {
			tempDate += "0" + date.getMilliseconds();
		} else {
			tempDate += date.getMilliseconds();
		}
	},
	S: function () {
		// seconds
		tempDayt = String(date.getSeconds());
		tempDate += tempDayt < 10 ? "0" + tempDayt : tempDayt;
	},
	m: function () {
		// minutes
		tempDayt = date.getMinutes();
		tempDate += tempDayt < 10 ? "0" + tempDayt : tempDayt;
	},
	M: function () {
		// month
		tempDate += String(date.getMonth() + 1);
	},
	"-": function () {
		// escape character
	},
};

/** Function to use above functions to form a date string. */
// skipcq JS-0128
function formDate(dateStr) {
	tempDate = "";
	date = new Date();
	skipKey = 0;
	// Loops thru characters and replaces them with the date
	for (const dateKey in dateStr) {
		if (skipKey) skipKey = 0;
		if (dateForms[dateStr[dateKey]]) {
			dateForms[dateStr[dateKey]]();
		} else {
			tempDate += dateStr[dateKey];
		}
	}
	return tempDate;
}
