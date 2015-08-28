# electro

electron and unix make friends

# synopsis

This is a simple wrapper around electron that kills boilerplate and allows stdio to work correct.
Making electron a better unix citizen!

## Example: cat

write stdin or the first file to the dom...

``` js
var path = require('path')
var pre = document.createElement('pre')
document.body.appendChild(pre)

;( process.stdin.isTTY
  ? require('fs').createReadStream(path.resolve(process.argv[2]))
  : process.stdin
)
.on('data', function (data) {
  pre.innerText += data.toString()
})
.resume()
```

you'll find this file in `./examples/cat.js`

then run it with `electro`

```
# read the first file
electro ./examples/cat.js README.md

# OR, use pipes!

electro ./examples/cat.js < README.md

```

## Usage

make sure electron is installed first!

`npm install electron-prebuilt -g`

```
electro [electro options] filename {options}
```
options work the same as in node.js.
any options passed before `filename` are options for
[chrome](http://electron.atom.io/docs/v0.31.0/api/chrome-command-line-switches/) or electron.
any [BrowserWindow](http://electron.atom.io/docs/v0.31.0/api/browser-window/#new-browserwindow-options) option can be set this way.

If no arguments are provided, electro will open a repl (aka, a browser window with devtools)


## License

MIT
