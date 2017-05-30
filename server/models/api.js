import { callback } from '../utils/model'
import objectId from '../utils/objectId'
import config from '../config'

const API_NAME = 'api'

export function getAll(db, query = {}, sort = { _id: -1 }) {
  return new Promise((...args) => {
    db.collection(API_NAME).find(query).sort(sort).toArray(callback(...args))
  })
}

export function insertApi(db, model) {
  return new Promise((resolve, reject) => {
    db.collection(API_NAME).insert({ ...model, _id: objectId() }, (err, result) => {
      if (err) reject(err)
      if (config.engine === 'tingodb') resolve(result)
      else resolve(result.ops)
    })
  })
}

export function updateApi(db, model) {
  const id = objectId(model._id)

  return new Promise((resolve, reject) => {
    db.collection(API_NAME).update({ _id: id }, { $set: model }, (err) => {
      if (err) reject(err)
      else resolve([model])
    })
  })
}

export function getOne(db, query) {
  return new Promise((...args) => {
    db.collection(API_NAME).findOne(query, callback(...args))
  })
}

export function removeApi(db, id) {
  return new Promise((resolve, reject) => {
    db.collection(API_NAME).remove({ _id: objectId(id) }, (err, result) => {
      if (err) reject(err)
      if (config.engine === 'tingodb') resolve(result)
      else resolve(result.result.ok)
    })
  })
}
