import config from '../../config/server.config'
import tingodb from 'tingodb'
import { setObjectID } from '../utils/objectId'
import { mkDir } from '../utils/dir'

export default function () {
  let engine = tingodb({})

  const dbs = {
    hydra: new engine.Db(config.tingo.hydra, {}),
    data: new engine.Db(config.tingo.data, {})
  }

  setObjectID(engine.ObjectID)

  mkDir([config.tingo.hydra, config.tingo.data])

  return async function (ctx, next) {
    ctx.db = (path = 'hydra') => dbs[path]
    await next()
  }
}

