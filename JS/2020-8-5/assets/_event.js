import * as _common from "./_common.js";
import { toggleHHmm, toggleTimeScroll } from "./_scroll.js";
import { moveMonth } from "./_calendar.js";
import { editSave, editDelete, setCardBorderColor, setCardNew, setModalNew } from "./_edit.js";

export default function () {
	//calendar shift event
	let preMonthBtn = document.getElementById("preMonth");
	let nextMonthBtn = document.getElementById("nextMonth");
	preMonthBtn.addEventListener("click", function () {
		moveMonth(false);
	});
	nextMonthBtn.addEventListener("click", function () {
		moveMonth(true);
	});

	//calendar cell click even.
	let caleCell = document.querySelectorAll(_common.caleCellsSelector);
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

	//edit card border color change
	let tagsRadio = document.querySelectorAll("#cardSchEditContent .tag-input");
	tagsRadio.forEach((t) =>
		t.addEventListener("click", function () {
			setCardBorderColor(this.value);
		})
	);

	//edits day toggle event
	let dayToggles = document.querySelectorAll(".toggle-input");
	dayToggles.forEach((t) =>
		t.addEventListener("change", function () {
			toggleHHmm(this.checked);
		})
	);

	//time edits toggle event
	let timeEdits = document.querySelectorAll(".time-edit");
	timeEdits.forEach((timeEdit) =>
		timeEdit.addEventListener("click", function () {
			toggleTimeScroll(this.id);
		})
	);
}

export function registerSlickEvent() {
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

export function setMiniCellEvent() {
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
