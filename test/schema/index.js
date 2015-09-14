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
    text: { length: 10 },
    roles: { type: ['integer'], defaultValue: [] }
  })

  it('should check', function () {
    let entity = { email: 'a@b.com' }
    let err = schema.check(entity, i18n)
    err.should.be.eql(i18n.__('schema.required', 'nickname'))

    entity.nickname = 'abc'
    err = schema.check(entity, i18n)
    entity.should.be.eql({ email: 'a@b.com', nickname: 'abc', age: 0, roles: [] })
    expect(err).to.be.null

    entity.age = '18'
    err = schema.check(entity, i18n)
    entity.should.be.eql({ email: 'a@b.com', nickname: 'abc', age: 18, roles: [] })
    expect(err).to.be.null

    entity.roles = [0, '1', null]
    err = schema.check(entity, i18n)
    err.should.be.eql(i18n.__('schema.type_error', 'roles'))

    entity.roles = [0, '1']
    err = schema.check(entity, i18n)
    entity.should.be.eql({ email: 'a@b.com', nickname: 'abc', age: 18, roles: [0, 1] })
    expect(err).to.be.null

    entity.score = '123.45'
    err = schema.check(entity, i18n)
    entity.should.be.eql({ email: 'a@b.com', nickname: 'abc', age: 18, roles: [0, 1], score: 123.45 })
    expect(err).to.be.null

    entity.notexist = '123'
    err = schema.check(entity, i18n)
    err.should.be.eql(i18n.__('schema.key_illegal', 'notexist'))

    delete entity.notexist
    entity.text = '12345678901'
    err = schema.check(entity, i18n)
    err.should.be.eql(i18n.__('schema.over_length', 'text'))
  })

  it('should sift', function () {
    let entity = { email: 'a@b.com' }

    // once should skip
    entity = schema.sift(entity)
    entity.should.be.eql({})

    entity.age = '18'
    entity = schema.sift(entity)
    entity.should.be.eql({ age: 18 })
    
    entity.roles = [0, '1', null]
    entity = schema.sift(entity)
    entity.should.be.eql({ age: 18, roles: [0, 1] })

    entity.score = '123.45'
    entity = schema.sift(entity)
    entity.should.be.eql({ age: 18, roles: [0, 1], score: 123.45 })

    entity.notexist = '123'
    entity = schema.sift(entity)
    entity.should.be.eql({ age: 18, roles: [0, 1], score: 123.45 })

    entity.nickname = 'abc'
    entity = schema.sift(entity)
    entity.should.be.eql({ age: 18, nickname: 'abc', roles: [0, 1], score: 123.45 })

    entity.notexist = '123'
    entity = schema.sift(entity)
    entity.should.be.eql({ age: 18, nickname: 'abc', roles: [0, 1], score: 123.45 })

    entity.text = '123456789012345'
    entity = schema.sift(entity)
    entity.should.be.eql({ age: 18, nickname: 'abc', roles: [0, 1], score: 123.45, text: '1234567890' })
  })
})
