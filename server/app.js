import path from 'path'
import Koa from 'koa'
import views from 'koa-views'
import send from 'koa-send'
import config, { setConfig } from '../config/server.config'
import tingodb from './middlewares/tingodb'
import logger from './middlewares/logger'
import render from './middlewares/render'
import i18n from './middlewares/i18n'
import router from './router'

function start (options) {
  setConfig(options.config)

  const app = new Koa()

  app.use(i18n(config.i18n))

  app.use(logger)

  app.use(render)

  // db engine
  if (config.engine === 'tingodb') {
    app.use(tingodb())
  }

  app.use(views('static', {
    map: { html: 'swig' }
  }))

  router.get('/resetapi', async (ctx, next) => {
    if (options.api) await options.api.reset()
    ctx.Render.success('')
  })

  if (options.route) options.route(router)

  router.get('/static/*', async function (ctx, next) {
    await send(ctx, path.resolve(__dirname, '../', ctx.path))
  })

  app.use(router.routes())

  app.listen(options.port, () => {
    console.log(`hydra server running on http://localhost:${options.port}`)
  })
}

export default {
  start
}
