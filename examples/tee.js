

process.stdin.pipe(process.stdout)
process.stdin.on('data', function (data) {
  c = document.createElement('code')
  c.textContent = data.toString()
  document.body.appendChild(c)
})
