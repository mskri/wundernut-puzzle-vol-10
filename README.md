# Entry to Wundernut Puzzle Vol 10.

This is my entry for Wunderdog's
[Wundernut Puzzle Vol 10](https://wunder.dog/pahkina). The puzzle's idea was to
create an interpreter for "Doggolang", an imaginary coding language.

Participants were free to choose any programming language for the implementation
and were given four hints for the structure of the language and a task, a piece
of Doggolang code to run. The solution had to include general interpreter that
could run any Doggolang code.

[Read the full puzzle description.](https://github.com/wunderdogsw/wunderpahkina-vol10)

## Requirements

- Developed and tested on node version 10.16.0

## Usage

Interpret any _.dog_ file containing Doggolang code. Examples of Doggolang can
be found in the `hint*.dog` files under `tests/`.

```bash
node doggonlang.js <dogfile>
```

Display doggo environment by adding `--doggo` parameter

```bash
node doggonlang.js <dogfile> --ast
```

Display generated AST by adding `--ast` parameter

```bash
node doggonlang.js <dogfile> --doggo
```

You can combine both `--doggo` and `--ast` too! _(works with tests as well)_

```bash
node doggonlang.js <dogfile> --doggo --ast
```

Run simple tests

```bash
node tests/tests.js
```

# Study material, tutorials and inspiration

Here's a list of articles and tutorials used to study how interpreters work and
then to create the implementation.

- [How to implement a programming language in JavaScript](http://lisperator.net/pltut/)
- [How to write a simple interpreter in JavaScript](https://www.codeproject.com/Articles/345888/How-to-Write-a-Simple-Interpreter-in-JavaScript)
- [Implementing a Simple Compiler on 25 Lines of JavaScript](https://blog.mgechev.com/2017/09/16/developing-simple-interpreter-transpiler-compiler-tutorial/)
- [Building a JS Interpreter in Rust (series)](https://jason-williams.co.uk/building-a-js-interpreter-in-rust-part-1/)
- [Crafting interpreters](https://craftinginterpreters.com/contents.html)
- [Project: A Programming Language](https://eloquentjavascript.net/12_language.html)

## License

[MIT](https://github.com/saple/wundernut-may-2019/blob/master/README.md)
