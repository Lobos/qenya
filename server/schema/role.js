'use strict'

const Schema = require('./index')
const Access = require('./access')

module.exports = new Schema({
  name: { type: 'string', required: true },
  accesses: { type: [Access], defaultValue: [] }
})
