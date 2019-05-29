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
  Print: val => new Token("Print", `console.log(${val})`),
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

          return Tokens.Print(ch);
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
  eval(str);
};

const code1 =
  "lassie AWOO 5\nluna AWOO 6\nbailey AWOO lassie WOOF luna\nbailey";
const code2 =
  "roi AWOO 5\nRUF? roi YAP 2 VUH\n\troi AWOO roi ARF 3\nROWH\n\troi AWOO roi WOOF 100\nARRUF\nroi";
const code3 =
  "roi AWOO 5\nRUF? roi YIP 2 VUH\n\troi AWOO roi ARF 3\nROWH\n\troi AWOO roi WOOF 100\nARRUF\nroi";
const code4 =
  "quark AWOO 6 BARK 2\ngromit AWOO 5\nmilo AWOO 0\nGRRR milo YIP gromit BOW\n\tquark AWOO quark WOOF 3\n\tmilo AWOO milo WOOF 1\nBORF\nquark";

const problem =
  "samantha AWOO 1\nhooch AWOO 500\neinstein AWOO 10\nfuji AWOO 0\nGRRR fuji YIP hooch BOW\n\tsamantha AWOO samantha WOOF 3\n\tRUF? samantha YAP 100 VUH\n\t\tsamantha AWOO samantha BARK 1\n\tROWH\n\t\teinstein AWOO einstein WOOF 1\n\t\tsamantha AWOO samantha ARF einstein\n\tARRUF\n\t\tfuji AWOO fuji WOOF 1\nBORF\nGRRR fuji YAP 0 BOW\n\tsamantha AWOO samantha WOOF 375\n\tfuji AWOO fuji BARK 3\nBORF\nsamantha";

// console.log(code1);
// transpile(parse(lex2(code1)));

// console.log(code2);
// transpile(parse(lex2(code2)));

// console.log(code3);
// transpile(parse(lex2(code3)));

// console.log(code4);
// transpile(parse(lex2(code4)));

// console.log(problem);
transpile(parse(lexer(problem)));
