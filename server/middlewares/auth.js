'use strict'

const User = require('../schema/user')

// get user's token, userinfo
module.exports = function (path) {
  return function *(next) {
    let token = this.header.authorization || '123456'
    if (!token) {
      return this.Render.noAuth()
    }

    // get user info
    let user = yield this.redis.get(token)
    if (!user) {
      user = yield this.collection(User.name).findOne({ token: token })
    }

    console.log(user, path)

    yield next
  }
}
