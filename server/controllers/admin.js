'use strict'

const md5 = require('md5')
const User = require('../schema/user')
const userUtils = require('../utils/user')
const redis = require('../utils/redis').getClient()

exports.login = function *() {
  let email = this.request.body.email,
      password = md5(this.request.body.password)
  let user = yield this.collection(User.name).findOne({ email: email, password: password })
  if (!user) {
    return this.Render.fail(this.i18n.__('login.input_error'))
  }

  if (user.token) {
    redis.del(user.token)
  }

  user.token = userUtils.createToken()
  yield this.collection(User.name).update({ _id: user._id }, user)

  user.all_accesses = yield userUtils.getAllAccesses(user, this)
  redis.set(user.token, user, 'EX', 3600)

  this.Render.success({
    _id: user._id,
    nickname: user.nickname,
    token: user.token,
    email: user.email
  })
}

exports.info = function *() {
  let user = this.admin
  this.Render.success({
    _id: user._id,
    nickname: user.nickname,
    token: user.token,
    email: user.email
  })
}
