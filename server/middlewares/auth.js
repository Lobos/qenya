'use strict'

// get user's token, userinfo
module.exports = function *(next) {
  let authorization = this.header.authorization
  if (authorization) {
    // get user info
  }
  yield next
}
