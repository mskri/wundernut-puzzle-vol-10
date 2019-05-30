// --ast is defined as parameter when the interpreter is run display
// AST stream
let astDebug = process.argv.includes("--ast");
const logAst = ast => {
  if (astDebug) {
    console.log("Abstract syntax tree (AST)");
    console.table(ast);
  }
};

const isDigit = str => Number.isInteger(parseInt(str));

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

function parse(tokens) {
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
}

module.exports = parse;
