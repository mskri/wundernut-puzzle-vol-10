const interpret = require("./interpreter.js");

const isDogFile = filename => filename.slice(-4) === ".dog";

if (!module.parent) {
  const fs = require("fs");
  const filename = process.argv[2];

  if (!isDogFile(filename)) {
    console.log("Doggolang interpreter only supports .dog files");
    return;
  }

  fs.readFile(filename, "utf8", (err, data) => {
    if (err) throw err;
    const result = interpret(data);
    console.log(result);
  });
}
