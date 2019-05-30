function lexer(input) {
  // Defines allowed doggolang syntax as list of allowed regex
  const allowedInput = [
    /\n\r/, // Newlines
    /ARF/, // Multiply
    /ARRUF/, // IfEnd
    /AWOO/, // Assign
    /BARK/, // Minus
    /BORF/, // WhileEnd
    /BOW/, // WhileThen
    /GRRR/, // WhileStart
    /ROWH/, // IfElse
    /RUF\?/, // IFStart
    /VUH/, // IfThen
    /WOOF/, // Sum
    /YAP/, // GreaterThan
    /YIP/, // LesserThan
    /[0-9]+/, // Digits
    /[A-ZÄÅÖa-zäåö][A-ZÄÅÖa-zäåö0-9_]/ // Characters
  ];

  function validateAgainstSpec(expression) {
    const foundInSpec = allowedInput.findIndex(exp => expression.match(exp));

    if (!foundInSpec) {
      throw Error(`Illegal character: ${expression}`);
    }

    return true;
  }

  // Splits input into list of tokens. Removes any tabs, newlines etc. Input is
  // split by whitespace and empty strings are filtered out. Finally tokens are
  // validated to be valid doggolang syntax
  function tokenize() {
    return input
      .replace(/\t/g, "")
      .split(/\s+/)
      .map(str => str.trim())
      .filter(str => str.length)
      .filter(str => validateAgainstSpec(str));
  }

  return tokenize();
}

module.exports = lexer;
