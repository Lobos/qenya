'use strict'

const Schema = require('../../server/schema')
const i18n = new (require('i18n-2'))({
  locales: ['zh-cn'],
  extension: ".json",
  directory: "./server/locales"
})
const chai = require('chai')
const expect = chai.expect
chai.should()

describe('test/schema/index.js', function () {
  let schema = new Schema('user', {
    email: { type: 'email', length: 500, required: true, once: true },
    nickname: { type: 'string', length: 20, required: true },
    age: { type: 'integer', defaultValue: 0 },
    score: { type: 'float' },
    roles: { type: ['integer'], defaultValue: [] }
  })

  it('should check', function () {
    let body = { email: 'a@b.com' }
    let err = schema.check(body, i18n)
    err.should.be.eql(i18n.__('schema.required', 'nickname'))

    body.nickname = 'abc'
    err = schema.check(body, i18n)
    body.should.be.eql({ email: 'a@b.com', nickname: 'abc', age: 0, roles: [] })
    expect(err).to.be.null

    body.age = '18'
    err = schema.check(body, i18n)
    body.should.be.eql({ email: 'a@b.com', nickname: 'abc', age: 18, roles: [] })
    expect(err).to.be.null

    body.roles = [0, '1', null]
    err = schema.check(body, i18n)
    err.should.be.eql(i18n.__('schema.type_error', 'roles'))

    body.roles = [0, '1']
    err = schema.check(body, i18n)
    body.should.be.eql({ email: 'a@b.com', nickname: 'abc', age: 18, roles: [0, 1] })
    expect(err).to.be.null

    body.score = '123.45'
    err = schema.check(body, i18n)
    body.should.be.eql({ email: 'a@b.com', nickname: 'abc', age: 18, roles: [0, 1], score: 123.45 })
    expect(err).to.be.null

    body.notexist = '123'
    err = schema.check(body, i18n)
    err.should.be.eql(i18n.__('schema.key_illegal', 'notexist'))
  })

  it('should sift', function () {
    let body = { email: 'a@b.com' }

    body = schema.sift(body)
    body.should.be.eql({})

    body.age = '18'
    body = schema.sift(body)
    body.should.be.eql({ age: 18 })
    
    body.roles = [0, '1']
    body = schema.sift(body)
    body.should.be.eql({ age: 18, roles: [0, 1] })

    body.score = '123.45'
    body = schema.sift(body)
    body.should.be.eql({ age: 18, roles: [0, 1], score: 123.45 })

    body.notexist = '123'
    body = schema.sift(body)
    body.should.be.eql({ age: 18, roles: [0, 1], score: 123.45 })
  })
})
