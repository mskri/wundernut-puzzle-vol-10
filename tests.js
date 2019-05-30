// Runs simple tests to ensure that the interpreter returns the expected
// values from the doggolang files

const assert = require("assert").strict;
const fs = require("fs");
const doggo = require("./doggonlang.js");

const hint1 = fs.readFileSync("hint1.dog", "utf8");
assert(doggo.interpret(hint1) == 11, "Hint #1 result should be 11");

const hint2 = fs.readFileSync("hint2.dog", "utf8");
assert(doggo.interpret(hint2) == 15, "Hint #2 result should be 15");

const hint3 = fs.readFileSync("hint3.dog", "utf8");
assert(doggo.interpret(hint3) == 105, "Hint #3 result should be 105");

const hint4 = fs.readFileSync("hint4.dog", "utf8");
assert(doggo.interpret(hint4) == 19, "Hint #4 result should be 19");

const task = fs.readFileSync("task.dog", "utf8");
assert(doggo.interpret(task) == 64185, "Task result should be 64185");

console.log("All tests ok!");
