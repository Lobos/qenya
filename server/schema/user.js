'use strict'

const Schema = require('./index')
const Access = require('./access')
const Role = require('./role')

module.exports = new Schema('users', {
  accesses: { type: [Access], defaultValue: [] },
  email: { type: 'email', length: 500, required: true, once: true },
  nickname: { type: 'string', length: 20, required: true },
  password: { type: 'password', required: true, ignore: true },
  roles: { type: [Role], defaultValue: [] }
})
