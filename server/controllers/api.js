import Router from 'koa-router'
import body from 'koa-bodyparser'
import { getAll, getOne, insertApi, updateApi, removeApi } from '../models/api'
import objectId from '../utils/objectId'
import exception from '../middlewares/exception'

const router = new Router()

router.use(exception)

router.get('/api', async (ctx) => {
  const data = await getAll(ctx.db())
  ctx.Render.success(data)
})

router.get('/api/:id', async (ctx) => {
  const data = await getOne(ctx.db(), { _id: objectId(ctx.params.id) })
  if (data) {
    ctx.Render.success(data)
  } else {
    ctx.Render.notFound()
  }
})

router.post('/api', body(), async (ctx) => {
  let { _id, ...data } = ctx.request.body

  const method = _id ? updateApi : insertApi
  const db = ctx.db()
  const query = { route: data.route, method: data.method }

  if (_id) {
    _id = objectId(_id)
    const old = await getOne(db, { _id })
    data = Object.assign({}, old, data)
    query._id = { $ne: objectId(_id) }
  } else {
    data.status = 1
    data.createAt = Date.now()
  }

  data.weight = parseInt(data.weight || 0, 10)

  const existed = await getOne(db, query)
  if (existed) {
    ctx.Render.fail(`路径 '${data.route}' ${data.method} 方法已经存在`)
    return
  }

  data.updateAt = Date.now()

  data = await method(db, data)

  ctx.Render.success(data[0])
})

router.post('/api/toggle', body(), async (ctx) => {
  const { _id, status } = ctx.request.body
  const db = ctx.db()
  const model = await getOne(db, { _id: objectId(_id) })
  if (!model) ctx.Render.notFound()

  model.status = status
  await updateApi(db, model)
  ctx.Render.success(1)
})

router.del('/api', body(), async (ctx) => {
  const data = ctx.request.body
  const count = await removeApi(ctx.db(), data._id)
  ctx.Render.success(count)
})

export default router
