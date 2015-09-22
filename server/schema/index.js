'use strict'

// 等待完善的部分：
// - 数据类型增加
// - 引用类型支持
// - 数据类型自动转换

const debug = require('debug')('schema')
const mongodb = require('mongodb')
const md5 = require('md5')
const ObjectId = mongodb.ObjectId
const DBRef = mongodb.DBRef

function toDBRef (schema, id) {
  if (!(schema instanceof Schema)) {
    return null
  }

  try {
    return new DBRef(schema.name, ObjectId(id))
  } catch (e) {
    debug(e)
    return null
  }
}

function convertDBRef (schema, val) {
  if (!val || val.length === 0) {
    return val
  }

  let result = { err: null }
  if (Array.isArray(val)) {
    result.val = []
    val.forEach((id) => {
      let r = toDBRef(schema, id)
      if (r) {
        result.val.push(r)
      } else {
        result.err = true
      }
    })
  } else {
    result.val = toDBRef(schema, val)
  }

  return result
}

class Schema {
  constructor (name, props) {
    this.name = name
    this.props = props || {}
  }

  // 数据检查
  // 多余字段、必填字段会返回错误
  // 自动转换数据类型
  // 数据转换失败返回类型错误
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
          ptype = prop.type,
          isArray = false,
          err = null,
          val = data[k]

      if (Array.isArray(ptype)) {
        ptype = ptype[0]
        isArray = true

        // convert array value
        if (typeof val === 'string') {
          val = val.split(prop.sep || ',')
        }
      }

      if (val === undefined && prop.defaultValue !== undefined) {
        val = prop.defaultValue
      }

      if (prop.required && (val === undefined || val === null || val === '')) {
        return i18n.__('schema.required', k)
      }

      if (ptype && val) {
        try {
          if (ptype instanceof Schema) {
            let cvt = convertDBRef(ptype, val)
            val = cvt.val
            if (cvt.err) {
              err = i18n.__('schema.type_error', k)
            }
          } else {
            if (!isArray) {
              val = [val]
            }
            switch (ptype) {
              case 'integer':
              case 'float':
                val = val.map(v => {
                  v = ptype === 'integer' ? parseInt(v) : parseFloat(v)
                  if (isNaN(v)) {
                    err = i18n.__('schema.type_error', k)
                  }
                  return v
                })
              break
              case 'password':
                val = val.map(v => md5(v))
              case 'string':
              default:
                val = val.map(v => {
                  if (typeof v !== 'string') {
                    v = v.toString(v)
                  }
                  return v
                })
              break
            }

            if (!isArray) {
              val = val[0]
            }
          } 

          if (err) {
            return err
          }
        } catch (e) {
          debug(e)
          err = i18n.__('schema.type_error', k)
        }
      }

      if (prop.length && val && val.length && val.length > prop.length) {
        return i18n.__('schema.over_length', k)
      }

      if (val !== undefined) {
        data[k] = val
      }
    }

    return null
  }

  // 过滤非法数据，用于数据更新
  // 多余字段会丢弃
  // 自动转换数据类型
  // 数据类型转换失败会丢弃
  sift (data) {
    let entity = {}
    if (data._id) {
      entity._id = data._id
    }

    for (let k of Object.keys(this.props)) {
      let prop = this.props[k],
          ptype = prop.type,
          isArray = false,
          val = data[k]

      // 忽略只读和空值
      if (prop.once || val === undefined) {
        continue
      }

      if (Array.isArray(ptype)) {
        ptype = ptype[0]
        isArray = true

        // convert array value
        if (typeof val === 'string') {
          val = val.split(prop.sep || ',')
        }
      }

      if (val === undefined && prop.defaultValue) {
        val = prop.defaultValue
      }

      if (ptype && val) {
        if (ptype instanceof Schema) {
          let cvt = convertDBRef(ptype, val)
          val = cvt.val
          if (cvt.err) {
            //err = i18n.__('schema.type_error', k)
          }
        } else {
          if (!isArray) {
            val = [val]
          }

          let newVal = []
          try {
            switch (ptype) {
              case 'integer':
              case 'float':
                val.forEach(v => {
                  v = ptype === 'integer' ? parseInt(v) : parseFloat(v)
                  if (!isNaN(v)) {
                    newVal.push(v)
                  }
                })
              break
              case 'password':
                val = val.map(v => md5(v))
              case 'string':
              default:
                newVal = val.map(v => {
                  if (typeof v !== 'string') {
                    v = v.toString(v)
                  }
                  return v
                })
              break
            }
          } catch (e) {
            debug(e)
            continue
          }

          val = isArray ? newVal : newVal[0]
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
