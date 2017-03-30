import Koa from 'koa'
import Router from 'koa-router'
import config from '../config/server.config'
import tingodb from 'tingodb'
import { graphql } from 'graphql'
import getSchema from './graphql'
import { getAll } from './models/schemas'
import swig from 'swig'

const apiServer = new Koa()
const router = new Router()

let db = {}
let running = false
let presetRoute = () => {}

// db engine
if (config.engine === 'tingodb') {
  apiServer.use(require('./middlewares/tingodb').default())

  const engine = tingodb({})

  db = () => new engine.Db(config.tingo.hydra, {})
}

async function bindRouter () {
  presetRoute(router)

  return new Promise((resolve, reject) => {
    db().collection('api').find({}).toArray((err, routes) => {
      if (err) reject(err)

      if (!routes) {
        reject(new Error('routes not found.'))
        return
      }

      routes.forEach(r => {
        router[r.method](r.path, async function (ctx, next) {
          const args = Object.assign({}, ctx.query, ctx.params)
          try {
            // const query = template(r.query, args)
            const query = swig.render(r.query, { locals: args })

            const schemas = await getAll(ctx.db())
            ctx.body = await graphql(getSchema(ctx.db('data'), schemas), query)
          } catch (e) {
            ctx.body = {
              success: false,
              messsage: e.message
            }
          }
        })
      })

      resolve()
    })
  })
}

async function start ({port = 5002, route}) {
  if (route) presetRoute = route

  await bindRouter()

  apiServer.use(router.routes())
  apiServer.listen(port, function () {
    running = true
    console.log(`api server start at ${port}.`)
  })
}

async function reset () {
  if (!running) return

  router.stack = []
  await bindRouter()
}

export default {
  start,
  reset
}
