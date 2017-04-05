import coRequest from 'co-request'
import app from './server/app'
import api from './server/api'

function route (router) {
  router.get('/static/**/*.js(on)?', async function (ctx, next) {
    let options = {
      uri: 'http://localhost:5001' + ctx.url,
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

// server ====================================
app.start({
  config: {
    debug: true,
    engine: 'tingodb'
  },
  port: 5000,
  route,
  api
})

// api server =================================
api.start({
  port: 5002,
  render: (res) => {
    if (res.data) {
      let keys = Object.keys(res.data)
      return {
        success: true,
        model: keys.length === 1 ? res.data[keys[0]] : res.data
      }
    } else {
      return {
        success: false,
        errors: res.errors
      }
    }
  }
})
