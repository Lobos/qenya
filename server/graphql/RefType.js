import { GraphQLScalarType } from 'graphql'

const types = {}

export default function refType (field) {
  const name = field.name + 'RefType'
  if (types[name]) return types[name]

  const rt = types[name] = new GraphQLScalarType({
    name,
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

  return rt
}
