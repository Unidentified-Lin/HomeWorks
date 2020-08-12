import { uuid } from "./uuid.js";

var monthShift = 0;
const saveKey = "schJSON";
const caleCellsSelector = "#cale-content .cale-cell";
const miniCaleCellsSelector = "td.cale-cell";

window.onload = function () {
	//inital set calendar.
	setMonthCale(monthShift);
	genTags();
	initTimeScroll();
	setEditData();

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
	caleCell.forEach((c) =>
		c.addEventListener("click", function () {
			let date = this.getAttribute("date-for");
			setModalNew(date, true);
		})
	);

	//edits save events
	let saveBtns = document.querySelectorAll(".saveBtn");
	saveBtns.forEach((btn) => btn.addEventListener("click", editSave));

	//edits delete events
	let deleteBtns = document.querySelectorAll(".deleteBtn");
	deleteBtns.forEach((btn) => btn.addEventListener("click", editDelete));

	//edit border color change
	let tagsRadio = document.querySelectorAll("#cardSchEditContent .tag-input");
	tagsRadio.forEach((t) =>
		t.addEventListener("click", function () {
			setCardBorderColor(this.value);
		})
	);

	//edit day toggle event
	let dayToggles = document.querySelectorAll(".toggle-input");
	dayToggles.forEach((t) =>
		t.addEventListener("change", function () {
			toggleHHmm(this.checked);
		})
	);

	let timeEdits = document.querySelectorAll(".time-edit");
	timeEdits.forEach((timeEdit) =>
		timeEdit.addEventListener("click", function () {
			toggleTimeScroll(this.id);
		})
	);
};

function setCardBorderColor(color = "default") {
	let card = document.getElementById("cardSchEditContent");
	if (color == "default") {
		card.style.removeProperty("border-color");
	} else {
		card.style.borderColor = `var(--${color}-tag-color)`;
	}
}

//---------set time scroll----------
const yearRange = 51;
function initTimeScroll() {
	genScrollTime(
		"year",
		[...Array(yearRange).keys()].map((i) =>
			moment()
				.add(i - (yearRange - 1) / 2, "years")
				.get("year")
		)
	);
	genScrollTime(
		"month",
		[...Array(12).keys()].map((i) => i + 1)
	);
	genScrollTime(
		"date",
		[...Array(31).keys()].map((i) => i + 1)
	);
	genScrollTime("hour", [...Array(24).keys()]);
	genScrollTime("min", [...Array(60).keys()]);

	initSlick();
	regiSlickEvent();
}
function initSlick() {
	$(".time-scroll>[class^='scroll-']").slick({
		arrows: false,
		centerMode: true,
		centerPadding: "10px",
		slidesToShow: 3,
		focusOnSelect: true,
		vertical: true,
		verticalSwiping: true,
		swipeToSlide: true,
		waitForAnimate: false,
		responsive: [
			{
				breakpoint: 768,
				settings: {
					arrows: false,
					centerMode: true,
					centerPadding: "10px",
					slidesToShow: 3,
				},
			},
			{
				breakpoint: 480,
				settings: {
					arrows: false,
					centerMode: true,
					centerPadding: "5px",
					slidesToShow: 1,
				},
			},
		],
	});
}
function regiSlickEvent() {
	$("[class^='scroll-']").on("afterChange", function (slick, currentSlide) {
		// let currentSlideValue = this.querySelector(".slick-center").innerText;
		let editTargetId = this.getAttribute("data-for");
		let editTarget = document.getElementById(editTargetId);
		let scrollDateValues = document.querySelectorAll(`[data-for="${editTargetId}"] .slick-current.slick-center`);
		switch (scrollDateValues.length) {
			case 2:
				let HH = scrollDateValues[0].innerText;
				let mm = scrollDateValues[1].innerText;
				editTarget.innerText = `${HH}:${mm}`;

				break;
			case 3:
				let year = scrollDateValues[0].innerText;
				let month = scrollDateValues[1].innerText;
				let date = scrollDateValues[2].innerText;
				editTarget.innerText = `${year}-${month}-${date}`;
				break;

			default:
				break;
		}
	});
}
function genScrollTime(type, array) {
	let typeScrolls = document.querySelectorAll(`.scroll-${type}`);
	typeScrolls.forEach((typeScroll) => {
		array.forEach((item) => {
			let div = document.createElement("div");
			div.classList.add("time-pick");
			div.innerText = item.toString().padStart(2, "0");
			typeScroll.appendChild(div);
		});
	});
}
function toggleHHmm(isHide) {
	let HHmms = document.querySelectorAll(".HHmm");
	HHmms.forEach((HHmm) => {
		isHide ? HHmm.classList.remove("show") : HHmm.classList.add("show");
	});
	setScrollPosition();
}
function toggleTimeScroll(target) {
	let scroll = document.querySelector(`.time-scroll[data-for="${target}"]`);
	scroll.classList.toggle("show");
	setScrollPosition();
}
function setScrollTime(target, dateValue, timeValue) {
	setScrollDate(target, dateValue);
	setScrollHHmm(target, timeValue);
}
function setScrollDate(target, dateValue = moment().format("yyyy-MM-DD")) {
	let reg = /^(19|2\d)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
	if (reg.test(dateValue)) {
		let vals = dateValue.split("-");
		setScroll(target, "year", vals[0]);
		setScroll(target, "month", vals[1]);
		setScroll(target, "date", vals[2]);
	}
}
function setScrollHHmm(target, timeValue = moment().format("HH:mm")) {
	let reg = /^((0|1)\d|2[0-3]):([0-5]\d)$/;
	if (reg.test(timeValue)) {
		let vals = timeValue.split(":");
		setScroll(target, "hour", vals[0]);
		setScroll(target, "min", vals[1]);
	}
}
function setScroll(target, type, value) {
	let val = Number(value);
	switch (type) {
		case "year":
			val = val - moment().get("year") + (yearRange - 1) / 2;
			(yearRange - 1) / 2;
			break;
		case "month":
		case "date":
			val = val - 1;
			break;
		default:
			break;
	}
	$(`.time-scroll[data-for="${target}"] .scroll-${type}`).slick("slickGoTo", val);
}
function setScrollPosition() {
	//needs to set postion twice
	$(".time-scroll>[class^='scroll-']").slick("setPosition");
	$(".time-scroll>[class^='scroll-']").slick("setPosition");
}

