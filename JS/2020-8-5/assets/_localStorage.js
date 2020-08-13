import * as _common from "./_common.js";

export const saveKey = "schJSON";
export function saveLocalStorage({ schID, schDateFrom, schDateTo, ...rest }) {
	let savedString = localStorage.getItem(saveKey);
	let savedJSON = JSON.parse(savedString) || {};

	let dateObjArray = savedJSON[schDateFrom] || [];

	if (schID == "new") {
		schID = _common.uuid();
		dateObjArray.push({ schID: schID, schDateFrom: schDateFrom, schDateTo: schDateTo, ...rest });
	} else {
		//Alter
		let index = dateObjArray.findIndex((o) => o.schID == schID);
		if (index >= 0) {
			dateObjArray[index] = { schID: schID, schDateFrom: schDateFrom, schDateTo: schDateTo, ...rest };
		} else {
			removeLocalStorage(schID, savedJSON);
			dateObjArray.push({ schID: schID, schDateFrom: schDateFrom, schDateTo: schDateTo, ...rest });
		}
	}

	savedJSON[schDateFrom] = dateObjArray;

	localStorage.setItem(saveKey, JSON.stringify(savedJSON));
}

export function removeLocalStorage(schID, savedJSON = localStorage.getItem(saveKey)) {
	let needToSave = typeof savedJSON == "string";
	if (needToSave) {
		savedJSON = JSON.parse(savedJSON);
	}
	for (let dateKey in savedJSON) {
		let theDateObjArray = savedJSON[dateKey];
		let theIndex = theDateObjArray.findIndex((o) => o.schID == schID);
		if (theIndex >= 0) {
			theDateObjArray.splice(theIndex, 1); //remove dateObj from array;
			if (theDateObjArray.length == 0) {
				delete savedJSON[dateKey];
			}
			break;
		}
	}
	if (needToSave) {
		localStorage.setItem(saveKey, JSON.stringify(savedJSON));
	}
}
