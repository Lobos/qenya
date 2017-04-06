import coRequest from 'co-request'
import app from './app'
import api from './api'
import { setConfig } from './config'

export default function ({ appPort, apiPort, staticPort, config, render, route }) {
  setConfig(config)

  const appConfig = { port: appPort }

  if (apiPort) {
    api.start({
      port: apiPort,
      render,
      route
    })
    appConfig.api = api
  }

  if (staticPort) {
    appConfig.route = (router) => {
      router.get('/static/js/app.js', async function (ctx, next) {
        let options = {
          uri: `http://localhost:${staticPort}${ctx.url}`,
          mothed: 'GET',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-Cache'
          }
        }
        let response = await coRequest(options)
        for (let key in response.headers) {
          ctx.set(key, response.headers[key])
        }
        ctx.body = response.body
      })
    }
  }

  app.start(appConfig)
}
