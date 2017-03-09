import { callback } from '../utils/model'
import objectId from '../utils/objectId'

const SCHEMA_NAME = 'schemas'

export function getAll (db) {
  return new Promise(function () {
    db.collection(SCHEMA_NAME).find({}).sort({ _id: -1 }).toArray(callback(...arguments))
  })
}

export function insertSchema (db, entity) {
  entity._id = objectId()
  return new Promise(function () {
    db.collection(SCHEMA_NAME).insert(entity, callback(...arguments))
  })
}

export function updateSchema (db, entity) {
  let id = objectId(entity._id)
  return new Promise(function (resolve, reject) {
    db.collection(SCHEMA_NAME).update({ _id: id }, { $set: entity }, function (err) {
      if (err) reject(err)
      else resolve([entity])
    })
  })
}

export function getOne (db, query) {
  return new Promise(function () {
    db.collection(SCHEMA_NAME).findOne(query, callback(...arguments))
  })
}

export function removeSchema (db, id) {
  return new Promise(function () {
    db.collection(SCHEMA_NAME).remove({ _id: objectId(id) }, callback(...arguments))
  })
}
