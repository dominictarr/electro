
function isObject (o) {
  return o && 'object' == typeof o
}

function flatten (opts) {
  var contexts = []
  contexts.push(opts)
  var i = 0
  while(i < opts._.length)
    if(isObject(opts._[i])) {
      contexts.push(opts._[i])
      opts._.splice(i, 1)
    }
    else
      i++

  return contexts
}

var subarg = require('subarg')

module.exports = function (args) {
  return flatten(subarg(args))
}

if(!module.parent) {
  var opts = module.exports(process.argv.slice(2))
  console.log(JSON.stringify(opts, null, 2))
}
