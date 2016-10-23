const bundler = require('./frontend/bundler')

bundler.listen(5001, 'localhost', function (err, result) {
  if (err) {
    return console.log(err)
  }
})

