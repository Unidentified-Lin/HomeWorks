function setLinks(objs, _link) {
	if (objs instanceof NodeList) {
		objs.forEach((obj) => {
			setLink(obj, _link);
		});
	} else if (objs instanceof Node) {
		setLink(objs, _link);
	}
}
function setLink(obj, _link) {
	let link = _link.link;
	let target = _link.target;
	obj.target = target;
	if (link == "none") {
		obj.style.display = "none";
	} else {
		obj.href = link;
	}
}
function setSrc(img, path) {
	img.src = path;
}
function setText(obj, text) {
	if (isOnlyCodeTag(text)) {
		obj.innerHTML = text;
	} else {
		obj.innerText = text;
	}
}
function isOnlyCodeTag(str) {
	var doc = new DOMParser().parseFromString(str, "text/html");
	let validTag = ["code", "strong", "i", "b"];
	return Array.from(doc.body.children).every((node) => validTag.includes(node.localName));
}
function setToggle(toggle, collapse, name) {
	toggle.href = "#" + name;
	collapse.id = name;
}
function appendWorkCards(works) {
	let accordion = document.getElementById("card-accordion");
	accordion.innerHTML = "";

	works.forEach((element) => {
		let template = document.getElementById("card-template");
		let cloneCard = template.content.cloneNode(true);

		let links = cloneCard.querySelectorAll(".card-link");
		let img = cloneCard.querySelector("img");
		let title = cloneCard.querySelector(".card-title");
		let description = cloneCard.querySelector(".card-text");
		let toggle = cloneCard.querySelector('[data-toggle="collapse"]');
		let collapse = cloneCard.querySelector(".collapse");
		let since_date = cloneCard.querySelector(".since-date");
		let reference_link = cloneCard.querySelector(".reference-link");

		setLinks(links, element.work_link);
		setSrc(img, element.imgPath);
		setText(title, element.title);
		setText(description, element.description);
		setToggle(toggle, collapse, element.collapse_name);
		setText(since_date, element.since);
		setLinks(reference_link, element.reference_link);

		accordion.appendChild(cloneCard);
	});
}

var xhr = new XMLHttpRequest();
const url = "https://raw.githubusercontent.com/Unidentified-Lin/FileStorage/master/homework.json";
export function requestHomework(type) {
	xhr.onload = function () {
		if (xhr.readyState == 4 && xhr.status == 200) {
			let works = JSON.parse(this.responseText)[type];
			appendWorkCards(works);
		} else {
			document.getElementById("msg").innerHTML = "發生錯誤，HTTP response代碼：" + xhr.status;
		}
	};
	xhr.open("GET", url);
	xhr.send();
}