//---------move month----------

function moveMonth(isNext, date) {
	monthShift = isNext ? monthShift + 1 : monthShift - 1;
	setMonthCale(monthShift);
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
	miniCaleCellCurr.forEach((c) =>
		c.addEventListener("click", function () {
			let date = this.parentNode.getAttribute("date-for");
			setCardNew(date, true);
		})
	);
}

//---------set schedule----------

function setSchsTag() {
	removeElementsByClass("sch");
	let savedString = localStorage.getItem(saveKey);
	if (!savedString) {
		return;
	}
	let savedJSON = JSON.parse(savedString) || {};
	let currMonthJSON = {};
	let caleCell = document.querySelectorAll(caleCellsSelector);
	//extract current calendar/month dateObj
	caleCell.forEach((cell, index) => {
		let dateKey = cell.getAttribute("date-for");
		if (savedJSON.hasOwnProperty(dateKey)) {
			currMonthJSON[dateKey] = savedJSON[dateKey];
		}
	});
	setSchBar(currMonthJSON, Object.keys(currMonthJSON)[0]);
}

function setSchBar(currMonthJSON, dateKey) {
	if (!dateKey || Object.keys(currMonthJSON).length == 0 || !currMonthJSON.hasOwnProperty(dateKey)) {
		return;
	}
	//set single sch bar with blank sch
	let dateObjArray = currMonthJSON[dateKey];
	let dateObj = dateObjArray.shift();
	if (dateObjArray.length == 0) {
		delete currMonthJSON[dateKey];
	}
	let schDateFrom = dateObj.schDateFrom;
	let schDateTo = dateObj.schDateTo;
	let theMoment = moment(schDateFrom);
	let toMoment = moment(schDateTo);
	let leftBarLength = toMoment.diff(theMoment, "days") + 1;
	do {
		let theMomentFormat = theMoment.format("yyyy-MM-DD");
		let theCaleCell = document.querySelector(`${caleCellsSelector}[date-for="${theMomentFormat}"]`);
		if (schDateFrom == theMomentFormat || theMoment.day() == 0) {
			let currBarLength = Math.min(7 - theMoment.day(), leftBarLength);
			leftBarLength = leftBarLength - currBarLength;
			let sch = newSch(dateObj, currBarLength);
			sch.addEventListener("click", function (e) {
				setEditData(dateObj);
				e.stopPropagation();
			});
			theCaleCell.appendChild(sch);
		} else {
			theCaleCell.appendChild(newBlankSch());
		}
		theMoment.add(1, "days");
	} while (theMoment.diff(toMoment) <= 0);

	let nextDate = toMoment.add(1, "days");
	//find next date
	for (let dateKey in currMonthJSON) {
		if (moment(dateKey).diff(nextDate) >= 0) {
			setSchBar(currMonthJSON, dateKey);
		}
	}
	//or start over again
	setSchBar(currMonthJSON, Object.keys(currMonthJSON)[0]);
}

