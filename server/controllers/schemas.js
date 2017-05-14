import Router from 'koa-router'
import body from 'koa-bodyparser'
import { getAll, getOne, insertSchema, updateSchema, removeSchema } from '../models/schemas'
import objectId from '../utils/objectId'
import exception from '../middlewares/exception'
import { clearType } from '../graphql'

const router = new Router()

router.use(exception)

router.get('/schemas', async (ctx) => {
  const data = await getAll(ctx.db())
  ctx.Render.success(data)
})

router.post('/exist', body(), async (ctx) => {
  const query = ctx.request.body
  if (query._id) query._id = { $ne: objectId(query._id) }
  else delete query._id
  const data = await getOne(ctx.db(), query)

  if (data) {
    ctx.Render.fail('schema existed')
  } else {
    ctx.Render.success(true)
  }
})

router.get('/schema/:id', async (ctx) => {
  const data = await getOne(ctx.db(), { _id: objectId(ctx.params.id) })
  if (data) {
    ctx.Render.success(data)
  } else {
    ctx.Render.notFound()
  }
})

router.post('/schema/fields', body(), async (ctx) => {
  const { _id, fields } = ctx.request.body
  const schema = await getOne(ctx.db(), { _id: objectId(_id) })
  schema.fields = fields
  schema.updateAt = Date.now()
  const data = await updateSchema(ctx.db(), schema)

  clearType()

  ctx.Render.success(data[0])
})

router.post('/schema', body(), async (ctx) => {
  let data = ctx.request.body
  const method = data._id ? updateSchema : insertSchema

  if (!data._id) {
    data.createAt = Date.now()
    data.fields = []
  } else {
    const old = await getOne(ctx.db(), { _id: objectId(data._id) })
    data = Object.assign({}, old, data)
  }
  data.updateAt = Date.now()
  data = await method(ctx.db(), data)

  clearType()

  ctx.Render.success(data[0])
})

router.del('/schema', body(), async (ctx) => {
  const data = ctx.request.body
  const count = await removeSchema(ctx.db(), data._id)
  ctx.Render.success(count)
})

export default router
