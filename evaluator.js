function evaluate(ast, doggo) {
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

    const isTrue = evaluate(tokensUntilThen, doggo);
    if (isTrue) {
      // Interpret the first block of if-else
      evaluate(tokensInIfBlock, doggo);
      pos += totalSizeOfIfBlock;
    } else {
      // Interpret the second block of if-else
      evaluate(tokensInElseBlock, doggo);
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

    while (evaluate(tokensUntilThen, doggo)) {
      evaluate(tokensInWhileBlock, doggo);
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
}

module.exports = evaluate;
