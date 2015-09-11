'use strict'

module.exports = function *(next) {
  this.Render = {
    success: (data, msg) => {
      this.body = {
        status: 1,
        msg: msg || null,
        data: data
      }
    },

    fail: (err) => {
      this.body = {
        status: 0,
        msg: err
      }
    }
  }

  yield next
}
