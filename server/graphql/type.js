import {
  GraphQLObjectType,
  GraphQLList,
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

function getSingleJsonType (db, field, ref) {
  return {
    type: RefType,
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
    type: RefType,
    args: {
      fmt: { type: GraphQLString },
      join: { type: GraphQLString }
    },
    resolve: (d, { fmt, join }) => {
      return getList(db.collection(ref.code), { _id: { $in: d[field.name] } })
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
    type: getType(ref),
    resolve: (d, { fmt }) => {
      return getOne(db.collection(ref.code), { _id: objectId(d[field.name]) })
    }
  }
}

function getMultGraphqlType (db, field, ref) {
  return {
    type: new GraphQLList(getType(ref)),
    resolve: (d, { fmt, join }) => {
      return getList(db.collection(ref.code), { _id: { $in: d[field.name] } })
    }
  }
}

const typeFns = {
  'mult-json': getMultJsonType,
  'single-json': getSingleJsonType,
  'mult-graphql': getMultGraphqlType,
  'single-graphql': getSingleGraphqlType
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

export function clearType () {
  typeDict = {}
}
