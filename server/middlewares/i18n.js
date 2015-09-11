'use strict'

const I18n = require('i18n-2')

module.exports = function (opts) {
  let i18n = new I18n(opts)

  return function *(next) {
    this.i18n = i18n
    yield next
  }
}
