import Router from 'koa-router'
import schemas from './controllers/schemas'

const router = new Router()

router.get('/', async (ctx) => {
  await ctx.render('index.html')
})

router.use(schemas.routes())

export default router
