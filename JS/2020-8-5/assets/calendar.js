var mon = 0;
const saveKey = "schJSON";
const caleCellsSelector = "#cale-content .cale-cell";
const miniCaleCellsSelector = "td.cale-cell";

window.onload = function () {
	//inital set calendar.
	setMonthCale(mon);
	setEditData();
	genTags();

	//set shift calendar event
	let preMonthBtn = document.getElementById("preMonth");
	let nextMonthBtn = document.getElementById("nextMonth");
	preMonthBtn.addEventListener("click", function () {
		moveMonth(false);
	});
	nextMonthBtn.addEventListener("click", function () {
		moveMonth(true);
	});

	//set calendar adding schedule tag even.
	let caleCell = document.querySelectorAll(caleCellsSelector);
	caleCell.forEach((c) => c.addEventListener("click", setModalNew));

	//edits save events
	let saveBtns = document.querySelectorAll(".saveBtn");
	saveBtns.forEach((btn) => btn.addEventListener("click", editSave));

	//edit border color change
	let tagsRadio = document.querySelectorAll("#cardSchEditContent .tag-input");
	tagsRadio.forEach((t) =>
		t.addEventListener("click", function () {
			let card = document.getElementById("cardSchEditContent");
			card.style.borderColor = `var(--${this.value}-tag-color)`;
		})
	);
};

//---------move month----------

function moveMonth(isNext, date) {
	mon = isNext ? mon + 1 : mon - 1;
	setMonthCale(mon);
	if (date) {
		let target = document.querySelector(`td.cale-cell[date-for="${date}"] span`);
		target.click();
	}
}

function setMiniCellEvent() {
	let miniCaleCellPre = document.querySelectorAll("td.cale-cell span.text-muted.date-pre");
	let miniCaleCellNext = document.querySelectorAll("td.cale-cell span.text-muted.date-next");
	let miniCaleCellCurr = document.querySelectorAll("td.cale-cell span.date-curr");
	miniCaleCellPre.forEach((c) =>
		c.addEventListener("click", function () {
			let date = this.parentNode.getAttribute("date-for");
			moveMonth(false, date);
		})
	);
	miniCaleCellNext.forEach((c) =>
		c.addEventListener("click", function () {
			let date = this.parentNode.getAttribute("date-for");
			moveMonth(true, date);
		})
	);
	miniCaleCellCurr.forEach((c) => c.addEventListener("click", setCardNew));
}

//---------set schedule----------

function setSchsTag() {
	removeElementsByClass("sch");
	let dataString = localStorage.getItem(saveKey);
	if (!dataString) {
		return;
	}
	let schDatas = JSON.parse(dataString);
	let caleCell = document.querySelectorAll(caleCellsSelector);
	caleCell.forEach((cell) => setCellSch(cell, schDatas[cell.getAttribute("date-for")]));
}
function setCellSch(cell, array) {
	if (!array) {
		return;
	}

	array.forEach((schObj) => {
		let sch = newSch(schObj);
		sch.addEventListener("click", function (e) {
			schClickEvent(schObj, this.parentNode.getAttribute("date-for"));
			e.stopPropagation();
		});
		cell.appendChild(sch);
	});
}

function newSch({ schTitle, schTag = "blue" } = {}) {
	let sch = document.createElement("div");
	sch.classList.add("sch");
	sch.classList.add(`tag-${schTag}`);
	sch.innerText = schTitle;
	return sch;
}

function schClickEvent(schObj, date) {
	let editContentDate = {
		id: schObj.schID,
		date: date,
		title: schObj.schTitle,
		memo: schObj.schMemo,
	};
	setEditData(editContentDate);
}

//---------card----------
function setCardNew() {
	setMiniCaleCellActive(this);
	setEditData({ date: this.parentNode.getAttribute("date-for") });
}

function setMiniCaleCellActive(miniCaleCell) {
	let miniActives = document.querySelectorAll(".mini-active");
	miniActives.forEach((a) => a.classList.remove("mini-active"));
	miniCaleCell.classList.add("mini-active");
}

//---------modal----------

function setModalNew() {
	setEditData({ date: this.getAttribute("date-for") });
	$("#schModal").modal("show");
}

//---------edit common----------

