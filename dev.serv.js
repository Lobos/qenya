import coRequest from 'co-request'
import send from 'koa-send'
import createApp from './server/app'
import api from './server/api'

const router = require('koa-router')()

router.get('/static/*', async function (ctx, next) {
  await send(ctx, ctx.path)
})

// server ====================================
const app = createApp({
  debug: true,
  engine: 'tingodb'
})

app.use(router.routes())

app.listen(5000, () => {
  console.log('hydra server running on http://localhost:5000')
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
