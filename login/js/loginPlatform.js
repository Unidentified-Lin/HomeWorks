import { setLoginBarcode } from "./_barcode.js";
import { registerTicketLoginTransition } from "./_loginEvents.js";

window.onload = function () {
	setLoginBarcode();

	registerTicketLoginTransition();
};
