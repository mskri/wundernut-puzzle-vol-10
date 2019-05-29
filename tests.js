// Runs simple tests to ensure that the interpreter returns the expected
// values from the doggolang files

const assert = require("assert").strict;
const fs = require("fs");
const interpreter = require("./doggonlang-parser.js");

const hint1 = fs.readFileSync("hint1.dog", "utf8");
const hint1result = interpreter.interpret(hint1);
assert(hint1result == 11, "Hint #1 result should be 11");

const hint2 = fs.readFileSync("hint2.dog", "utf8");
const hint2result = interpreter.interpret(hint2);
assert(hint2result == 15, "Hint #2 result should be 15");

const hint3 = fs.readFileSync("hint3.dog", "utf8");
const hint3result = interpreter.interpret(hint3);
assert(hint3result == 105, "Hint #3 result should be 105");

const hint4 = fs.readFileSync("hint4.dog", "utf8");
const hint4result = interpreter.interpret(hint4);
assert(hint4result == 19, "Hint #4 result should be 19");

console.log("All tests ok!");
