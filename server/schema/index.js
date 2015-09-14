'use strict'

// 等待完善的部分：
// - 数据类型增加
// - 引用类型支持
// - 数据类型自动转换

class Schema {
  constructor (name, props) {
    this.name = name
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

      if (val === undefined && prop.defaultValue) {
        data[k] = val = prop.defaultValue
      }

      if (prop.required && (val === undefined || val === null || val === '')) {
        return i18n.__('schema.required', k)
      }

      if (prop.type && val) {
        let passed = true
        switch (prop.type) {
          case 'string':
            passed = typeof val === 'string'
          break
          case 'number':
            passed = typeof val === 'number'
          break
          case 'array':
            passed = Array.isArray(val)
          break
        }
        if (!passed) {
          return i18n.__('schema.type_error', k)
        }
      }

      if (prop.length && val && val.length && val.length > prop.length) {
        return i18n.__('schema.over_length', k)
      }
    }

    return null
  }

  // 过滤掉非法数据
  sift (data) {
    let entity = {}
    if (data._id) {
      entity._id = data._id
    }

    for (let k of Object.keys(this.props)) {
      let prop = this.props[k],
          val = data[k]

      // 忽略只读和空值
      if (prop.once || val === undefined) {
        continue
      }

      if (prop.type && val) {
        let passed = true
        switch (prop.type) {
          case 'string':
            passed = typeof val === 'string'
          break
          case 'number':
            passed = typeof val === 'number'
          break
          case 'array':
            passed = Array.isArray(val)
          break
        }

        // 忽略不正确的值
        if (!passed) {
          continue
        }
      }

      if (prop.length && (val.length && val.length > prop.length)) {
        if (typeof val === 'string') {
          val = val.substring(0, prop.length)
        }
      }

      entity[k] = val
    }
    return entity
  }
}

module.exports = Schema
