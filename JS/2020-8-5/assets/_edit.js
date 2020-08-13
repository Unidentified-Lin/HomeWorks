import { saveLocalStorage, removeLocalStorage } from "./_localStorage.js";
import { setScrollTime } from "./_scroll.js";
import { setSchsTag } from "./_schedule.js";

//---------card----------
export function setCardNew(date, isActiveMiniCale) {
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
export function setMiniCaleCellActive(miniCaleCell) {
	let miniActives = document.querySelectorAll(".mini-active");
	miniActives.forEach((a) => a.classList.remove("mini-active"));
	miniCaleCell.classList.add("mini-active");
}
export function setCardBorderColor(color = "default") {
	let card = document.getElementById("cardSchEditContent");
	if (color == "default") {
		card.style.removeProperty("border-color");
	} else {
		card.style.borderColor = `var(--${color}-tag-color)`;
	}
}

//---------modal----------

export function setModalNew(date, isActiveMiniCale) {
	setCardNew(date, isActiveMiniCale);
	$("#schModal").modal("show");
}

//---------edit----------
export function editSave() {
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
export function editDelete() {
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
export function setEditData({
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
