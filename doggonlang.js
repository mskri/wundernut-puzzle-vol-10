const lexer = require("./lexer.js");
const parse = require("./parser.js");
const evaluate = require("./evaluator.js");

// --doggo is defined as parameter when the interpreter is run display
// doggolang environment variables
let doggoDebug = process.argv.includes("--doggo");
const logDoggo = value => {
  if (doggoDebug) {
    console.log("Doggolang environment variables");
    console.table(value);
  }
};

let doggo = {};

const interpret = code => {
  const tokens = lexer(code);
  const ast = parse(tokens);
  const result = evaluate(ast, doggo);

  logDoggo(doggo);
  return result;
};

module.exports = {
  interpret
};

(function() {
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
})();
