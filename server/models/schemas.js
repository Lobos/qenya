const SCHEMA_NAME = 'schemas'

export async function getAll (db) {
  return new Promise((resolve, reject) => {
    db.collection(SCHEMA_NAME).find({}).toArray((err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

export async function addSchema (db, entity) {
  return new Promise((resolve, reject) => {
    db.collection(SCHEMA_NAME).insert(entity, (err, item) => {
      if (err) {
        reject(err)
      } else {
        resolve(item)
      }
    })
  })
}

export async function getOne (db, id) {
  return new Promise((resolve, reject) => {
    db.collection(SCHEMA_NAME).findOne({ _id: id }, (err, item) => {
      if (err) {
        reject(err)
      } else {
        resolve(item)
      }
    })
  })
}
