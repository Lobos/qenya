'use strict'

class Schema {
  constructor (props) {
    this.props = props || {}
  }

  // 检查数据
  check (data, i18n) {
    if (!data || typeof data !== 'object') {
      return i18n.__('schema.body_error')
    }

    let keys = Object.keys(this.props),
        k

    for (k of Object.keys(data)) {
      if (keys.indexOf(k) < 0) {
        return i18n.__('schema.key_illegal', k)
      }
    }

    for (k of keys) {
      let prop = this.props[k],
          val = data[k]

      if (prop.required && (val === undefined || val === null || val === '')) {
        return i18n.__('schema.required', k)
      }

      if (prop.type && val && typeof val !== prop.type) {
        return i18n.__('schema.type_error', k)
      }

      if (prop.length && (val.length && val.length > prop.length)) {
        return i18n.__('schema.over_length', k)
      }
    }

    return null
  }

  // 过滤掉非法数据，空数据添加默认值
  sift (data) {
    console.log(data)
  }
}

module.exports = Schema
