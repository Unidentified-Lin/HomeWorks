var mon = 0;
const saveKey = "schJSON";
const caleCellsSelector = "#cale-content .cale-cell";
const miniCaleCellsSelector = "table td.cale-cell";

window.onload = function () {
	setMonthCale(mon);

	let preMonthBtn = document.getElementById("preMonth");
	let nextMonthBtn = document.getElementById("nextMonth");
	preMonthBtn.addEventListener("click", function (e) {
		mon -= 1;
		setMonthCale(mon);
	});
	nextMonthBtn.addEventListener("click", function (e) {
		mon += 1;
		setMonthCale(mon);
	});
	let caleCell = document.querySelectorAll(caleCellsSelector);
	caleCell.forEach((cell) => {
		cell.addEventListener("click", function () {
			let modalData = {
				id: "new",
				date: this.getAttribute("date-for"),
				title: "",
			};
			setModalData(modalData);
			$("#schModal").modal("show");
		});
	});

	let saveBtn = document.getElementById("modalSave");
	saveBtn.addEventListener("click", modalSave);
};

//---------set schedule----------

function setSchsTag() {
	removeElementsByClass("sch");
	let schDatas = JSON.parse(localStorage.getItem(saveKey));
	if (!schDatas) {
		return;
	}
	let caleCell = document.querySelectorAll(caleCellsSelector);
	caleCell.forEach((cell) => {
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
			let modalData = {
				id: schObj.schID,
				date: this.parentNode.getAttribute("date-for"),
				title: schObj.schTitle,
			};
			setModalData(modalData);
			$("#schModal").modal("show");

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
	let schFor = modalDate.getAttribute("data-for");
	let obj = {
		schID: schFor,
		schDate: modalDate.innerText,
		schTitle: modalTitle.value,
	};
	saveLocalStorage(obj);
	modalClear();
	$("#schModal").modal("hide");
	setSchsTag();
}

function modalClear() {
	document.getElementById("modalSchDate").innerText = "";
	document.getElementById("modalSchTitle").value = "";
}

function setModalData(obj) {
	let modalDate = document.getElementById("modalSchDate");
	let modalTitle = document.getElementById("modalSchTitle");

	modalDate.setAttribute("data-for", obj.id);
	modalDate.innerText = obj.date;
	modalTitle.value = obj.title;
}

//---------local storage----------

function saveLocalStorage(obj) {
	let savedString = localStorage.getItem(saveKey);
	let savedJSON = JSON.parse(savedString) || {};
	let schArray = savedJSON[obj.schDate] || [];

	if (obj.schID == "new") {
		obj.schID = schArray.length;
	}

	let isFind = schArray.some((o) => {
		if (obj.schID == o.schID) {
			o.schTitle = obj.schTitle;
			return true;
		}
		return false;
	});

	if (!isFind) {
		let schObj = {
			schID: obj.schID,
			schTitle: obj.schTitle,
		};
		schArray.push(schObj);
	}

	savedJSON[obj.schDate] = schArray;

	localStorage.setItem(saveKey, JSON.stringify(savedJSON));
}

//---------calendar----------

function setMonthCale(shift) {
	let newMoment = moment().add(shift, "M");
	let caleCell = document.querySelectorAll(caleCellsSelector);
	let miniCaleCell = document.querySelectorAll(miniCaleCellsSelector);
	let yearMonth = document.getElementById("yearMonth");
	yearMonth.innerText = newMoment.format("yyyy MMMM");
	genCale(moment(newMoment), caleCell);
	genCale(moment(newMoment), miniCaleCell);
	setSchsTag();
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
	}
	if (today.isSame(theCaleDate, "day")) {
		dateSpan.classList.add("today");
	}
	dateSpan.innerText = theCaleDate.get("date");

	cell.appendChild(dateSpan);
	theCaleDate.add(1, "days");
}

function removeElementsByClass(className) {
	var elements = document.getElementsByClassName(className);
	while (elements.length > 0) {
		elements[0].parentNode.removeChild(elements[0]);
	}
}
