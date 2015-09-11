'use strict'

const Render = require('../render')
const mongodb = require('mongodb')
const ObjectId = mongodb.ObjectId
const COLL_ROLE = 'roles'

exports.list = function *() {
  let roles = yield this.collection(COLL_ROLE).find({}).toArray()
  this.body = Render.success(roles)
}

exports.add = function *() {
  let role = Object.assign({}, this.request.body, {
    //create_by: '',
    create_at: Date.now(),
    update_at: Date.now()
  })

  let err = yield this.collection(COLL_ROLE).insert(role)
  console.log(err)
  this.body = Render.success()
}

exports.update = function *(id) {
  //let coll = this.collection(COLL_ROLE)
  //let role = yield coll.findOne({ _id: ObjectId(id) })
  let role = Object.assign({}, this.request.body, {
    //update_by: '',
    update_at: Date.now()
  })

  let err = yield this.collection(COLL_ROLE).update(
    { _id: ObjectId(id) },
    { $set: role }
  )

  console.log(err)

  this.body = Render.success()
}
