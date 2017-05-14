import path from 'path'
import Koa from 'koa'
import views from 'koa-views'
import send from 'koa-send'
import config, { setConfig } from './config'
import tingodb from './middlewares/tingodb'
import mongodb from './middlewares/mongodb'
import logger from './middlewares/logger'
import render from './middlewares/render'
import router from './router'

async function start(options) {
  setConfig(options.config)

  const app = new Koa()

  app.use(logger)

  app.use(render)

  // db engine
  if (config.engine === 'tingodb') {
    app.use(tingodb())
  } else {
    const mdb = await mongodb()
    app.use(mdb)
  }

  app.use(views(path.resolve(__dirname, 'static'), {
    map: { html: 'swig' },
  }))

  router.get('/resetapi', async (ctx) => {
    if (options.api) await options.api.reset()
    ctx.Render.success('')
  })

  if (options.route) options.route(router)

  router.get('/static/*', async (ctx) => {
    await send(ctx, ctx.path, { root: __dirname })
  })

  app.use(router.routes())

  app.listen(options.port, () => {
    console.log(`qenya server running on http://localhost:${options.port}`)
  })
}

export default {
  start,
}
