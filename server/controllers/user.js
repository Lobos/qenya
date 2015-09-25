'use strict'

const mongodb = require('mongodb')
const ObjectId = mongodb.ObjectId
const User = require('../schema/user')

// need pagination
exports.page = function *() {
  let users = yield this.collection(User.name).find({}).toArray()
  this.Render.success(users)
}

exports.findOne = function *() {
  let user = yield this.collection(User.name).findOne({ _id: ObjectId(this.params.id) })
  if (user) {
    this.Render.success(user)
  } else {
    this.Render.notFound()
  }
}

exports.insert = function *() {
  let err = User.check(this.request.body, this.i18n)
  if (err) {
    this.Render.fail(err)
    return
  }

  let user = Object.assign({}, this.request.body, {
    //create_by: '',
    create_at: Date.now(),
    update_at: Date.now()
  })

  let doc = yield this.collection(User.name).insert(user)

  if (doc.result.ok) {
    this.Render.success(doc.result.ops)
  } else {
    this.Render.fail(this.i18n.__('mongo.insert_error'))
  }
}

exports.update = function *() {
  let user = User.sift(this.request.body)

  user = Object.assign({}, user, {
    //update_by: '',
    update_at: Date.now()
  })

  let doc = yield this.collection(User.name).update(
    { _id: ObjectId(this.params.id) },
    { $set: user }
  )

  if (doc.result.ok) {
    this.Render.success(doc.result.nModified)
  } else {
    this.Render.fail(this.i18n.__('mongo.update_error'))
  }
}
