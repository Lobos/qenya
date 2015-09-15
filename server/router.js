'use strict'

const _ = require('koa-route')
const staticServe = require('koa-static')
const roleController = require('./controllers/role')
const userController = require('./controllers/user')
const accessController = require('./controllers/access')

module.exports = function (app) {
  app.use(staticServe(__dirname.replace(/server$/, '') + 'static'))

  app.use(_.get('/roles/', roleController.list))
  app.use(_.get('/role/:id', roleController.findOne))
  app.use(_.post('/role/', roleController.insert))
  app.use(_.put('/role/:id', roleController.update))
  app.use(_.del('/role/:id', roleController.remove))

  app.use(_.get('/users/', userController.page))
  app.use(_.get('/user/:id', userController.findOne))
  app.use(_.post('/user/', userController.insert))

  app.use(_.get('/accesses/', accessController.list))
  app.use(_.post('/access/', accessController.insert))
  app.use(_.put('/access/:id', accessController.update))
  app.use(_.del('/access/:id', accessController.remove))
  
}
