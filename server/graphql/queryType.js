import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString
} from 'graphql'
import objectId from '../utils/objectId'
import { getOne, getList } from '../models/data'
import refType from './refType'
import { substitute } from '../utils/strings'
import { convertType, toArray } from './type'

let typeDict = {}

function getSingleJsonType (db, field, ref) {
  return {
    type: refType(field),
    args: {
      fmt: {
        type: GraphQLString,
        description: 'Format string, like "{name}"'
      }
    },
    resolve: (d, { fmt }) => {
      return getOne(db.collection(ref.code), { _id: objectId(d[field.name]) })
        .then(value => {
          if (!fmt) return value
          return substitute(fmt, value)
        })
    }
  }
}

function getMultJsonType (db, field, ref) {
  return {
    type: refType(field),
    args: {
      fmt: { type: GraphQLString },
      join: { type: GraphQLString }
    },
    resolve: (d, { fmt, join }) => {
      const ids = toArray(d[field.name], field.sep)
      return getList(db.collection(ref.code), { _id: { $in: ids } })
        .then(value => {
          if (!fmt) return value
          value = value.map(v => substitute(fmt, v))
          if (join) value = value.join(join)
          return value
        })
    }
  }
}

function getSingleGraphqlType (db, field, ref) {
  return {
    type: getQueryType(ref),
    resolve: (d, { fmt }) => {
      return getOne(db.collection(ref.code), { _id: objectId(d[field.name]) })
    }
  }
}

function getMultGraphqlType (db, field, ref) {
  return {
    type: new GraphQLList(getQueryType(ref)),
    resolve: (d, { fmt, join }) => {
      const ids = toArray(d[field.name], field.sep)
      return getList(db.collection(ref.code), { _id: { $in: ids } })
    }
  }
}

const typeFns = {
  'mult-json': getMultJsonType,
  'single-json': getSingleJsonType,
  'mult-graphql': getMultGraphqlType,
  'single-graphql': getSingleGraphqlType
}

export default function getQueryType (schema, schemas, db) {
  const name = schema.code
  if (typeDict[name]) return typeDict[name]

  const fields = {
    _id: {
      type: GraphQLID
    }
  }

  schema.fields.forEach(f => {
    if (f.sourceType === 'ref' && schemas) {
      const ref = schemas.find(s => s.code === f.sourceRef)

      const fn = (f.mult ? 'mult' : 'single') + '-' + f.renderType
      fields[f.name] = typeFns[fn](db, f, ref)
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

export function clearQueryType () {
  typeDict = {}
}
