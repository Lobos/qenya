let ObjectID
let db

export function setObjectID(obj, mdb) {
  ObjectID = obj
  db = mdb
}

export default function (id) {
  return new ObjectID(id)
}

export async function nextSequence(name) {
  return new Promise(async (resolve) => {
    if (!db) resolve(new ObjectID())

    const coll = db.collection('counters')

    let result = await coll.findOne({ _id: name })
    if (result === null) {
      coll.insert({ _id: name, seq: 1 })
      resolve(1)
    } else {
      result = await coll.findAndModify({ _id: name }, null, { $inc: { seq: 1 } }, { new: true })

      resolve(result.value.seq)
    }
  })
}
