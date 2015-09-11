'use strict'

const koa = require('koa')
const koaBody = require('koa-body')
const config = require('./config')
const router = require('./router')
const mongo = require('./middlewares/mongo')
const auth = require('./middlewares/auth')

let app = koa()

// logger
app.use(function *(next){
  var start = new Date
  yield next
  var ms = new Date - start
  console.log('%s %s - %s', this.method, this.url, ms)
})

// mongo
app.use(mongo(config.MONGO))

app.use(koaBody(config.KOABODY))
// authorization
app.use(auth)

// routers
router(app)

app.listen(5000)
