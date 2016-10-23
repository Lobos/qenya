import Router from 'koa-router'
import { getAll, getOne } from '../models/schemas'

const router = new Router()

router.get('/schemas', async function (ctx, next) {
  try {
    const data = await getAll(ctx.db())
    ctx.Render.success(data)
  } catch (e) {
    ctx.Render.fail(e.message)
  }
})

router.get('/schema/:id', async function (ctx, next) {
  try {
    const data = await getOne(ctx.db(), ctx.params.id)
    ctx.Render.success(data)
  } catch (e) {
    ctx.Render.fail(e.message)
  }
})

export default router
