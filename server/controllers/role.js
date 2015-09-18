'use strict'

const mongodb = require('mongodb')
const ObjectId = mongodb.ObjectId
const Role = require('../schema/role')

exports.list = function *() {
  let entites = yield this.collection(Role.name).find({}).toArray()
  this.Render.success(entites)
}

exports.findOne = function *() {
  let entity = yield this.collection(Role.name).findOne({ _id: ObjectId(this.params.id) })
  if (entity) {
    let ids = entity.accesses.map(ref => ref.oid)
    entity.accesses = yield this.collection('accesses').find({ _id: { $in: ids } }).toArray()
    this.Render.success(entity)
  } else {
    this.Render.notFound()
  }
}

exports.insert = function *() {
  let err = Role.check(this.request.body, this.i18n)
  if (err) {
    this.Render.fail(err)
    return
  }

  let role = Object.assign({}, this.request.body, {
    //create_by: '',
    create_at: Date.now(),
    update_at: Date.now()
  })

  let doc = yield this.collection(Role.name).insert(role)

  if (doc.result.ok) {
    this.Render.success(doc.result.ops)
  } else {
    this.Render.fail(this.i18n.__('mongo.insert_error'))
  }
}

exports.update = function *() {
  let role = Role.sift(this.request.body)

  role = Object.assign({}, role, {
    //update_by: '',
    update_at: Date.now()
  })

  let doc = yield this.collection(Role.name).update(
    { _id: ObjectId(this.params.id) },
    { $set: role }
  )

  if (doc.result.ok) {
    this.Render.success(doc.result.nModified)
  } else {
    this.Render.fail(this.i18n.__('mongo.update_error'))
  }
}

exports.remove = function *() {
  if (!id) {
    this.Render.fail('')
    return
  }

  let doc = yield this.collection(Role.name).remove({ _id: ObjectId(this.params.id) })

  if (doc.result.ok) {
    this.Render.success(doc.result.n)
  } else {
    this.Render.fail(this.i18n.__('mongo.remove_error'))
  }
}
