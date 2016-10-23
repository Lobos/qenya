import config from '../../config/server.config'
import tingodb from 'tingodb'

export default function () {
  let engine = tingodb({})
  let db = new engine.Db(config.tingo.path, {})

  return async function (ctx, next) {
    ctx.db = () => db
    ctx.collection = (name) => db.collection(name)
    await next()
  }
}
