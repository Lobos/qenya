import { GraphQLScalarType } from 'graphql'

export default new GraphQLScalarType({
  name: 'RefType',
  serialize (value) {
    return value
  },
  parseValue (value) {
    return value
  },
  parseLiteral (value) {
    return value
  }
})
