'use strict'

const debug = require("debug")("utils/redis")
const redis = require("redis")
const coRedis = require("co-redis")
const config = require("../config").REDIS
let client

function getClient() {
  if (!client) {
    client = coRedis(
      redis.createClient(config.host, config.port, config.options)
    )
  }
  return client
}

function set() {
  getClient()
  let args = Array.prototype.slice.call(arguments)
  let val = {
    setAt: Date.now(),
    result: args[1]
  }
  args[1] = JSON.stringify(val)
  client.set.apply(client, args)
}

function *get(key) {
  var obj = yield getClient().get(key)
  if (obj) {
    try {
      obj = JSON.parse(obj).result
    } catch (e) {
      debug(e.message)
      obj = null
    }
  }
  return obj
}

module.exports = {
  get: get,
  set: set,
  getClient: getClient
}
