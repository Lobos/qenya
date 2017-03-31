import Koa from 'koa'
import Router from 'koa-router'
import body from 'koa-bodyparser'
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
let handleResult

// db engine
if (config.engine === 'tingodb') {
  apiServer.use(require('./middlewares/tingodb').default())

  const engine = tingodb({})

  db = () => new engine.Db(config.tingo.hydra, {})
}

async function bindRouter () {
  presetRoute(router)

  return new Promise((resolve, reject) => {
    db().collection('api').find({}).sort({ weight: -1 }).toArray((err, routes) => {
      if (err) reject(err)

      if (!routes) {
        reject(new Error('routes not found.'))
        return
      }

      routes.forEach(r => {
        router[r.method](r.path, body(), async function (ctx, next) {
          const args = Object.assign({}, ctx.query, ctx.params)
          try {
            const query = swig.render(r.query, { locals: args })
            // const query = r.query
            const variables = ctx.request.method === 'GET' ? args : ctx.request.body

            const schemas = await getAll(ctx.db())
            let data = await graphql(getSchema(ctx.db('data'), schemas), query, null, null, variables)

            if (handleResult) data = handleResult(data)

            ctx.body = data
          } catch (e) {
            let errors = {
              errors: {
                message: e.message
              }
            }
            if (handleResult) errors = handleResult(errors)

            ctx.body = errors
          }
        })
      })

      resolve()
    })
  })
}

async function start ({port = 5002, route, render}) {
  if (route) presetRoute = route
  handleResult = render

  await bindRouter()

  apiServer.use(router.routes())
  apiServer.listen(port, function () {
    running = true
    console.log(`api server running on http://localhost:${port}.`)
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
