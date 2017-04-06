const bundler = require('./frontend/bundler')

bundler.listen(5002, 'localhost', function (err, result) {
  if (err) {
    return console.log(err)
  }
})

