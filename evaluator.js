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

  // Loops backwards trough the tokens stream until a Variable type token is
  // found and then returns the name of that variable
  const findPreviousVariableName = () => {
    let loopPos = pos;

    while (loopPos > 0) {
      // Get previous token in the stream
      const token = getTokenAt(--loopPos);

      if (isAssignToken(token)) {
        // Variable name is the value of the token preceeding the assign token
        const variableToken = getTokenAt(--loopPos);

        if (!isVariableToken(variableToken)) {
          throw Error('Invalid syntax! Token before AWOO should be "Variable"');
        }

        return variableToken.value;
      }
    }
  };

  const findNextTokenValue = () => {
    const nextToken = getNextToken();

    if (isIntegerToken(nextToken)) return parseInt(nextToken.value);
    if (isVariableToken(nextToken)) return doggo[nextToken.value];

    throw Error(
      `Illegal syntax! Right side token for operation (ARF/WOOF/BARK) must be either Variable or Integer type, was "${
        nextToken.type
      }"`
    );
  };

  // Loops forward trough the tokens stream until a matching token is
  // found. Returns the tokens from the positon the lookup started to matching
  // token
  const findTokensUntil = tokenType => {
    let loopPos = pos;
    let foundTokens = [];

    while (loopPos < ast.length) {
      const token = getTokenAt(++loopPos);

      if (token == null) break;
      if (token.type == tokenType) {
        return foundTokens;
      }

      foundTokens.push(token);
    }

    throw Error(`Illegal syntax! Missing "${tokenType}"`);
  };

  const processAssign = () => {
    const prev = getPrevToken();
    const next = getNextToken();

    if (!isVariableToken(prev)) {
      throw Error(
        `Illegal syntax! Left side token of AWOO must be Variable type, was "${
          prev.type
        }"`
      );
    }

    setVariable(prev.value, next.value);
  };

  const processSum = () => {
    const varName = findPreviousVariableName();
    const previousValue = getValue(varName);
    const nextValue = findNextTokenValue();

    setVariable(varName, previousValue + nextValue);
  };

  const processMinus = () => {
    const varName = findPreviousVariableName();
    const previousValue = getValue(varName);
    const nextValue = findNextTokenValue();

    setVariable(varName, previousValue - nextValue);
  };

  const processMultiply = () => {
    const varName = findPreviousVariableName();
    const previousValue = getValue(varName);
    const nextValue = findNextTokenValue();

    setVariable(varName, previousValue * nextValue);
  };

  // Sets the value of the greater than check as outputValue. It will be used
  // by the function invoking greater than check
  const processGreaterThan = () => {
    const prevToken = getPrevToken();
    const nextToken = getNextToken();
    const prevValue = getValue(prevToken.value);
    const nextValue = getValue(nextToken.value);

    outputValue = prevValue > nextValue;
  };

  // Sets the value of the lesser than check as outputValue. It will be used
  // by the function invoking lesser than check
  const processLesserThan = () => {
    const prevToken = getPrevToken();
    const nextToken = getNextToken();
    const prevValue = getValue(prevToken.value);
    const nextValue = getValue(nextToken.value);

    outputValue = prevValue < nextValue;
  };

  const processIfStart = () => {
    const tokensUntilThen = findTokensUntil("IfThen");
    const tokensUntilElse = findTokensUntil("IfElse");
    const tokensUntilEnd = findTokensUntil("IfEnd");

    const ifBlockTokens = tokensUntilElse.slice(
      tokensUntilThen.length + 1, // add one to skip the IfThen token
      tokensUntilElse.length
    );

    const elseBlockTokens = tokensUntilEnd.slice(
      tokensUntilElse.length + 1, // add one to skip the IfElse token
      tokensUntilEnd.length
    );

    // Evaluate the greater/lesser than clause, returns true or false
    const evaluateIfBlock = evaluate(tokensUntilThen, doggo);
    if (evaluateIfBlock) {
      // Interpret the if block
      evaluate(ifBlockTokens, doggo);
    } else {
      // Interpret the else block
      evaluate(elseBlockTokens, doggo);
    }

    pos += tokensUntilEnd.length;
  };

  const processWhileStart = () => {
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

  const processReturn = () => {
    const value = getValue(token.value);
    outputValue = value;
  };

  while ((token = getCurrentToken())) {
    switch (token.type) {
      case "Assign":
        processAssign();
        break;
      case "Sum":
        processSum();
        break;
      case "Minus":
        processMinus();
        break;
      case "Multiply":
        processMultiply();
        break;
      case "IfStart":
        processIfStart();
        break;
      case "Return":
        processReturn();
        break;
      case "GreaterThan":
        processGreaterThan();
        break;
      case "LesserThan":
        processLesserThan();
        break;
      case "WhileStart":
        processWhileStart();
        break;
    }

    pos++;
  }

  return outputValue;
}

module.exports = evaluate;
