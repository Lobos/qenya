import Koa from 'koa'
import Router from 'koa-router'
import config from '../config/server.config'
import tingodb from 'tingodb'
import { graphql } from 'graphql'
import getSchema from './graphql'
import { getAll } from './models/schemas'

const apiServer = new Koa()
const router = new Router()

let db = {}

// db engine
if (config.engine === 'tingodb') {
  apiServer.use(require('./middlewares/tingodb').default())

  const engine = tingodb({})

  db = new engine.Db(config.tingo.hydra, {})
}

function start () {
  db.collection('api').find({}).toArray((err, routes) => {
    routes.forEach(r => {
      router[r.method](r.path, async function (ctx, next) {
        const schemas = await getAll(ctx.db())
        ctx.body = await graphql(getSchema(ctx.db('data'), schemas), r.query)
      })
    })

    apiServer.use(router.routes())

    apiServer.listen(config.apiPort, function () {
      console.log('api server start.')
    })
  })
}

function restart () {
  // not work
  // apiServer.close()
  start()
}

export default {
  start,
  restart
}
