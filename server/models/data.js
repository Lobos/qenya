import { callback } from '../utils/model'
import { nextSequence } from '../utils/objectId'
import config from '../config'

function getCount(col, query) {
  return new Promise((...args) => {
    col.find(query).count(callback(...args))
  })
}

export function getPageList(col, query = {}, page, size, sort = { _id: -1 }) {
  return new Promise(async (resolve, reject) => {
    const total = await getCount(col, query)
    col.find(query).sort(sort).skip((page - 1) * size).limit(size)
      .toArray((err, list) => {
        if (err) {
          reject(err)
        } else {
          resolve({ total, page, size, list })
        }
      })
  })
}

export function insert(col, model) {
  return new Promise((resolve, reject) => {
    col.insert(model, (err, result) => {
      if (err) reject(err)

      if (config.engine === 'tingodb') resolve(result)
      resolve(result.ops)
    })
  })
}

export function update(col, model) {
  return new Promise((resolve, reject) => {
    col.update({ _id: model._id }, { $set: model }, (err) => {
      if (err) reject(err)
      else resolve([model])
    })
  })
}

export function getList(col, query) {
  return new Promise((...args) => {
    col.find(query).toArray(callback(...args))
  })
}

export function getOne(col, query) {
  return new Promise((...args) => {
    col.findOne(query, callback(...args))
  })
}

export async function insertOrUpdate(db, schema, data) {
  const { _id, ...params } = data
  const method = _id ? update : insert

  if (_id) {
    const old = await getOne(db.collection(schema), { _id: parseInt(_id, 10) })
    data = Object.assign({}, old, params)
  } else {
    data._id = await nextSequence(schema)
  }

  return method(db.collection(schema), data)
}

export function remove(col, query) {
  if (typeof query === 'string') query = { _id: query }
  return new Promise((resolve, reject) => {
    col.remove(query, (err, result) => {
      if (err) reject(err)
      if (config === 'tingodb') resolve(result)
      else resolve(result.result.ok)
    })
  })
}
