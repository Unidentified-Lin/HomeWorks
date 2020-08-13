import * as _common from "./_common.js";
import { saveKey } from "./_localStorage.js";
import { setEditData } from "./_edit.js";

export function setSchsTag() {
	_common.removeElementsByClass("sch");
	let savedString = localStorage.getItem(saveKey);
	if (!savedString) {
		return;
	}
	let savedJSON = JSON.parse(savedString) || {};
	let currMonthJSON = {};
	let caleCell = document.querySelectorAll(_common.caleCellsSelector);
	//extract current calendar/month dateObj
	caleCell.forEach((cell, index) => {
		let dateKey = cell.getAttribute("date-for");
		if (savedJSON.hasOwnProperty(dateKey)) {
			currMonthJSON[dateKey] = savedJSON[dateKey];
		}
	});
	setSchBar(currMonthJSON, Object.keys(currMonthJSON)[0]);
}

export function setSchBar(currMonthJSON, dateKey) {
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
		let theCaleCell = document.querySelector(`${_common.caleCellsSelector}[date-for="${theMomentFormat}"]`);
		if (!theCaleCell) {
			break;
		}
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

export function newSch({ schTitle, schTag, schWholeDay } = {}, barLength = 1) {
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
export function newBlankSch() {
	let sch = document.createElement("div");
	sch.classList.add("sch");
	sch.classList.add("sch-blank");
	return sch;
}
