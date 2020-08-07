var mon = 0;
const saveKey = "schJSON";
const caleCellsSelector = "#cale-content .cale-cell";
const miniCaleCellsSelector = "td.cale-cell";

window.onload = function () {
	//inital set calendar.
	setMonthCale(mon);
	setCardData();

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

	//modal save event
	let modalSaveBtn = document.getElementById("modalSave");
	modalSaveBtn.addEventListener("click", modalSave);

	//card save event
	let cardSaveBtn = document.getElementById("cardSave");
	cardSaveBtn.addEventListener("click", cardSave);
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
		let sch = newSch(schObj.schTitle);
		sch.addEventListener("click", function (e) {
			// schClickModalEvent(schObj, this.parentNode.getAttribute("date-for"));
			schClickCardEvent(schObj, this.parentNode.getAttribute("date-for"));
			e.stopPropagation();
		});
		cell.appendChild(sch);
	});
}

function newSch(text) {
	let sch = document.createElement("div");
	sch.classList.add("sch");
	sch.innerText = text;
	return sch;
}

function schClickCardEvent(schObj, date) {
	let editContentDate = {
		id: schObj.schID,
		date: date,
		title: schObj.schTitle,
		memo: schObj.schMemo,
	};
	setCardData(editContentDate);
}
function schClickModalEvent(schObj, date) {
	let modalData = {
		id: schObj.schID,
		date: date,
		title: schObj.schTitle,
		memo: schObj.schMemo,
	};
	setModalData(modalData);
	$("#schModal").modal("show");
}

//---------card----------
function setCardNew() {
	setMiniCaleCellActive(this);
	setCardData({ date: this.parentNode.getAttribute("date-for") });
}

function setMiniCaleCellActive(miniCaleCell) {
	let miniActives = document.querySelectorAll(".mini-active");
	miniActives.forEach((a) => a.classList.remove("mini-active"));
	miniCaleCell.classList.add("mini-active");
}

function setCardData({ id = "new", date = moment().format("yyyy-MM-DD"), title = "", memo = "" } = {}) {
	let cardTitle = document.getElementById("editCardTitle");
	let cardDate = document.getElementById("editCardDate");
	let cardMemo = document.getElementById("cardMemo");

	cardDate.setAttribute("data-for", id);
	cardTitle.value = title;
	cardDate.innerText = date;
	cardMemo.value = memo;
}
function cardSave() {
	let cardDate = document.getElementById("editCardDate");
	let cardTitle = document.getElementById("editCardTitle");
	let cardMemo = document.getElementById("cardMemo");
	let schFor = cardDate.getAttribute("data-for");
	let obj = {
		schID: schFor,
		schDate: cardDate.innerText,
		schTitle: cardTitle.value,
		schMemo: cardMemo.value,
	};
	saveLocalStorage(obj);
	setCardData();
	setSchsTag();
}

//---------modal----------

function setModalNew() {
	setModalData({ date: this.getAttribute("date-for") });
	$("#schModal").modal("show");
}

function modalSave() {
	let modalDate = document.getElementById("modalSchDate");
	let modalTitle = document.getElementById("modalSchTitle");
	let modalMemo = document.getElementById("modalMemo");
	let schFor = modalDate.getAttribute("data-for");
	let obj = {
		schID: schFor,
		schDate: modalDate.innerText,
		schTitle: modalTitle.value,
		schMemo: modalMemo.value,
	};
	saveLocalStorage(obj);
	setModalData();
	$("#schModal").modal("hide");
	setSchsTag();
}

function setModalData({ id = "new", date = moment().format("yyyy-MM-DD"), title = "", memo = "" } = {}) {
	let modalDate = document.getElementById("modalSchDate");
	let modalTitle = document.getElementById("modalSchTitle");
	let modalMemo = document.getElementById("modalMemo");

	modalDate.setAttribute("data-for", id);
	modalTitle.value = title;
	modalDate.innerText = date;
	modalMemo.value = memo;
}

//---------local storage----------

function saveLocalStorage({ schDate, ...rest }) {
	let savedString = localStorage.getItem(saveKey);
	let savedJSON = JSON.parse(savedString) || {};
	let schArray = savedJSON[schDate] || [];

	if (rest.schID == "new") {
		rest.schID = schArray.length;
	}

	schArray[rest.schID] = { ...rest };
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

//---------common----------

function removeElementsByClass(className) {
	var elements = document.getElementsByClassName(className);
	while (elements.length > 0) {
		elements[0].parentNode.removeChild(elements[0]);
	}
}
