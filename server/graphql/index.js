import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLID
} from 'graphql'
import objectId from '../utils/objectId'
import { getOne, getPageList, insertOrUpdate, remove } from '../models/data'
import getQueryType, { clearQueryType } from './queryType'
import getInputType, { clearInputType } from './inputType'
import { convertType } from './type'

function getOneQuery (db, schema, graphType) {
  return {
    type: graphType,
    args: {
      id: {
        type: GraphQLID
      }
    },
    resolve: (root, { id }) => {
      return getOne(db.collection(schema.code), { _id: objectId(id) })
    }
  }
}

function getListQuery (db, schema, graphType) {
  return {
    type: new GraphQLObjectType({
      name: `${schema.code}List`,
      fields: {
        total: { type: GraphQLInt },
        page: { type: GraphQLInt },
        size: { type: GraphQLInt },
        list: { type: new GraphQLList(graphType) }
      }
    }),
    args: {
      page: { type: GraphQLInt },
      size: { type: GraphQLInt },
      query: { type: GraphQLString, desciprtion: 'mongodb query' },
      sort: { type: GraphQLString, desciprtion: 'mongodb sort' }
    },
    resolve: (root, { page = 1, size = 20, query = '{}', sort = '{ "_id": -1 }' }) => {
      query = JSON.parse(query)
      sort = JSON.parse(sort)
      return getPageList(db.collection(schema.code), query, page, size, sort)
    }
  }
}

function getQuery (db, schemas) {
  const fields = {}
  schemas.forEach(schema => {
    const graphType = getQueryType(schema, schemas, db)
    fields[schema.code + 'List'] = getListQuery(db, schema, graphType)
    fields[schema.code] = getOneQuery(db, schema, graphType)
  })

  return new GraphQLObjectType({
    name: 'Query',
    fields
  })
}

function getSaveQuery (db, schema, queryType) {
  const args = {
    id: { type: GraphQLID }
  }

  schema.fields.forEach(f => {
    args[f.name] = { type: convertType(f.type) }
  })

  return {
    type: queryType,
    args,
    resolve: async (root, data) => {
      const res = await insertOrUpdate(db.collection(schema.code), data)
      return res[0]
    }
  }
}

function getDeleteQuery (db, schema) {
  return {
    type: GraphQLInt,
    args: {
      id: {
        type: GraphQLID
      }
    },
    resolve: (root, {id}) => {
      return remove(db.collection(schema.code), { _id: objectId(id) })
    }
  }
}

function getMutation (db, schemas) {
  const fields = {}
  schemas.forEach(schema => {
    const queryType = getQueryType(schema, schemas, db)
    const inputType = getInputType(schema, schemas, db)
    const name = schema.code.replace(/\b\w/g, l => l.toUpperCase())
    fields['save' + name] = getSaveQuery(db, schema, queryType, inputType)
    fields['delete' + name] = getDeleteQuery(db, schema)
  })

  return new GraphQLObjectType({
    name: 'Mutation',
    fields
  })
}

export default function getSchema (db, schemas) {
  return new GraphQLSchema({
    query: getQuery(db, schemas),
    mutation: getMutation(db, schemas)
  })
}

export function clearType () {
  clearQueryType()
  clearInputType()
}