function newSch({ schTitle, schTag, schWholeDay } = {}, barLength = 1) {
	let sch = document.createElement("div");
	sch.classList.add("sch");
	if (barLength > 1) {
		sch.classList.add(`sch-${barLength}`);
	}
	let tag = schWholeDay ? "tag" : "tag-outline";
	sch.classList.add(`${tag}-${schTag}`);
	sch.innerText = schTitle;
	return sch;
}
function newBlankSch() {
	let sch = document.createElement("div");
	sch.classList.add("sch");
	sch.classList.add("sch-blank");
	return sch;
}

//---------card----------
function setCardNew(date, isActiveMiniCale) {
	if (isActiveMiniCale) {
		let miniCaleCell = document.querySelector(`td.cale-cell[date-for="${date}"] span.date-curr`);
		if (!miniCaleCell) {
			//prevent click other month's date from Main Calender
			return;
		}
		setMiniCaleCellActive(miniCaleCell);
	}
	setCardBorderColor();
	let timeString = `${date} ${moment().format("HH:mm")}`;
	setEditData({ date: moment(timeString) });
}

function setMiniCaleCellActive(miniCaleCell) {
	let miniActives = document.querySelectorAll(".mini-active");
	miniActives.forEach((a) => a.classList.remove("mini-active"));
	miniCaleCell.classList.add("mini-active");
}

//---------modal----------

function setModalNew(date, isActiveMiniCale) {
	setCardNew(date, isActiveMiniCale);
	$("#schModal").modal("show");
}

//---------edit common----------

function editSave() {
	let target = this.getAttribute("data-target");
	if (!target) {
		return;
	}

	let editTag = document.querySelector(`.tag-input[name='${target}SchTag']:checked`);
	let editDateFrom = document.getElementById(`${target}SchDateFrom`);
	let editHHmmFrom = document.getElementById(`${target}SchHHmmFrom`);
	let editDateTo = document.getElementById(`${target}SchDateTo`);
	let editHHmmTo = document.getElementById(`${target}SchHHmmTo`);
	let editTitle = document.getElementById(`${target}SchTitle`);
	let editMemo = document.getElementById(`${target}SchMemo`);
	if (editTitle.value == "") {
		return;
	}
	let editDayToggle = document.getElementById(`${target}DayToggle`);
	let obj = {
		schID: editDateFrom.getAttribute("data-for"),
		schWholeDay: editDayToggle.checked,
		schDateFrom: editDateFrom.innerText,
		schHHmmFrom: editDayToggle.checked ? "00:00" : editHHmmFrom.innerText,
		schDateTo: editDateTo.innerText,
		schHHmmTo: editDayToggle.checked ? "23:59" : editHHmmTo.innerText,
		schTag: editTag ? editTag.value : "default",
		schTitle: editTitle.value,
		schMemo: editMemo.value,
	};
	saveLocalStorage(obj);
	setEditData();
	setSchsTag();
	$("#schModal").modal("hide");
}
function setEditData({
	schID = "new",
	date = moment(),
	schWholeDay = true,
	schTitle = "",
	schMemo = "",
	...rest
} = {}) {
	let formatDate = moment(date).format("yyyy-MM-DD");
	let formatHHmmFrom =
		date.get("minutes") > 30
			? date.add(1, "hours").set("minute", 0).format("HH:mm")
			: date.set("minute", 30).format("HH:mm");
	let formatHHmmTo = date.add(1, "hours").format("HH:mm");

	["card", "modal"].forEach((target) => {
		let editDayToggle = document.getElementById(`${target}DayToggle`);
		let editTag = document.querySelector(`.tag-input[name='${target}SchTag'][value='${rest.schTag}']`);
		let editDateFrom = document.getElementById(`${target}SchDateFrom`);
		let editHHmmFrom = document.getElementById(`${target}SchHHmmFrom`);
		let editDateTo = document.getElementById(`${target}SchDateTo`);
		let editHHmmTo = document.getElementById(`${target}SchHHmmTo`);
		let editTitle = document.getElementById(`${target}SchTitle`);
		let editMemo = document.getElementById(`${target}SchMemo`);
		if (editTag) {
			editTag.checked = true;
			editTag.click();
		} else {
			//clear selected tag
			let tags = document.querySelectorAll(".tag-input");
			tags.forEach((tag) => (tag.checked = false));
			setCardBorderColor();
		}
		if (editDayToggle.checked != schWholeDay) {
			editDayToggle.click();
		}
		editDateFrom.setAttribute("data-for", schID);
		editDateTo.setAttribute("data-for", schID);
		editTitle.value = schTitle;
		editDateFrom.innerText = rest.schDateFrom || formatDate;
		editHHmmFrom.innerText = rest.schHHmmFrom || formatHHmmFrom;
		editDateTo.innerText = rest.schDateTo || formatDate;
		editHHmmTo.innerText = rest.schHHmmTo || formatHHmmTo;
		editMemo.value = schMemo;
		setScrollTime(`${target}SchTimeEditFrom`, editDateFrom.innerText, editHHmmFrom.innerText);
		setScrollTime(`${target}SchTimeEditTo`, editDateTo.innerText, editHHmmTo.innerText);
	});
}

