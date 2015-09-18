'use strict'

const router = require('koa-router')()
const roleController = require('./controllers/role')
const userController = require('./controllers/user')
const accessController = require('./controllers/access')
const auth = require('./middlewares/auth')

module.exports = router

router.get('/roles', auth('/roles'), roleController.list)
router.get('/role/:id', roleController.findOne)
router.post('/role', roleController.insert)
router.put('/role/:id', roleController.update)
router.del('/role/:id', roleController.remove)

router.post('/user/login', userController.login)
router.get('/users', userController.page)
router.get('/user/:id', userController.findOne)
router.post('/user', userController.insert)
router.put('/user/:id', userController.update)

router.get('/accesses', accessController.list)
router.post('/access', accessController.insert)
router.put('/access/:id', accessController.update)
router.del('/access/:id', accessController.remove)
