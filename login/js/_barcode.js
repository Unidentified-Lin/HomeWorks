
export function setLoginBarcode() {
	let docStyle = getComputedStyle(document.documentElement);
	let backPaper = docStyle.getPropertyValue("--back-paper");
	JsBarcode(".barcode", moment().format("yyyyMMDD"), {
		width: 1.5,
		height: 50,
		fontSize: 12,
		margin: 5,
		background: "transparent",
		lineColor: backPaper,
	});
}
