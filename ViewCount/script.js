let viewCountElement = document.getElementById("viewerCount");
let viewCount = viewCountElement.innerText;
let numbers = viewCount.split('');

let newHTML = "";
numbers.forEach((number) => {
	let numberElement = document.createElement("div");
	numberElement.classList.add("number");
	numberElement.innerText = number;
	newHTML += numberElement.outerHTML;
});
viewCountElement.innerHTML = newHTML;