function editDelete() {
	let target = this.getAttribute("data-target");
	if (!target) {
		return;
	}

	let editDateFrom = document.getElementById(`${target}SchDateFrom`);
	let schID = editDateFrom.getAttribute("data-for");
	removeLocalStorage(schID);
	setEditData();
	setSchsTag();
	$("#schModal").modal("hide");
}
//---------local storage----------

function saveLocalStorage({ schID, schDateFrom, schDateTo, ...rest }) {
	let savedString = localStorage.getItem(saveKey);
	let savedJSON = JSON.parse(savedString) || {};

	let dateObjArray = savedJSON[schDateFrom] || [];

	if (schID == "new") {
		schID = uuid();
		dateObjArray.push({ schID: schID, schDateFrom: schDateFrom, schDateTo: schDateTo, ...rest });
	} else {
		//Alter
		let index = dateObjArray.findIndex((o) => o.schID == schID);
		if (index >= 0) {
			dateObjArray[index] = { schID: schID, schDateFrom: schDateFrom, schDateTo: schDateTo, ...rest };
		} else {
			removeLocalStorage(schID, savedJSON);
			dateObjArray.push({ schID: schID, schDateFrom: schDateFrom, schDateTo: schDateTo, ...rest });
		}
	}

	savedJSON[schDateFrom] = dateObjArray;

	localStorage.setItem(saveKey, JSON.stringify(savedJSON));
}

function removeLocalStorage(schID, savedJSON = localStorage.getItem(saveKey)) {
	let needToSave = typeof savedJSON == "string";
	if (needToSave) {
		savedJSON = JSON.parse(savedJSON);
	}
	for (let dateKey in savedJSON) {
		let theDateObjArray = savedJSON[dateKey];
		let theIndex = theDateObjArray.findIndex((o) => o.schID == schID);
		if (theIndex >= 0) {
			theDateObjArray.splice(theIndex, 1); //remove dateObj from array;
			if (theDateObjArray.length == 0) {
				delete savedJSON[dateKey];
			}
			break;
		}
	}
	if (needToSave) {
		localStorage.setItem(saveKey, JSON.stringify(savedJSON));
	}
}
//---------gen calendar----------

function setMonthCale(shift) {
	let newMoment = moment().add(shift, "months");
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
		colors.forEach((c) => x.appendChild(genTag(x.getAttribute("for"), c)));
	});
}
function genTag(target, color) {
	let label = document.createElement("label");

	let input = document.createElement("input");
	input.classList.add("tag-input");
	input.type = "radio";
	input.value = color;
	input.name = `${target}SchTag`;

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
