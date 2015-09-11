'use strict'

const koa = require('koa')
const koaBody = require('koa-body')
const config = require('./config')
const router = require('./router')
const mongo = require('./middlewares/mongo')
const auth = require('./middlewares/auth')
const i18n = require('./middlewares/i18n')
const render = require('./middlewares/render')

let app = koa()

// logger
app.use(function *(next){
  var start = new Date
  yield next
  var ms = new Date - start
  console.log('%s %s - %s', this.method, this.url, ms)
})

app.use(i18n(config.I18N))

// mongo
app.use(mongo(config.MONGO))

app.use(koaBody(config.KOABODY))
// authorization
app.use(auth)

app.use(render)

// routers
router(app)

app.listen(5000)
