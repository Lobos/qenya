'use strict'

const User = require('../schema/user')
const redis = require('../utils/redis')
const userUtils = require('../utils/user')

// get user's token, userinfo
module.exports = function (path) {
  return function *(next) {
    let token = this.header.authorization
    if (!token) {
      return this.Render.noAuth()
    }

    // get user info
    let user = yield redis.get(token)
    if (!user) {
      user = yield this.collection(User.name).findOne({ token: token })
      if (user) {
        user.all_accesses = yield userUtils.getAllAccesses(user, this)
        redis.set(token, user)
      }
    }

    if (!user) {
      return this.Render.expired()
    }

    if (user.all_accesses.indexOf(`${this.request.method}#${path}`) <= 0) {
      return this.Render.noAuth()
    }

    yield next
  }
}
