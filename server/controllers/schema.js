'use strict'

const SCHEMAS = {
  user: require('../schema/user'),
  role: require('../schema/role'),
  access: require('../schema/access')
}

exports.getByCode = function *() {
  const code = this.params.code
  const schema = SCHEMAS[code]
  if (schema) {
    this.Render.success(schema.props)
  } else {
    this.Render.notFound()
  }
}
