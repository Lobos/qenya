import Router from 'koa-router'
import schemas from './controllers/schemas'
import data from './controllers/data'
import api from './controllers/api'

const router = new Router()

router.get('/', async (ctx) => {
  await ctx.render('index.html', {
    globalData: {
    }
  })
})

router.use(schemas.routes())
router.use(data.routes())
router.use(api.routes())

export default router
