import { callback } from '../utils/model'
import objectId from '../utils/objectId'

function getCount (col, query) {
  return new Promise(function () {
    col.find(query).count(callback(...arguments))
  })
}

export function getPageList (col, query = {}, page, size, sort = {_id: -1}) {
  return new Promise(async function (resolve, reject) {
    const total = await getCount(col, query)
    col.find(query).sort(sort).skip((page - 1) * size).limit(size).toArray((err, list) => {
      if (err) {
        reject(err)
      } else {
        resolve({ total, page, size, list })
      }
    })
  })
}

export function insert (col, entity) {
  entity._id = objectId()
  return new Promise(function () {
    col.insert(entity, callback(...arguments))
  })
}

export function update (col, entity) {
  let id = objectId(entity._id)
  return new Promise(function (resolve, reject) {
    col.update({ _id: id }, { $set: entity }, function (err) {
      if (err) reject(err)
      else resolve([entity])
    })
  })
}

export function getList (col, query) {
  return new Promise(function () {
    col.find(query).toArray(callback(...arguments))
  })
}

export function getOne (col, query) {
  return new Promise(function () {
    col.findOne(query, callback(...arguments))
  })
}

export function remove (col, query) {
  return new Promise(function () {
    col.remove(query, callback(...arguments))
  })
}
