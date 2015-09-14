'use strict'

const mongodb = require('mongodb')
const ObjectId = mongodb.ObjectId
const Role = require('../schema/role')

exports.list = function *() {
  let entites = yield this.collection(Role.name).find({}).toArray()
  this.Render.success(entites)
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

exports.update = function *(id) {
  let role = Role.sift(this.request.body)

  role = Object.assign({}, role, {
    //update_by: '',
    update_at: Date.now()
  })

  let doc = yield this.collection(Role.name).update(
    { _id: ObjectId(id) },
    { $set: role }
  )

  if (doc.result.ok) {
    this.Render.success(doc.result.nModified)
  } else {
    this.Render.fail(this.i18n.__('mongo.update_error'))
  }
}

exports.remove = function *(id) {
  if (!id) {
    this.Render.fail('')
    return
  }

  let doc = yield this.collection(Role.name).remove({ _id: ObjectId(id) })

  if (doc.result.ok) {
    this.Render.success(doc.result.n)
  } else {
    this.Render.fail(this.i18n.__('mongo.remove_error'))
  }
}
