import coRequest from 'co-request'
import app from './app'
import api from './api'
import { setConfig } from './config'

function staticProxy(port) {
  return async function (ctx) {
    const options = {
      uri: `http://localhost:${port}${ctx.url}`,
      mothed: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-Cache',
      },
    }
    const response = await coRequest(options)
    for (const key in response.headers) {
      ctx.set(key, response.headers[key])
    }
    ctx.body = response.body
  }
}

module.exports = function ({ appPort, apiPort, staticPort, config, render, route }) {
  setConfig(config)

  const appConfig = { port: appPort }

  if (apiPort) {
    api.start({
      port: apiPort,
      apiConfig: config,
      render,
      route,
    })
    appConfig.api = api
  }

  if (staticPort) {
    appConfig.route = (router) => {
      router.get('/static/js/app.js', staticProxy(staticPort))
      router.get('/static/js/*.hot-update.js(on)?', staticProxy(staticPort))
    }
  }

  app.start(appConfig)
}
