import { genColorTags } from "./_colorTag.js";
import { initTimeScroll } from "./_scroll.js";
import { setMonthCale } from "./_calendar.js";
import { setEditData } from "./_edit.js";
import registerEventListener from "./_event.js";

window.onload = function () {
	//inital set calendar.
	setMonthCale();
	genColorTags();
	initTimeScroll();
	setEditData();

	registerEventListener();
};
