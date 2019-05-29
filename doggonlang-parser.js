// Split string by spaces, trim mapped substrings and filter out empty strings
function lexer(str) {
  return str
    .replace(/\n/g, " BR ")
    .replace(/\t/g, "")
    .split(/\s+|\n|\r/)
    .map(s => s.trim())
    .filter(s => s.length);
}

function Token(name, value) {
  this.name = name;
  this.value = value;
}

const Tokens = {
  Else: () => new Token("Else", "} else {"),
  EqualTo: () => new Token("EqualTo", "="),
  GreaterThan: () => new Token("GreaterThan", ">"),
  If: () => new Token("If", "if ("),
  IfEnd: () => new Token("IfEnd", "}"),
  IfThen: () => new Token("IfThen", ") {"),
  Illegal: () => new Token("Illegal", ""),
  Int: val => new Token("Int", val),
  LeftBrace: () => new Token("LeftBrace", ") {"),
  LesserThan: () => new Token("LesserThan", "<"),
  Minus: () => new Token("Minus", "-"),
  Multiply: () => new Token("Multiply", "*"),
  NewLine: () => new Token("NewLine", "\n"),
  Plus: () => new Token("Plus", "+"),
  Return: val => new Token("Return", `return ${val}`),
  Var: val => new Token("Var", val),
  While: () => new Token("While", "while ("),
  WhileEnd: () => new Token("WhileEnd", "}")
};

const parse = tokens => {
  let pos = 0;

  function peek() {
    return tokens[pos];
  }

  function consume() {
    return tokens[pos++];
  }

  function peek_next() {
    return tokens[pos + 1];
  }

  function peek_prev() {
    return tokens[pos - 1];
  }

  const lookup_token = ch => {
    if (parseInt(ch)) {
      return Tokens.Int(ch);
    }

    switch (ch) {
      case "BR":
        return Tokens.NewLine();
      case "AWOO":
        return Tokens.EqualTo();
      case "YAP":
        return Tokens.GreaterThan();
      case "YIP":
        return Tokens.LesserThan();
      case "BARK":
        return Tokens.Minus();
      case "WOOF":
        return Tokens.Plus();
      case "ROWH":
        return Tokens.Else();
      case "RUF?":
        return Tokens.If();
      case "ARRUF":
        return Tokens.IfEnd();
      case "BORF":
        return Tokens.WhileEnd();
      case "VUH":
        return Tokens.IfThen();
      case "BOW":
        return Tokens.LeftBrace();
      case "ARF":
        return Tokens.Multiply();
      case "GRRR":
        return Tokens.While();
      default:
        if (Object.prototype.toString.call(ch) === "[object String]") {
          if (peek_next() != null) {
            return Tokens.Var(ch);
          }

          return Tokens.Return(ch);
        }
        return Tokens.Illegal();
    }
  };

  const parseAst = () => {
    let ast = [];
    let ch;

    while ((ch = peek())) {
      let tok = lookup_token(ch);
      // console.log(ch, "\t", tok);
      ast.push(tok);
      pos++;
    }

    return ast;
  };

  return parseAst();
};

const transpile = ast => {
  let nodes = [];

  ast.forEach(node => {
    nodes.push(node.value);
  });

  const str = nodes.join(" ");
  // console.log(str);
  const result = eval("(function() {" + str + "}())");

  return result || null;
};

const interpret = code => {
  return transpile(parse(lexer(code)));
};

module.exports = {
  interpret
};

(function() {
  if (!module.parent) {
    var fs = require("fs");
    const filename = process.argv[2];

    if (filename.slice(-4) !== ".dog") {
      console.log(
        "ERROR: Doggolang interpreter supports only files ending in .dog"
      );
      return;
    }

    const data = fs.readFileSync(filename, "utf8");
    const result = interpret(data);
    console.log(result);
  }
})();
