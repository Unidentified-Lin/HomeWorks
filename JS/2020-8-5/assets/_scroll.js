import { registerSlickEvent } from "./_event.js";

const yearRange = 51;
export function initTimeScroll() {
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
	registerSlickEvent();
}
export function initSlick() {
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
export function genScrollTime(type, array) {
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
export function toggleHHmm(isHide) {
	let HHmms = document.querySelectorAll(".HHmm");
	HHmms.forEach((HHmm) => {
		isHide ? HHmm.classList.remove("show") : HHmm.classList.add("show");
	});
	setScrollPosition();
}
export function toggleTimeScroll(target) {
	let scroll = document.querySelector(`.time-scroll[data-for="${target}"]`);
	scroll.classList.toggle("show");
	setScrollPosition();
}
export function setScrollTime(target, dateValue, timeValue) {
	setScrollDate(target, dateValue);
	setScrollHHmm(target, timeValue);
}
export function setScrollDate(target, dateValue = moment().format("yyyy-MM-DD")) {
	let reg = /^(19|2\d)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
	if (reg.test(dateValue)) {
		let vals = dateValue.split("-");
		setScroll(target, "year", vals[0]);
		setScroll(target, "month", vals[1]);
		setScroll(target, "date", vals[2]);
	}
}
export function setScrollHHmm(target, timeValue = moment().format("HH:mm")) {
	let reg = /^((0|1)\d|2[0-3]):([0-5]\d)$/;
	if (reg.test(timeValue)) {
		let vals = timeValue.split(":");
		setScroll(target, "hour", vals[0]);
		setScroll(target, "min", vals[1]);
	}
}
export function setScroll(target, type, value) {
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
export function setScrollPosition() {
	//needs to set postion twice
	$(".time-scroll>[class^='scroll-']").slick("setPosition");
	$(".time-scroll>[class^='scroll-']").slick("setPosition");
}
