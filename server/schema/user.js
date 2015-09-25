'use strict'

const Schema = require('./index')
const Access = require('./access')
const Role = require('./role')

module.exports = new Schema('users', {
  email: { type: 'email', length: 500, required: true, once: true },
  nickname: { alias: '昵称', type: 'string', length: 20, required: true },
  password: { alias: '密码', type: 'password', required: true, ignore: true },
  roles: { alias: '角色', type: [Role], defaultValue: [] },
  accesses: { alias: '权限列表', type: [Access], defaultValue: [] }
})
