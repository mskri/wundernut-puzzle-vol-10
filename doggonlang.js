const lexer = require("./lexer.js");
const parser = require("./parser.js");

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

const evaluate = ast => {
  let pos = 0;
  let outputValue = null;

  const getCurrentToken = () => ast[pos];
  const getNextToken = () => ast[pos + 1];
  const getPrevToken = () => ast[pos - 1];
  const getTokenAt = p => ast[p];

  const isDigit = str => Number.isInteger(parseInt(str));
  const isAssignToken = token => token.type == "Assign";
  const isIntegerToken = token => token.type == "Integer";
  const isVariableToken = token => token.type == "Variable";

  const getValue = token => {
    if (isDigit(token)) return parseInt(token);
    if (doggo.hasOwnProperty(token)) return doggo[token];
    throw Error(`Variable "${token}" not defined`);
  };

  const setVariable = (name, value) =>
    (doggo[name] = parseInt(value) || getValue(value));

  const findPreviousVariableName = () => {
    let loopPos = pos;

    while (loopPos > 0) {
      // Get previous token in the stream
      const token = getTokenAt(--loopPos);

      if (isAssignToken(token)) {
        // Variable name is the value of the token preceeding the assign token
        const variableToken = getTokenAt(--loopPos);

        // TODO: needed?
        if (!isVariableToken(variableToken)) {
          throw Error('Invalid syntax! Token before AWOO should be "Variable"');
        }

        return variableToken.value;
      }
    }
  };

  const findNextTokenValue = () => {
    const token = getNextToken();

    if (isIntegerToken(token)) return parseInt(token.value);
    if (isVariableToken(token)) return doggo[token.value];

    throw Error("Illegal syntax!");
  };

  const findTokensUntil = type => {
    let loopPos = pos;
    let foundTokens = [];

    // Loops forward trough the tokens in the stream until a matching token is
    // found. Returns the tokens from the positon the lookup started to matching
    // token
    while (loopPos < ast.length) {
      const token = getTokenAt(++loopPos);

      if (token.type == type) {
        return foundTokens;
      }

      foundTokens.push(token);
    }

    throw Error(`Illegal syntax! "${type}" should be used`);
  };

  const doAssign = () => {
    const prev = getPrevToken();
    const next = getNextToken();

    setVariable(prev.value, next.value);
  };

  const doSum = () => {
    const varName = findPreviousVariableName();
    const previousValue = getValue(varName);
    const nextValue = findNextTokenValue();

    setVariable(varName, previousValue + nextValue);
  };

  const doMinus = () => {
    const varName = findPreviousVariableName();
    const previousValue = getValue(varName);
    const nextValue = findNextTokenValue();

    setVariable(varName, previousValue - nextValue);
  };

  const doMultiply = () => {
    const varName = findPreviousVariableName();
    const previousValue = getValue(varName);
    const nextValue = findNextTokenValue();

    setVariable(varName, previousValue * nextValue);
  };

  const doGreaterThan = () => {
    const prev = getPrevToken();
    const next = getNextToken();
    const prevValue = getValue(prev.value);
    const nextValue = getValue(next.value);

    outputValue = prevValue > nextValue;
  };

  const doLesserThan = () => {
    const prev = getPrevToken();
    const next = getNextToken();
    const prevValue = getValue(prev.value);
    const nextValue = getValue(next.value);

    outputValue = prevValue < nextValue;
  };

  const doIfStart = () => {
    const tokensUntilThen = findTokensUntil("IfThen");
    const tokensUntilElse = findTokensUntil("IfElse");
    const tokensUntilEnd = findTokensUntil("IfEnd");
    const totalSizeOfIfBlock = tokensUntilEnd.length;

    const tokensInIfBlock = tokensUntilElse.splice(
      tokensUntilThen.length + 1,
      tokensUntilElse.length
    );

    const tokensInElseBlock = tokensUntilEnd.splice(
      tokensUntilThen.length + tokensUntilElse.length + 3, //3 from the skipped if, then, else
      tokensUntilEnd.length
    );

    const isTrue = evaluate(tokensUntilThen);
    if (isTrue) {
      // Interpret the first block of if-else
      evaluate(tokensInIfBlock);
      pos += totalSizeOfIfBlock;
    } else {
      // Interpret the second block of if-else
      evaluate(tokensInElseBlock);
      pos += totalSizeOfIfBlock;
    }
  };

  const doWhileStart = () => {
    const tokensUntilThen = findTokensUntil("WhileThen");
    const tokensUntilEnd = findTokensUntil("WhileEnd");
    const totalSizeOfIfBlock = tokensUntilEnd.length;

    const tokensInWhileBlock = tokensUntilEnd.splice(
      tokensUntilThen.length + 1,
      tokensUntilEnd.length
    );

    while (evaluate(tokensUntilThen)) {
      evaluate(tokensInWhileBlock);
    }

    pos += totalSizeOfIfBlock;
  };

  const doReturn = () => {
    const value = getValue(token.value);
    outputValue = value;
  };

  while ((token = getCurrentToken())) {
    switch (token.type) {
      case "Assign":
        doAssign();
        break;
      case "Sum":
        doSum();
        break;
      case "Minus":
        doMinus();
        break;
      case "Multiply":
        doMultiply();
        break;
      case "IfStart":
        doIfStart();
        break;
      case "Return":
        doReturn();
        break;
      case "GreaterThan":
        doGreaterThan();
        break;
      case "LesserThan":
        doLesserThan();
        break;
      case "WhileStart":
        doWhileStart();
        break;
    }

    pos++;
  }

  return outputValue;
};

const interpret = code => {
  const tokens = lexer(code);
  const ast = parser(tokens);
  const result = evaluate(ast);

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
