#! /usr/bin/env electron
var path = require('path')

var argv = [], _argv = []

process.argv.slice(2).forEach(function (s) {
  if(s[0] !== '-' || argv.length)
    argv.push(s)
  else
    _argv.push(s)
})

var opts = require('minimist')(_argv)

argv.unshift('electro')
argv.unshift('') //magically make it work

if(!argv[2]) {
  argv[2] = path.join(__dirname, 'examples', 'repl.js')
  opts.dev = true
}


console.log(argv)

var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  app.quit();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.

process.removeAllListeners('uncaughtException')
process.removeAllListeners('exit')

process.stdin.pause()

var qs = require('querystring')

app.on('ready', function next () {
  // Create the browser window.
  var mainWindow = new BrowserWindow(opts);

  var proc = { argv: argv }
  proc.stdin = process.stdin.isTTY
  proc.stderr = process.stderr.isTTY
  proc.stdout = process.stdout.isTTY

  // and load the index.html of the app.
  console.log('file://' + path.join(__dirname, 'index.html') + '?' + qs.stringify(proc))
  mainWindow.loadUrl('file://' + path.join(__dirname, 'index.html') + '?' + qs.stringify(proc));

  mainWindow.webContents.on('dom-ready', function () {
    process.stdin
      .on('data', function (data) {
        mainWindow.send('process.stdin', data.toString('base64'))
      })
      .on('end', function () {
        mainWindow.send('process.stdin', null)
      })
      .resume()

    var ipc = require('ipc')

    ipc.on('process.stdout', function (s, data) {
      process.stdout.write(new Buffer(arg, 'base64'))
    })

    ipc.on('process.stderr', function (s, data) {
      process.stderr.write(new Buffer(arg, 'base64'))
    })

  })

  // Open the devtools.
  if(opts.dev)
    mainWindow.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
})
