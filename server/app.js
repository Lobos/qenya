import Koa from 'koa'
import views from 'koa-views'
import config, { setConfig } from '../config/server.config'
import tingodb from './middlewares/tingodb'
import logger from './middlewares/logger'
import render from './middlewares/render'
import i18n from './middlewares/i18n'
import router from './router'
import api from './api'

export default function createApp (options) {
  setConfig(options)

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
    await api.reset()
    ctx.Render.success('')
  })

  app.use(router.routes())

  if (config.apiPort) {
    api.start()
  }

  return app
}
