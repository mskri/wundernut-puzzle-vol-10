const doggolangSpec = [
  [/\n\t/, "None"],
  [/ARF/, "Multiply"],
  [/ARRUF/, "IfEnd"],
  [/AWOO/, "Assign"],
  [/BARK/, "Minus"],
  [/BORF/, "WhileEnd"],
  [/BOW/, "WhileThen"],
  [/GRRR/, "WhileStart"],
  [/ROWH/, "IfElse"],
  [/RUF\?/, "IfStart"],
  [/VUH/, "IfThen"],
  [/WOOF/, "Plus"],
  [/YAP/, "GreaterThan"],
  [/YIP/, "LesserThan"],
  [/[0-9]+/, "Integer"],
  [/[A-ZÄÅÖa-zäåö][A-ZÄÅÖa-zäåö0-9_]/, "Variable"]
];

let astDebug = process.argv.includes("--ast");
const logAst = ast => {
  if (astDebug) {
    console.log("Abstract syntax tree (AST)");
    console.table(ast);
  }
};

let doggoDebug = process.argv.includes("--doggo");
const logDoggo = value => (doggoDebug ? console.table(value) : null);

/**
 * Splits text into list of tokens
 *
 * Removes any tabs, new lines etc. then splits the input by whitespace/newline
 * and then filters out any empty strings
 */
function lexer(input) {
  const validateAgainsSpec = expression => {
    const foundInSpec =
      doggolangSpec.findIndex(exp => expression.match(exp[0])) > 0;

    if (!foundInSpec) {
      throw Error(`Illegal character: ${expression}`);
    }

    return true;
  };

  return input
    .replace(/\t/g, "")
    .split(/\s+/)
    .map(s => s.trim())
    .filter(s => s.length)
    .filter(s => validateAgainsSpec(s));
}

const Token = (type, value) => ({
  type,
  value
});

const Tokens = {
  Else: () => Token("IfElse", "ROWH"),
  Assign: () => Token("Assign", "AWOO"),
  GreaterThan: () => Token("GreaterThan", "YAP"),
  IfStart: () => Token("IfStart", "RUF?"),
  IfEnd: () => Token("IfEnd", "ARRUF"),
  IfThen: () => Token("IfThen", "VUH"),
  Illegal: () => Token("Illegal", null),
  Integer: value => Token("Integer", value),
  LesserThan: () => Token("LesserThan", "YIP"),
  Minus: () => Token("Minus", "BARK"),
  Multiply: () => Token("Multiply", "ARF"),
  Sum: () => Token("Sum", "WOOF"),
  Return: value => Token("Return", value),
  Variable: value => Token("Variable", value),
  WhileStart: () => Token("WhileStart", "GRRR"),
  WhileThen: () => Token("WhileThen", "BOW"),
  WhileEnd: () => Token("WhileEnd", "BORF")
};

const isDigit = str => Number.isInteger(parseInt(str));

const parse = tokens => {
  let pos = 0;

  const getCurrentToken = () => tokens[pos];
  const getNextToken = () => tokens[pos + 1];
  const isEof = () => getNextToken() == null;
  const isString = str =>
    Object.prototype.toString.call(str) === "[object String]";

  const lookupToken = token => {
    if (isDigit(token)) return Tokens.Integer(parseInt(token));

    switch (token) {
      case "ARF":
        return Tokens.Multiply();
      case "ARRUF":
        return Tokens.IfEnd();
      case "AWOO":
        return Tokens.Assign();
      case "BARK":
        return Tokens.Minus();
      case "BORF":
        return Tokens.WhileEnd();
      case "BOW":
        return Tokens.WhileThen();
      case "GRRR":
        return Tokens.WhileStart();
      case "ROWH":
        return Tokens.Else();
      case "RUF?":
        return Tokens.IfStart();
      case "VUH":
        return Tokens.IfThen();
      case "WOOF":
        return Tokens.Sum();
      case "YAP":
        return Tokens.GreaterThan();
      case "YIP":
        return Tokens.LesserThan();
      default:
        if (isString(token)) {
          if (isEof()) return Tokens.Return(token);
          return Tokens.Variable(token);
        }

        throw Error("Illegal token!");
    }
  };

  const parseAst = () => {
    let token;
    let ast = [];

    while ((token = getCurrentToken())) {
      const tokenType = lookupToken(token);
      ast.push(tokenType);
      pos++;
    }

    logAst(ast);
    return ast;
  };

  return parseAst();
};

let doggo = {};

const evaluate = ast => {
  let pos = 0;
  let outputValue = null;

  const getCurrentToken = () => ast[pos];
  const getNextToken = () => ast[pos + 1];
  const getPrevToken = () => ast[pos - 1];
  const getTokenAt = p => ast[p];

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
  const result = evaluate(parse(lexer(code)));
  logDoggo(doggo);
  return result;
};

module.exports = {
  interpret
};

(function() {
  if (!module.parent) {
    const fs = require("fs");
    const filename = process.argv[2];

    if (filename.slice(-4) !== ".dog") {
      console.log("Doggolang interpreter supports only files ending in .dog");
      return;
    }

    const data = fs.readFileSync(filename, "utf8");
    const result = interpret(data);
    console.log(result);
  }
})();
