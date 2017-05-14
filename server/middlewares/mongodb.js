import { MongoClient, ObjectID } from 'mongodb'
import config from '../config'
import { setObjectID } from '../utils/objectId'

export default async function () {
  const dbs = {
    qenya: await MongoClient.connect(config.mongo.qenya),
    data: await MongoClient.connect(config.mongo.data),
  }

  setObjectID(ObjectID, dbs.qenya)

  return async function (ctx, next) {
    ctx.db = (path = 'qenya') => dbs[path]
    await next()
  }
}

