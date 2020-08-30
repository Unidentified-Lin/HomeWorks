import { setLoginBarcode } from "./_barcode.js";
import { registerTicketLoginTransition, registerLoginContainers, registerSignUpLogInToggle } from "./_loginEvents.js";

window.onload = function () {
	setLoginBarcode();

	registerTicketLoginTransition();

	registerLoginContainers();

	registerSignUpLogInToggle();
};
