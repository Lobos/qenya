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
        redis.set(token, user, 'EX', 3600)
      }
    }

    if (!user) {
      return this.Render.expired()
    }

    if (path && user.all_accesses.indexOf(`${this.request.method}#${path}`) <= 0) {
      return this.Render.noAuth()
    }

    this.admin = user
    yield next
  }
}
