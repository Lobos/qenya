import { callback } from '../utils/model'
import objectId from '../utils/objectId'

const API_NAME = 'api'

export function getAll (db) {
  return new Promise(function () {
    db.collection(API_NAME).find({}).sort({ _id: -1 }).toArray(callback(...arguments))
  })
}

export function insertApi (db, entity) {
  entity._id = objectId()
  return new Promise(function () {
    db.collection(API_NAME).insert(entity, callback(...arguments))
  })
}

export function updateApi (db, entity) {
  let id = objectId(entity._id)
  return new Promise(function (resolve, reject) {
    db.collection(API_NAME).update({ _id: id }, { $set: entity }, function (err) {
      if (err) reject(err)
      else resolve([entity])
    })
  })
}

export function getOne (db, query) {
  return new Promise(function () {
    db.collection(API_NAME).findOne(query, callback(...arguments))
  })
}

export function removeApi (db, id) {
  return new Promise(function () {
    db.collection(API_NAME).remove({ _id: objectId(id) }, callback(...arguments))
  })
}
