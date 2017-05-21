import { GraphQLScalarType } from 'graphql'

export default new GraphQLScalarType({
  name: 'Json',
  serialize(value) {
    return value
  },
  parseValue(value) {
    return value
  },
  parseLiteral(value) {
    return value
  },
})
