import Koa from 'koa'
import Router from 'koa-router'
import config from '../config/server.config'
import tingodb from 'tingodb'
import { graphql } from 'graphql'
import getSchema from './graphql'
import { getAll } from './models/schemas'
import template from 'es6-template-strings'

const apiServer = new Koa()
const router = new Router()

let db = {}

// db engine
if (config.engine === 'tingodb') {
  apiServer.use(require('./middlewares/tingodb').default())

  const engine = tingodb({})

  db = () => new engine.Db(config.tingo.hydra, {})
}

async function bindRouter () {
  return new Promise((resolve, reject) => {
    db().collection('api').find({}).toArray((err, routes) => {
      if (err) reject(err)

      routes.forEach(r => {
        router[r.method](r.path, async function (ctx, next) {
          const args = Object.assign({}, ctx.query, ctx.params)
          const query = template(r.query, args)
          const schemas = await getAll(ctx.db())
          ctx.body = await graphql(getSchema(ctx.db('data'), schemas), query)
        })
      })

      resolve()
    })
  })
}

async function start () {
  await bindRouter()

  apiServer.use(router.routes())

  apiServer.listen(config.apiPort, function () {
    console.log('api server start.')
  })
}

async function reset () {
  console.log(111111, 'reset')
  router.stack = []
  await bindRouter()
}

export default {
  start,
  reset
}
