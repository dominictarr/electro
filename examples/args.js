

var p = document.createElement('pre')

document.body.appendChild(p)

p.innerHTML = JSON.stringify(process.argv)
