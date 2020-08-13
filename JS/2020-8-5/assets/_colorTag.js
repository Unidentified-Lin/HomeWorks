export function genColorTags() {
	let tagSections = document.querySelectorAll(".tag-section");
	let colors = ["blue", "green", "yellow", "orange", "purple", "red"];
	tagSections.forEach((x) => {
		colors.forEach((c) => x.appendChild(genColorTag(x.getAttribute("for"), c)));
	});
}
export function genColorTag(target, color) {
	let label = document.createElement("label");

	let input = document.createElement("input");
	input.classList.add("tag-input");
	input.type = "radio";
	input.value = color;
	input.name = `${target}SchTag`;

	let div = document.createElement("div");
	div.classList.add("tag");
	div.classList.add(`tag-${color}`);

	label.appendChild(input);
	label.appendChild(div);
	return label;
}