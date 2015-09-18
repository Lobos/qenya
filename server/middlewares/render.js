'use strict'

module.exports = function *(next) {
  this.Render = {
    success: (data, msg) => {
      this.body = {
        status: 1,
        data: data
      }
      if (msg) {
        this.body.msg = msg
      }
    },

    fail: (err) => {
      this.body = {
        status: 0,
        msg: err
      }
    },

    notFound: () => {
      this.body = {
        status: 0,
        msg: this.i18n.__('http.not_found')
      }
    },

    noAuth: () => {
      this.body = {
        status: 0,
        msg: this.i18n.__('http.no_auth')
      }
      this.response.status = 401
    },

    expired: () => {
      this.body = {
        status: 0,
        msg: this.i18n.__('login.expired')
      }
      this.response.status = 401
    }
  }

  yield next
}
