var mon = 0;
const saveKey = "schJSON";
const caleCellsSelector = "#cale-content .cale-cell";
const miniCaleCellsSelector = "td.cale-cell";

window.onload = function () {
	//inital set calendar.
	setMonthCale(mon);
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
			setCardNew(date, true);
		})
	);

	//edits save events
	let saveBtns = document.querySelectorAll(".saveBtn");
	saveBtns.forEach((btn) => btn.addEventListener("click", editSave));

	//edit border color change
	let tagsRadio = document.querySelectorAll("#cardSchEditContent .tag-input");
	tagsRadio.forEach((t) =>
		t.addEventListener("click", function () {
			setCardBorderColor(this.value);
		})
	);

	//day toggle event
	let cardDayToggle = document.getElementById("cardDayToggle");
	cardDayToggle.addEventListener("change", function () {
		toggleHHmm(this.checked);
	});

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
				.add("year", i - (yearRange - 1) / 2)
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
		// HHmm.classList.toggle('show');
		isHide ? HHmm.classList.remove("show") : HHmm.classList.add("show");
		// HHmm.style.display = isHide ? "none" : "block";
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
			setEditData(schObj);
			e.stopPropagation();
		});
		cell.appendChild(sch);
	});
}

function newSch({ schTitle, schTag, schWholeDay } = {}) {
	let sch = document.createElement("div");
	sch.classList.add("sch");
	let tag = schWholeDay ? "tag" : "tag-outline";
	sch.classList.add(`${tag}-${schTag}`);
	sch.innerText = schTitle;
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

function setModalNew() {
	let timeString = `${this.getAttribute("date-for")} ${moment().format("HH:mm")}`;
	setEditData({ date: moment(timeString) });
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
			? date.add("hour", 1).set("minute", 0).format("HH:mm")
			: date.set("minute", 30).format("HH:mm");
	let formatHHmmTo = date.add("hour", 1).format("HH:mm");

	// ["card", "modal"].forEach((target) => {
	["card"].forEach((target) => {
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

//---------local storage----------

function saveLocalStorage({ schDateFrom, ...rest }) {
	let savedString = localStorage.getItem(saveKey);
	let savedJSON = JSON.parse(savedString) || {};
	let schArray = savedJSON[schDateFrom] || [];

	if (rest.schID == "new") {
		rest.schID = schArray.length;
	}

	schArray[rest.schID] = { schDateFrom: schDateFrom, ...rest };
	savedJSON[schDateFrom] = schArray;

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
