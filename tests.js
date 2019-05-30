// Runs simple tests to ensure that the interpreter returns the expected
// values from the doggolang files

const assert = require("assert").strict;
const fs = require("fs");
const interpret = require("./interpreter.js");

const hint1 = fs.readFileSync("hint1.dog", "utf8");
const result1 = interpret(hint1);
assert(result1 == 11, `Hint #1 result should be 11, was ${result1}`);

const hint2 = fs.readFileSync("hint2.dog", "utf8");
const result2 = interpret(hint2);
assert(result2 == 15, `Hint #2 result should be 15, was ${result2}`);

const hint3 = fs.readFileSync("hint3.dog", "utf8");
const result3 = interpret(hint3);
assert(result3 == 105, `Hint #3 result should be 105, was ${result3}`);

const hint4 = fs.readFileSync("hint4.dog", "utf8");
const result4 = interpret(hint4);
assert(result4 == 19, `Hint #4 result should be 19, was ${result4}`);

const task = fs.readFileSync("task.dog", "utf8");
const resultTask = interpret(task);
assert(resultTask == 64185, `Task result should be 64185, was ${resultTask}`);

console.log("All tests ok!");
