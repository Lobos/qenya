'use strict'

const Schema = require('./index')

module.exports = new Schema({
  method: { type: 'string', length: 10, defaultValue: 'GET' },
  path: { type: 'string', length: 500, required: true },
  title: { type: 'string', length: 50, required: true }
})
