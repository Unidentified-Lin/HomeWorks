function fullCharCode(v) {
  if (typeof v === "string") {
    if (v.length == 0) {
      console.log("Empty String...");
      return;
    }
    let vs = [];
    for (let i = 0; i < v.length; i++) {
      vs[i] = getCharCode(v[i]);
    }
    console.log(vs);
  } else {
    console.log("Error input...");
  }
}
function getCharCode(element) {
  for (let i = 33; i < 65536; i++) {
    if (element === String.fromCharCode(i)) {
      return i;
    }
  }
}
fullCharCode(111);
fullCharCode("");
fullCharCode("123");
