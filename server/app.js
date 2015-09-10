'use strict'

const koa = require('koa')
const mongo = require('koa-mongo')
const ObjectId = require('mongodb').ObjectId
const app = koa()

// mongodb
app.use(mongo({
  host: 'localhost',
  port: 27017,
  db: 'test',
  max: 100,
  min: 1,
  timeout: 30000,
  log: false
}))

// logger
app.use(function *(next){
  var start = new Date
  yield next
  var ms = new Date - start
  console.log('%s %s - %s', this.method, this.url, ms)
})

// response

app.use(function *(){
  let coll = this.mongo.db('test').collection('users')
  let users = yield coll.findOne({ _id: ObjectId('55f141b4fd67d394511701db') })
  this.body = users
})

app.listen(5000)
