let start = document.getElementById("start");
let reset = document.getElementById("reset");
let answer = document.getElementById("answer");
let guess = document.getElementById("guess");
let guess_number = document.getElementById("guess-number");
let guess_log = document.getElementById("guess-log");

start.addEventListener("click", startGame);
reset.addEventListener("click", resetGame);
answer.addEventListener("click", getAnswer);
guess.addEventListener("click", guessNumber);

var gameNumber;
function startGame() {
	clearLog();
	guess.disabled = false;
	reset.disabled = false;
	answer.disabled = false;
	gameNumber = getRandomDistinct(9, 4);
}
function resetGame() {
	getAnswer();
	startGame();
}
function getAnswer() {
	alert(gameNumber.join(""));
}
function guessNumber() {
    let number = guess_number.value;
    if (!number) {
        return;
    }
	let msg = findMatch(number);
	createLog(msg);
	guess_number.value = "";
}

function findMatch(number) {
    if (!number) {
        return;
    }
	let span = document.createElement("span");
	let badge = document.createElement("span");
	badge.classList.add("badge");
	badge.classList.add("mr-2");
	badge.innerText = "0A0B";

	let match = {
		A: 0,
		B: 0,
	};
	let numArray = number.split("");
	for (let i = 0; i < numArray.length; i++) {
		if (numArray[i] == gameNumber[i]) {
			match.A++;
		} else {
			if (gameNumber.some((x) => x == Number(numArray[i]))) {
				match.B++;
			}
		}
	}
	badge.innerText = `${match.A}A${match.B}B`;
	if (match.A == 4) {
		badge.classList.add("badge-success");
		guess.disabled = true;
	} else {
		badge.classList.add("badge-danger");
	}

	span.appendChild(badge);
	span.append(number);
	return span;
}

function createLog(msg) {
	let li = document.createElement("li");
	li.classList.add("list-group-item");
	li.classList.add("d-flex");
	li.classList.add("justify-content-between");
	li.appendChild(msg);
	li.appendChild(createTimeStamp());
	guess_log.prepend(li);
}
function clearLog() {
	guess_log.innerHTML = "";
}
function createTimeStamp() {
	let span = document.createElement("span");
	span.innerText = new Date().Format("yyyy-MM-dd HH:mm:ss");
	return span;
}

Date.prototype.Format = function (fmt) {
	let o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"H+": this.getHours(), //小時
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		S: this.getMilliseconds(), //毫秒
	};
	if (new RegExp("(y+)").test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (let k in o)
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, o[k].toString().padStart(2, "0"));
		}
	return fmt;
};

function getRandomRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
function getRandom(max) {
	return getRandomRange(0, max);
}
function getRandomDistinctRange(min, max, n) {
	if (n <= 0) {
		return;
	}
	let picked = [];
	while (picked.length < n) {
		let random = getRandomRange(min, max);
		if (picked.some((p) => p == random)) {
			continue;
		}
		picked.push(random);
	}
	return picked;
}
function getRandomDistinct(max, n) {
	return getRandomDistinctRange(0, max, n);
}
