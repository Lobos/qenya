import {
  GraphQLID,
  GraphQLList,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat,
} from 'graphql'
import JsonType from './jsonType'

export function convertType(type) {
  switch (type) {
    case 'bool':
      return GraphQLBoolean
    case 'integer':
      return GraphQLInt
    case 'number':
      return GraphQLFloat
    case 'json':
      return JsonType
    default:
      return GraphQLString
  }
}

export function convertRefType(field) {
  if (field.sourceType === 'ref' && !field.sep) {
    if (field.mult) return new GraphQLList(GraphQLID)

    return GraphQLID
  }

  return GraphQLString
}

export function toArray(value, sep) {
  if (typeof value === 'string' && sep) {
    value = value.split(sep)
  }

  return value
}
