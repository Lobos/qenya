import tingodb from 'tingodb'
import config from '../config'
import { setObjectID } from '../utils/objectId'
import { mkDir } from '../utils/dir'

export default function () {
  const engine = tingodb({})

  const dbs = {
    qenya: new engine.Db(config.tingo.qenya, {}),
    data: new engine.Db(config.tingo.data, {}),
  }

  setObjectID(engine.ObjectID)

  mkDir([config.tingo.qenya, config.tingo.data])

  return async function (ctx, next) {
    ctx.db = (path = 'qenya') => dbs[path]
    await next()
  }
}

