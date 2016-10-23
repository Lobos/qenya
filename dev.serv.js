import coRequest from 'co-request'
import createApp from './server/app'

const router = require('koa-router')()
router.get('/static/*', async function (ctx, next) {
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

// server ====================================
const app = createApp({
  debug: true,
  engine: 'tingodb'
})

app.use(router.routes())

app.listen(5000)

