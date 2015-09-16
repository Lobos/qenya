'use strict'

const User = require('../schema/user')
const redis = require('../utils/redis')

// get user's token, userinfo
module.exports = function (path) {
  return function *(next) {
    let token = this.header.authorization || '123456'
    if (!token) {
      return this.Render.noAuth()
    }

    // get user info
    let user = yield redis.get(token)
    if (!user) {
      user = yield this.collection(User.name).findOne({ token: token })
      if (user) {
        redis.set(token, user)
      }
    }

    console.log(user, typeof user, path)

    yield next
  }
}
