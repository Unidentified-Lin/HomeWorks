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
	// let newMoment = moment().add(shift, "M");
	let caleCell1 = document.querySelectorAll("#cale-content .cale-cell");
	let caleCell2 = document.querySelectorAll("table td.cale-cell");
	let yearMonth = document.getElementById("yearMonth");
	yearMonth.innerText = moment().add(shift, "M").format("yyyy MMMM");
	genCale(moment().add(shift, "M"), caleCell1);
	genCale(moment().add(shift, "M"), caleCell2);
}

function genCale(dateObj, cells) {
	let config = {
		cells: cells,
		currMonthLastDate: dateObj.daysInMonth(),
		day1OfWeek: dateObj.date(1).day(),
		lastMonthLastDate: dateObj.subtract(1, "M").daysInMonth(),
    };
    console.log(config);
	appendPreMonth(config.cells, config.lastMonthLastDate, config.day1OfWeek);
	appendCurrMonth(config.cells, config.day1OfWeek, config.currMonthLastDate);
	appendNextMonth(config.cells, config.day1OfWeek + config.currMonthLastDate);
}

function appendPreMonth(caleCell, monthLastDate, fillCount) {
	if (fillCount == 0) {
		return;
	}
	for (let i = 0, dt = monthLastDate; i < fillCount; i++, dt++) {
        const cell = caleCell[i];
		cell.innerHTML = `<span class="text-muted">${dt}</span>`;
	}
}

function appendCurrMonth(caleCell, day1OfWeek, monthLastDate) {
	let todayDate = moment().date();
	for (let i = day1OfWeek, dt = 1; dt <= monthLastDate; i++, dt++) {
		const cell = caleCell[i];
		cell.innerHTML = `<span>${dt}</span>`;
		if (mon == 0 && todayDate == dt) {
			cell.childNodes[0].classList.add("today");
		}
	}
}
function appendNextMonth(caleCell, begPosition) {
	for (let i = begPosition, dt = 1; i < caleCell.length; i++, dt++) {
		const cell = caleCell[i];
		cell.innerHTML = `<span class="text-muted">${dt}</span>`;
	}
}
