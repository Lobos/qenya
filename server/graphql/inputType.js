import {
  GraphQLInputObjectType
} from 'graphql'
import { convertType } from './type'

let typeDict = {}

export default function (schema, schemas, db) {
  const name = schema.code + 'Input'
  if (typeDict[name]) return typeDict[name]

  const fields = {}

  schema.fields.forEach(f => {
    fields[f.name] = { type: convertType(f.type) }
  })

  const gt = new GraphQLInputObjectType({
    name,
    fields,
    description: schema.desc
  })

  typeDict[name] = gt
  return gt
}

export function clearInputType () {
  typeDict = {}
}
