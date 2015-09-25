'use strict'

const logger = require('../utils/logger')

module.exports = function *(next){
  const start = new Date
  yield next
  const ms = new Date - start,
        str = `${this.method} ${this.url} - ${ms}`
  if (ms > 1000) {
    logger.warn(str)
  } else {
    logger.info(str)
  }
}
