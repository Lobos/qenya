import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLID
} from 'graphql'
import objectId from '../utils/objectId'
import { getOne, getPageList } from '../models/data'
import { getType } from './type'

function getOneQuery (db, schema, graphType) {
  return {
    type: graphType,
    args: {
      id: {
        type: GraphQLID
      }
    },
    resolve: (root, {id}) => {
      return getOne(db.collection(schema.code), {_id: objectId(id)})
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
      query: { type: GraphQLString, desciprtion: 'mongodb query' }
    },
    resolve: (root, {page = 1, size = 20, query = '{}'}) => {
      query = JSON.parse(query)
      return getPageList(db.collection(schema.code), query, page, size)
    }
  }
}

function getQuery (db, schemas) {
  const fields = {}
  schemas.forEach(schema => {
    const graphType = getType(schema, schemas, db)
    fields[schema.code + 'List'] = getListQuery(db, schema, graphType)
    fields[schema.code] = getOneQuery(db, schema, graphType)
  })

  return new GraphQLObjectType({
    name: 'Query',
    fields
  })
}

export default function getSchema (db, schemas) {
  return new GraphQLSchema({
    query: getQuery(db, schemas)
  })
}
