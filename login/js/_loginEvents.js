export function registerTicketLoginTransition() {
	let logins = document.querySelectorAll(".login");
	logins.forEach((btn) =>
		btn.addEventListener("click", function () {
			let targetId = this.getAttribute("data-target");
			let ticketStub = document.querySelector(`#${targetId} .ticketStub`);
			let ticketReceipt = document.querySelector(`#${targetId} .ticketReceipt`);
			ticketStub.style.transform = "rotateZ(-2deg)";
			ticketReceipt.style.transform = "rotateZ(4deg)";
		})
	);
}

export function registerLoginContainers() {
	let loginContainers = document.querySelectorAll(".login-container");
	loginContainers.forEach(function (c) {
		c.addEventListener("transitionrun", function () {
			let container = this;
			container.classList.add("running");
		});
		c.addEventListener("transitioncancel", function () {
			let container = this;
			container.classList.remove("running");
		});
		c.addEventListener("transitionend", function () {
			let container = this;
			container.classList.remove("running");
		});
		c.addEventListener("mouseover", function () {
			let container = this;
			if (!container.classList.contains("active") && !container.classList.contains("running")) {
				container.style.left = "-74%";
			}
		});
		c.addEventListener("mouseleave", function () {
			let container = this;
			if (!container.classList.contains("active")) {
				container.style.removeProperty("left");
			}
		});
		c.addEventListener(
			"click",
			function (e) {
				let container = this;
				if (container.classList.contains("active")) {
					if (container.classList.contains("running")) {
						e.stopPropagation();
					}
					return;
				}
				container.style.removeProperty("left");
				loginContainers.forEach((c) => c.classList.toggle("active"));
				e.stopPropagation();
			},
			true
		);
	});
}

export function registerSignUpLogInToggle(){
	let signups = document.querySelectorAll(".signup");
	signups.forEach(function (signup) {
		signup.addEventListener("change", function () {
			let targetId = this.getAttribute("data-target");
			let actionType = document.querySelector(`#${targetId} .actionType`);
			if (this.checked) {
				actionType.textContent = "Sign up";
			} else {
				actionType.textContent = "Log in";
			}
		});
	});
}
