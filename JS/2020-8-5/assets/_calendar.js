import * as _common from "./_common.js";
import { setSchsTag } from "./_schedule.js";
import { setMiniCellEvent } from "./_event.js";

export function setMonthCale(shift = 0) {
	let newMoment = moment().add(shift, "months");
	let caleCell = document.querySelectorAll(_common.caleCellsSelector);
	let miniCaleCell = document.querySelectorAll(_common.miniCaleCellsSelector);
	let yearMonth = document.getElementById("yearMonth");
	yearMonth.innerText = newMoment.format("yyyy MMMM");
	genCale(moment(newMoment), caleCell);
	genCale(moment(newMoment), miniCaleCell);
	setSchsTag();
	setMiniCellEvent();
}
export function genCale(theMoment, cells) {
	let today = moment();
	let day1OfWeek = theMoment.date(1).day();
	let comparator = theMoment.format("yyyyMM");
	let theCaleStartDate = theMoment.subtract(day1OfWeek, "days");
	for (let i = 0; i < cells.length; i++) {
		const cell = cells[i];
		setCaleCell(cell, theCaleStartDate, comparator, today);
	}
}
export function setCaleCell(cell, theCaleDate, comparator, today) {
	cell.setAttribute("date-for", theCaleDate.format("yyyy-MM-DD"));
	cell.innerHTML = "";
	let dateSpan = document.createElement("span");
	if (comparator != theCaleDate.format("yyyyMM")) {
		dateSpan.classList.add("text-muted");
		if (comparator > theCaleDate.format("yyyyMM")) {
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
var monthShift = 0;
export function moveMonth(isNext, date) {
	monthShift = isNext ? monthShift + 1 : monthShift - 1;
	setMonthCale(monthShift);
	if (date) {
		let target = document.querySelector(`td.cale-cell[date-for="${date}"] span`);
		target.click();
	}
}
