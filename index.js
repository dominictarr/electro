#! /usr/bin/env electron
var path = require('path')

var argv = [], _argv = []

var i = process.argv.indexOf('--')

if(~i) {
  argv = process.argv.slice(2, i)
  _argv = process.argv.slice(i + 1)
}
else
  argv = process.argv.slice(2)

var opts = require('minimist')(_argv)

argv.unshift('electro')

var electron = require('electron')
var app = electron.app;  // Module to control application life.
var BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
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
//  opts.preload = path.join(__dirname, 'preload.js')
  var mainWindow = new BrowserWindow(opts);

  var proc = { argv: argv }
  proc.stdin = process.stdin.isTTY
  proc.stderr = process.stderr.isTTY
  proc.stdout = process.stdout.isTTY

  // and load the index.html of the app.

//  require('assert').deepEqual(qs.parse(qs.stringify(proc)), proc)
  console.log(mainWindow)
  mainWindow.loadURL('file://' + path.join(__dirname, 'index.html') + '?' +
    encodeURIComponent(qs.stringify(proc)));

  mainWindow.webContents.on('dom-ready', function () {
    process.stdin
      .on('data', function (data) {
        mainWindow.send('process.stdin', data.toString('base64'))
      })
      .on('end', function () {
        mainWindow.send('process.stdin', null)
      })
      .resume()

    var ipc = electron.ipcMain //require('ipc')
  console.log(electron)
    ipc.on('process.stdout', function (s, data) {
      process.stdout.write(new Buffer(data, 'base64'))
    })

    ipc.on('process.stderr', function (s, data) {
      process.stderr.write(new Buffer(data, 'base64'))
    })

  })

  mainWindow.webContents.on('new-window', function (e, url) {
    // open in the browser
    e.preventDefault()
    shell.openExternal(url)
  })

  // Open the devtools.
  if(opts.dev)
    mainWindow.webContents.openDevTools();
    
  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
})

