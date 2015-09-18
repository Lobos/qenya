'use strict'

const _ = require('lodash')
const User = require('../schema/user')
const Role = require('../schema/role')
const Access = require('../schema/access')

exports.getAllAccesses = function *(user, ctx) {
  let ids = user.roles.map(ref => ref.oid)
  let roles = yield ctx.collection(Role.name).find({ _id: { $in: ids } }).toArray()

  ids = user.accesses || []
  roles.forEach(function (role) {
    ids = ids.concat(role.accesses)
  })

  ids = _.uniq(ids, 'oid').map(ref => ref.oid)
  let accesses = yield ctx.collection(Access.name).find({ _id: { $in: ids } }).toArray()

  return accesses.map(a => `${a.method}#${a.path}`)
}

function rand() {
  return Math.random().toString(36).substr(2)
}

exports.createToken = function () {
  return rand() + rand()
}
