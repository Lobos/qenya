'use strict'

const fs = require('fs')
const Datetime = require('./datetime')
const consolePrint = require('../config').DEBUG
const slice = Array.prototype.slice

if (!fs.existsSync("./log")) {
  fs.mkdirSync("./log")
}

function wirteLog(logType, args) {
  const filePrint = logType !== 'debug'

  if (!filePrint && !consolePrint) {
    return
  }

  const date = new Date()

  args = slice.call(args)
  args.unshift(Datetime.format(date, 'yyyy-MM-dd hh:mm:ss'))
  let str = args.join(' ')

  if (filePrint) {
    fs.appendFile('./log/' + logType + '-' + Datetime.format(date, 'yyyyMMdd') + '.log', str + "\n")
  }

  if (consolePrint) {
    console.log(str)
  }
}

exports.info = function () {
  wirteLog('info', arguments)
}

exports.debug = function () {
  wirteLog('debug', arguments)
}

exports.warn = function () {
  wirteLog('warn', arguments)
}

exports.error = function () {
  wirteLog('error', arguments)
}
