'use strict'

//const route = require('koa-route')
const staticServe = require('koa-static')

module.exports = function (app) {
  app.use(staticServe('../static'))
}
