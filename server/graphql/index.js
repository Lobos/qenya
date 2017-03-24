import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLID
} from 'graphql'
import objectId from '../utils/objectId'
import { getOne, getList } from '../models/data'
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

function getListQuery (db, schema, graphType, query = {}) {
  return {
    type: new GraphQLList(graphType),
    resolve: () => {
      return getList(db.collection(schema.code), query)
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
