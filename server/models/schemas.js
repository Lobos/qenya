import { callback } from '../utils/model'
import objectId from '../utils/objectId'
import config from '../config'

const SCHEMA_NAME = 'schemas'

export function getAll(db) {
  return new Promise((...args) => {
    db.collection(SCHEMA_NAME).find({}).sort({ _id: -1 }).toArray(callback(...args))
  })
}

export function insertSchema(db, entity) {
  return new Promise((resolve, reject) => {
    db.collection(SCHEMA_NAME).insert({ ...entity, _id: objectId() }, (err, result) => {
      if (err) reject(err)

      if (config.engine === 'tingodb') resolve(result)
      resolve(result.ops)
    })
  })
}

export function updateSchema(db, model) {
  const { _id, ...sets } = model

  return new Promise((resolve, reject) => {
    db.collection(SCHEMA_NAME).update({ _id: objectId(_id) }, { $set: sets }, (err) => {
      if (err) reject(err)
      else resolve([model])
    })
  })
}

export function getOne(db, query) {
  return new Promise((...args) => {
    db.collection(SCHEMA_NAME).findOne(query, callback(...args))
  })
}

export function removeSchema(db, id) {
  return new Promise((resolve, reject) => {
    db.collection(SCHEMA_NAME).remove({ _id: objectId(id) }, (err, result) => {
      if (err) reject(err)
      if (config.engine === 'tingodb') resolve(result)
      else resolve(result.result.ok)
    })
  })
}
