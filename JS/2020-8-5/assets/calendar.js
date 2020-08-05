var mon = 0;
const saveKey = "schJSON";
window.onload = function () {
	setMonth(mon);

	let preMonthBtn = document.getElementById("preMonth");
	let nextMonthBtn = document.getElementById("nextMonth");
	preMonthBtn.addEventListener("click", function (e) {
		mon -= 1;
		setMonth(mon);
	});
	nextMonthBtn.addEventListener("click", function (e) {
		mon += 1;
		setMonth(mon);
	});
	let caleCell1 = document.querySelectorAll("#cale-content .cale-cell");
	caleCell1.forEach((cell) => {
		cell.addEventListener("click", function () {
			setModalDate(this);
			$("#schModal").modal("show");
		});
	});

	let saveBtn = document.getElementById("modalSave");
	saveBtn.addEventListener("click", modalSave);
};

//---------set schedule----------

function setSch() {
	let schDatas = JSON.parse(localStorage.getItem(saveKey));
	let caleCell1 = document.querySelectorAll("#cale-content .cale-cell");
	caleCell1.forEach((cell) => {
		let cellDate = cell.getAttribute("date-for");
		setCellSch(cell, schDatas[cellDate]);
	});
}
function setCellSch(cell, array) {
	if (!array) {
		return;
	}

	array.forEach((schObj) => {
		let sch = newSch(schObj.schTitle);
		sch.addEventListener("click", function (e) {
			console.log("sch click!");
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
//---------modal----------

function modalSave() {
	let modalDate = document.getElementById("modalSchDate");
	let modalTitle = document.getElementById("modalSchTitle");
	let obj = {
		schDate: modalDate.innerText,
		schTitle: modalTitle.value,
	};
	saveLocalStorage(obj);
	modalClear();
	$("#schModal").modal("hide");
}

function modalClear() {
	document.getElementById("modalSchDate").innerText = "";
	document.getElementById("modalSchTitle").value = "";
}

function setModalDate(target) {
	let theDate = target.childNodes[0].innerText;
	let modalDate = document.getElementById("modalSchDate");
	let yearMonth = document.getElementById("yearMonth");
	let clickDate = moment(yearMonth.innerText + " " + theDate).format("yyyy-MM-DD");
	modalDate.innerText = clickDate;
}

//---------local storage----------

function saveLocalStorage(obj) {
	let savedString = localStorage.getItem(saveKey);

	let savedJSON = JSON.parse(savedString) || {};
	let schArray = savedJSON[obj.schDate] || [];
	schArray.push({ schTitle: obj.schTitle });
	savedJSON[obj.schDate] = schArray;

	localStorage.setItem(saveKey, JSON.stringify(savedJSON));
}

//---------calendar----------

function setMonth(shift) {
	let newMoment = moment().add(shift, "M");
	let caleCell1 = document.querySelectorAll("#cale-content .cale-cell");
	let caleCell2 = document.querySelectorAll("table td.cale-cell");
	let yearMonth = document.getElementById("yearMonth");
	yearMonth.innerText = newMoment.format("yyyy MMMM");
	genCale(newMoment, caleCell1);
	genCale(newMoment, caleCell2);
	setSch();
}

function genCale(dateObj, cells) {
	const yMformat = "yyyy-MM";
	let config = {
		cells: cells,
		currMonthLastDate: dateObj.daysInMonth(),
		day1OfWeek: dateObj.date(1).day(),
		lastMonthLastDate: moment(dateObj).subtract(1, "M").daysInMonth(),
		pre_yyyyMM: moment(dateObj).subtract(1, "M").format(yMformat),
		yyyyMM: dateObj.format(yMformat),
		next_yyyyMM: moment(dateObj).add(1, "M").format(yMformat),
	};
	appendPreMonth(config);
	appendCurrMonth(config);
	appendNextMonth(config);
}

function appendPreMonth(config) {
	if (config.day1OfWeek == 0) {
		return;
	}
	for (let i = 0, dt = config.lastMonthLastDate; i < config.day1OfWeek; i++, dt++) {
		const cell = config.cells[i];
		let addClasses = ["text-muted"];
		setCaleCell(cell, config.pre_yyyyMM, dt, addClasses);
	}
}

function appendCurrMonth(config) {
	let todayDate = moment().date();
	for (let i = config.day1OfWeek, dt = 1; dt <= config.currMonthLastDate; i++, dt++) {
		const cell = config.cells[i];
		let addClasses = [];
		if (mon == 0 && todayDate == dt) {
			addClasses.push("today");
		}
		setCaleCell(cell, config.yyyyMM, dt, addClasses);
	}
}
function appendNextMonth(config) {
	let begPosition = config.day1OfWeek + config.currMonthLastDate;
	for (let i = begPosition, dt = 1; i < config.cells.length; i++, dt++) {
		const cell = config.cells[i];
		let addClasses = ["text-muted"];
		setCaleCell(cell, config.next_yyyyMM, dt, addClasses);
	}
}

function setCaleCell(cell, yyyyMM, dt, classes) {
	cell.setAttribute("date-for", `${yyyyMM}-${dt.toString().padStart(2, "0")}`);
	cell.innerHTML = "";
	let dateSpan = document.createElement("span");
	classes.forEach((className) => {
		dateSpan.classList.add(className);
	});
	dateSpan.innerText = dt;

	cell.appendChild(dateSpan);
}
