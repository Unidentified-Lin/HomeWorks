import { setLoginBarcode } from "./_barcode.js";
import { registerTicketLoginTransition, registerLoginContainers } from "./_loginEvents.js";

window.onload = function () {
	setLoginBarcode();

	registerTicketLoginTransition();

	registerLoginContainers();
};
