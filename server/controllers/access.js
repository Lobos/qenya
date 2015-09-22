'use strict'

const mongodb = require('mongodb')
const ObjectId = mongodb.ObjectId
const Access = require('../schema/access')

// no pagination
exports.list = function *() {
  let entites = yield this.collection(Access.name).find({}).toArray()
  this.Render.success(entites)
}

exports.insert = function *() {
  let err = Access.check(this.request.body, this.i18n)
  if (err) {
    this.Render.fail(err)
    return
  }

  let entity = Object.assign({}, this.request.body, {
    //create_by: '',
    create_at: Date.now(),
    update_at: Date.now()
  })

  let doc = yield this.collection(Access.name).insert(entity)

  if (doc.result.ok) {
    this.Render.success(doc.result.ops)
  } else {
    this.Render.fail(this.i18n.__('mongo.insert_error'))
  }
}

exports.update = function *() {
  let entity = Access.sift(this.request.body)

  entity = Object.assign({}, entity, {
    //update_by: '',
    update_at: Date.now()
  })

  let doc = yield this.collection(Access.name).update(
    { _id: ObjectId(this.params.id) },
    { $set: entity }
  )

  if (doc.result.ok) {
    this.Render.success(doc.result.nModified)
  } else {
    this.Render.fail(this.i18n.__('mongo.update_error'))
  }
}

exports.remove = function *() {
  if (!this.params.id) {
    this.Render.fail('')
    return
  }

  let doc = yield this.collection(Access.name).remove({ _id: ObjectId(this.params.id) })

  if (doc.result.ok) {
    this.Render.success(doc.result.n)
  } else {
    this.Render.fail(this.i18n.__('mongo.remove_error'))
  }
}
