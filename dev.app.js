const bundler = require('./frontend/bundler')

bundler.listen(5002, 'localhost', (err) => {
  if (err) {
    return console.log(err)
  }
})

