'use strict'

const DBRef = require('mongodb').DBRef
const Schema = require('../../server/schema')
const User = require('../../server/schema/user')
const i18n = new (require('i18n-2'))({
  locales: ['zh-cn'],
  extension: ".json",
  directory: "./server/locales"
})
const chai = require('chai')
const expect = chai.expect
chai.should()


describe('test/schema/index.js', function () {
  it('should check', function () {
    let entity = { email: 'a@b.com', nickname: 'nick' }
    let err = User.check(entity, i18n)
    expect(err).to.be.null

    entity.roles = ['55f3efb351c8f34491a667c8', '55f3f0317d6d549ca34ca30d']
    entity.accesses = ['55f5702122d727c0c4e95ed4', '55f5775c22d727c0c4e95ed5', '55f5778422d727c0c4e95ed6', '55f5778422d727c0c4e95ed7', '55f5778422d727c0c4e95ed8']
    err = User.check(entity, i18n)
    expect(err).to.be.null
    entity.roles.length.should.eql(2)
    expect(entity.roles[0] instanceof DBRef).to.be.true
    entity.accesses.length.should.eql(5)
    expect(entity.accesses[0] instanceof DBRef).to.be.true
  })
})
