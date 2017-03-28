import Router from 'koa-router'
import body from 'koa-bodyparser'
import { getAll, getOne, insertApi, updateApi, removeApi } from '../models/api'
import objectId from '../utils/objectId'
import exception from '../middlewares/exception'

const router = new Router()

router.use(exception)

router.get('/api', async function (ctx, next) {
  const data = await getAll(ctx.db())
  ctx.Render.success(data)
})

router.get('/api/:id', async function (ctx, next) {
  const data = await getOne(ctx.db(), { _id: objectId(ctx.params.id) })
  data ? ctx.Render.success(data) : ctx.Render.notFound()
})

router.post('/api', body(), async function (ctx, next) {
  let data = ctx.request.body
  let method = data._id ? updateApi : insertApi
  const db = ctx.db()

  if (!data._id) {
    data.createAt = Date.now()
  } else {
    let old = await getOne(db, { _id: objectId(data._id) })
    data = Object.assign({}, old, data)
}

  const query = { path: data.path, method: data.method }
  if (data._id) {
    query._id = { $ne: objectId(data._id) }
  }
  const other = await getOne(db, query)
  if (other) {
    ctx.Render.fail(ctx.i18n.__('api.path_exist', data.path, data.method))
    // ctx.Render.fail(`path: '${data.path}' with method '${data.method}' already exists.`)
    return
  }

  data.updateAt = Date.now()

  data = await method(db, data)
  ctx.Render.success(data[0])
})

router.del('/api', body(), async function (ctx, next) {
  let data = ctx.request.body
  let count = await removeApi(ctx.db(), data._id)
  ctx.Render.success(count)
})

export default router
