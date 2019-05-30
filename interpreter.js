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

function interpret(code) {
  const tokens = lexer(code);
  const ast = parse(tokens);
  const result = evaluate(ast, doggo);

  logDoggo(doggo);
  return result;
}

module.exports = interpret;
