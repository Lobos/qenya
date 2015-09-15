'use strict'

const redis = require("redis")
const coRedis = require("co-redis")

module.exports = function (host, port, options) {
  let client = coRedis(redis.createClient(host, port, options))
  return function *(next) {
    this.redis = client
    yield next
  }
}