function editSave() {
	let target = this.getAttribute("data-target");
	if (!target) {
		return;
	}

	let editDate = document.getElementById(`${target}SchDate`);
	let editTitle = document.getElementById(`${target}SchTitle`);
	let editMemo = document.getElementById(`${target}SchMemo`);
	let editTag = document.querySelector(`.tag-input[name='${target}SchTag']:checked`);
	let schFor = editDate.getAttribute("data-for");
	if (editTitle.value == "") {
		return;
	}
	let obj = {
		schID: schFor,
		schDate: editDate.innerText,
		schTag: editTag ? editTag.value : "",
		schTitle: editTitle.value,
		schMemo: editMemo.value,
	};
	saveLocalStorage(obj);
	setEditData();
	setSchsTag();
	$("#schModal").modal("hide");
}
function setEditData({ id = "new", date = moment().format("yyyy-MM-DD"), title = "", memo = "" } = {}) {
	["card", "modal"].forEach((target) => {
		let editDate = document.getElementById(`${target}SchDate`);
		let editTitle = document.getElementById(`${target}SchTitle`);
		let editMemo = document.getElementById(`${target}SchMemo`);
		editDate.setAttribute("data-for", id);
		editTitle.value = title;
		editDate.innerText = date;
		editMemo.value = memo;
	});
}

//---------local storage----------

function saveLocalStorage({ schDate, ...rest }) {
	let savedString = localStorage.getItem(saveKey);
	let savedJSON = JSON.parse(savedString) || {};
	let schArray = savedJSON[schDate] || [];

	if (rest.schID == "new") {
		rest.schID = schArray.length;
	}

	schArray[rest.schID] = { schDate: schDate, ...rest };
	savedJSON[schDate] = schArray;

	localStorage.setItem(saveKey, JSON.stringify(savedJSON));
}

//---------gen calendar----------

function setMonthCale(shift) {
	let newMoment = moment().add(shift, "M");
	let caleCell = document.querySelectorAll(caleCellsSelector);
	let miniCaleCell = document.querySelectorAll(miniCaleCellsSelector);
	let yearMonth = document.getElementById("yearMonth");
	yearMonth.innerText = newMoment.format("yyyy MMMM");
	genCale(moment(newMoment), caleCell);
	genCale(moment(newMoment), miniCaleCell);
	setSchsTag();
	setMiniCellEvent();
}

function genCale(dateObj, cells) {
	let today = moment();
	let day1OfWeek = dateObj.date(1).day();
	let theMonth = dateObj.get("month");
	let theCaleDate = dateObj.subtract(day1OfWeek, "days");
	for (let i = 0; i < cells.length; i++) {
		const cell = cells[i];
		setCaleCell(cell, theCaleDate, theMonth, today);
	}
}
function setCaleCell(cell, theCaleDate, theMonth, today) {
	cell.setAttribute("date-for", theCaleDate.format("yyyy-MM-DD"));
	cell.innerHTML = "";
	let dateSpan = document.createElement("span");
	if (theMonth != theCaleDate.get("month")) {
		dateSpan.classList.add("text-muted");
		if (theMonth > theCaleDate.get("month")) {
			dateSpan.classList.add("date-pre");
		} else {
			dateSpan.classList.add("date-next");
		}
	} else {
		dateSpan.classList.add("date-curr");
	}
	if (today.isSame(theCaleDate, "day")) {
		dateSpan.classList.add("today");
	}
	dateSpan.innerText = theCaleDate.get("date");

	cell.appendChild(dateSpan);
	theCaleDate.add(1, "days");
}

//---------gen tags----------

function genTags() {
	let tagSections = document.querySelectorAll(".tag-section");
	let colors = ["blue", "green", "yellow", "orange", "purple", "red"];
	tagSections.forEach((x) => {
		colors.forEach((c) => x.appendChild(genTag(c)));
	});
}
function genTag(color) {
	let label = document.createElement("label");

	let input = document.createElement("input");
	input.classList.add("tag-input");
	input.type = "radio";
	input.value = color;
	input.name = "cardSchTag";

	let div = document.createElement("div");
	div.classList.add("tag");
	div.classList.add(`tag-${color}`);

	label.appendChild(input);
	label.appendChild(div);
	return label;
}

//---------common----------

function removeElementsByClass(className) {
	var elements = document.getElementsByClassName(className);
	while (elements.length > 0) {
		elements[0].parentNode.removeChild(elements[0]);
	}
}
