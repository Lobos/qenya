import {
  GraphQLObjectType,
  // GraphQLList,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat
} from 'graphql'
import objectId from '../utils/objectId'
import { getOne, getList } from '../models/data'
import RefType from './RefType'
import { substitute } from '../utils/strings'

let typeDict = {}

function convertType (type) {
  switch (type) {
    case 'bool':
      return GraphQLBoolean
    case 'integer':
      return GraphQLInt
    case 'number':
      return GraphQLFloat
    default:
      return GraphQLString
  }
}

export function getType (schema, schemas, db) {
  const name = schema.code
  if (typeDict[name]) return typeDict[name]

  const fields = {
    id: {
      type: GraphQLString,
      resolve: d => d._id
    }
  }

  schema.fields.forEach(f => {
    if (f.sourceType === 'ref' && schemas) {
      const ref = schemas.find(s => s.code === f.sourceRef)

      if (f.mult) {
        fields[f.name] = {
          // type: new GraphQLList(getType(ref)),
          type: RefType,
          args: {
            fmt: { type: GraphQLString },
            join: { type: GraphQLString }
          },
          resolve: (d, {fmt, join}) => {
            return getList(db.collection(ref.code), {_id: {$in: d[f.sourceRef]}})
              .then(value => {
                if (!fmt) return value
                value = value.map(v => substitute(fmt, v))
                if (join) value = value.join(join)
                return value
              })
          }
        }
      } else {
        fields[f.name] = {
          type: RefType,
          args: {
            fmt: { type: GraphQLString }
          },
          resolve: (d, {fmt}) => {
            return getOne(db.collection(ref.code), {_id: objectId(d[f.sourceRef])})
              .then(value => {
                if (!fmt) return value
                return substitute(fmt, value)
              })
          }
        }
      }
    } else {
      fields[f.name] = { type: convertType(f.type) }
    }
  })

  const gt = new GraphQLObjectType({
    name,
    fields,
    description: schema.desc
  })

  typeDict[name] = gt
  return gt
}

export function clearType () {
  typeDict = {}
}
