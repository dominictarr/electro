
var path = require('path')
var pre = document.createElement('pre')
document.body.appendChild(pre)

;( process.stdin.isTTY
  ? require('fs').createReadStream(path.resolve(process.argv[2]))
  : process.stdin
)
.on('data', function (data) {
  console.log("DATA?", data.toString())
  pre.innerText += data.toString()
})
.resume()
