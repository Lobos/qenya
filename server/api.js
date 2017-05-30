import Koa from 'koa'
import cors from 'koa2-cors'
import Router from 'koa-router'
import body from 'koa-bodyparser'
import tingodb from 'tingodb'
import { graphql } from 'graphql'
import swig from 'swig'
import { MongoClient } from 'mongodb'
import config, { setConfig } from './config'
import getSchema from './graphql'
import { getAll } from './models/schemas'
import tingodbMiddleware from './middlewares/tingodb'
import mongodbMiddleware from './middlewares/mongodb'

const apiServer = new Koa()
const router = new Router()

apiServer.use(cors())

let getDb
let running = false
let presetRoute = () => {}
let handleResult

async function bindRouter() {
  return new Promise(async (resolve, reject) => {
    const db = await getDb()
    db.collection('api').find({ status: 1 }).sort({ weight: -1 })
      .toArray((err, routes) => {
        if (err) reject(err)

        if (!routes) {
          reject(new Error('routes not found.'))
          return
        }

        routes.forEach((r) => {
          router[r.method](r.route, body(), async (ctx) => {
            const args = Object.assign({}, ctx.query, ctx.params)

            try {
              if (r.apiType === 'static') {
                ctx.body = typeof r.data === 'string' ? JSON.parse(r.data) : r.data
              } else {
                const query = swig.render(r.query, { locals: args })
                const variables = ctx.request.method === 'GET' ? args : ctx.request.body
                const schemas = await getAll(ctx.db())
                let data = await graphql(getSchema(ctx.db('data'), schemas), query, null, null, variables)

                if (handleResult) data = handleResult(data)

                ctx.body = data
              }
            } catch (e) {
              let errors = {
                errors: {
                  message: e.message,
                },
              }
              if (handleResult) errors = handleResult(errors)

              ctx.body = errors
            }
          })
        })

        resolve()
        presetRoute(router)
      })
  })
}

async function start({ port = 5002, route, render, apiConfig }) {
  setConfig(apiConfig)

  if (config.engine === 'tingodb') {
    apiServer.use(tingodbMiddleware())

    const engine = tingodb({})

    getDb = async () => new Promise((resolve) => {
      resolve(new engine.Db(config.tingo.qenya, {}))
    })
  } else {
    const mdb = await mongodbMiddleware()
    apiServer.use(mdb)
    getDb = async () => {
      const md = await MongoClient.connect(config.mongo.qenya)
      return md
    }
  }

  if (route) presetRoute = route
  handleResult = render

  await bindRouter()

  apiServer.use(router.routes())

  apiServer.listen(port, () => {
    running = true
    console.log(`api server running on http://localhost:${port}.`)
  })
}

async function reset() {
  if (!running) return

  router.stack = []
  await bindRouter()
}

export default {
  start,
  reset,
}
