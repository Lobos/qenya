'use strict'

exports.success = function (data, msg) {
  return {
    status: 1,
    msg: msg || null,
    data: data
  }
}

exports.fail = function (err) {
  return {
    status: 0,
    msg: err
  }
}
