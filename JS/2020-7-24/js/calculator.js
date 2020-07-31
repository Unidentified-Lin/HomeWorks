var isCalculate = false;
var isCalRandom = false;
window.onload = function () {
	let btns = document.querySelectorAll("button:not(.func)");
	btns.forEach((btn) => {
		btn.addEventListener("click", normalClick);
	});

	let calc = document.getElementById("calc");
	calc.addEventListener("click", calculate);

	let back = document.getElementById("back");
	back.addEventListener("click", removeBack);
	let clear = document.getElementById("clear");
	clear.addEventListener("click", clearCalDisplay);
	let random = document.getElementById("random");
	random.addEventListener("click", getCalRandom);

	var expDisplay = document.getElementById("expDisplay");
	var calDisplay = document.getElementById("calDisplay");
	calDisplay.addEventListener("input", function () {
		//event only from keyboard.
		let val = calDisplay.value;
		val = val.replace("+", "＋");
		val = val.replace("-", "－");
		val = val.replace("*", "×");
		val = val.replace("/", "÷");
		calDisplay.value = checkCalDisplay(val);
	});
};

function normalClick() {
	if (isCalculate) {
		calDisplay.value = "0";
		isCalculate = false;
	}
	calDisplay.value += this.innerText;
	calDisplay.value = checkCalDisplay(calDisplay.value);
}
function removeBack() {
	if (isCalculate) {
		calDisplay.value = "0";
		isCalculate = false;
	} else {
		let val = calDisplay.value;
		calDisplay.value = val.substr(0, val.length - 1);
	}
}

function calculate() {
	if (isCalRandom) {
		if (!expDisplay.innerText.includes("Random")) {
			expDisplay.innerText = calDisplay.value;
		}
		calDisplay.value = getRandom(expDisplay.innerText.substr(7));
	} else {
		let val = calDisplay.value;
		expDisplay.innerText = val + "=";
		val = val.replace("＋", "+");
		val = val.replace("－", "-");
		val = val.replace("×", "*");
		val = val.replace("÷", "/");
		val = val.replace("%", "*0.01");
		calDisplay.value = strip(eval(val));
	}
	isCalculate = true;
}

function clearCalDisplay() {
	expDisplay.innerText = "";
	calDisplay.value = "0";
	isCalculate = false;
	isCalRandom = false;
}

function checkCalDisplay(value) {
	//remove invalid char
	let validReg = /[^\d,%,＋,－,×,÷,.]/;
	value = value.replace(validReg, "");
	//trim leading 0
	value = value.replace(/^0+(?=\d)/, "");
	//replace operand (or duplicate %)
	let preDupReg = /[×,÷]+－[%,＋,－,×,÷]+/;
	if (preDupReg.test(value)) {
		let matchValue = value.match(preDupReg)[0].substr(0, 2);
		value = value.replace(preDupReg, matchValue);
	}
	let dupReg = /([×,÷]+[%,＋,×,÷]|[＋,－,.]+[%,＋,－,×,÷]|%{2,}|\.{2,})$/;
	if (dupReg.test(value)) {
		let matchValue = value.match(dupReg)[0];
		let replactValue = matchValue.substr(matchValue.length - 1, 1);
		value = value.replace(dupReg, replactValue);
	}
	//ex: 12×.3 => 12×0.3
	let operandDotReg = /[＋,－,×,÷]\.\d+/;
	if (operandDotReg.test(value)) {
		let matchValue = value.match(operandDotReg)[0].replace(".", "0.");
		value = value.replace(operandDotReg, matchValue);
	}
	//random
	if (isCalRandom) {
		let randomReg = /[^\d]+$/;
		if (randomReg.test(value)) {
			let matchValue = value.match(randomReg)[0];
			value = value.substr(0, value.length - matchValue.length);
		}
	}
	return value;
}

function strip(num, precision = 12) {
	return +parseFloat(num.toPrecision(precision));
}

function getCalRandom() {
	isCalRandom = true;
	calDisplay.value = "Random:";
}

function getRandomRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
function getRandom(max) {
	return getRandomRange(0, max);
}
