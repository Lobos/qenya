'use strict'

const koa = require('koa')
const mongo = require('koa-mongo')
const config = require('./config')
const router = require('./router')

let app = koa()

// mongodb
app.use(mongo(config.MONGO))

// logger
app.use(function *(next){
  var start = new Date
  yield next
  var ms = new Date - start
  console.log('%s %s - %s', this.method, this.url, ms)
})

// routers
router(app)

app.listen(5000)
