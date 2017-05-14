import Router from 'koa-router'
import body from 'koa-bodyparser'
import exception from '../middlewares/exception'
import { getPageList, insert, insertOrUpdate, remove } from '../models/data'
import { getOne as getSchema } from '../models/schemas'
import faker from '../utils/faker'
import { nextSequence } from '../utils/objectId'

const router = new Router()
router.use(exception)

const DB = 'data'

router.get('/data/:schema/:page/:size', async (ctx) => {
  const { schema, page = 1, size = 20 } = ctx.params
  const data = await getPageList(
    ctx.db(DB).collection(schema),
    ctx.query,
    parseInt(page, 10),
    parseInt(size, 10),
  )
  ctx.Render.success(data)
})

router.post('/data/:schema', body(), async (ctx) => {
  let data = ctx.request.body
  const { schema } = ctx.params

  data = await insertOrUpdate(ctx.db(DB), schema, data)

  ctx.Render.success(data[0])
})

router.del('/data/:schema', body(), async (ctx) => {
  const query = ctx.request.body
  const col = ctx.db(DB).collection(ctx.params.schema)
  const count = await remove(col, query._id)
  ctx.Render.success(count)
})

router.del('/data/:schema/all', body(), async (ctx) => {
  const col = ctx.db(DB).collection(ctx.params.schema)
  const count = await remove(col, {})
  ctx.Render.success(count)
})

router.post('/data/:code/mockcreate/:count', async (ctx) => {
  const { code, count } = ctx.params
  const schema = await getSchema(ctx.db(), { code })
  if (!schema) {
    ctx.Render.fail('schema not found.')
    return
  }

  const data = []

  for (let i = 0; i < parseInt(count || 10, 10); i++) {
    const model = await faker(schema.fields, ctx.db(DB), getPageList)
    model._id = await nextSequence(code)
    data.push(model)
  }

  insert(ctx.db(DB).collection(code), data)
  ctx.Render.success('')
})

router.get('/data/:code/getmock', async (ctx) => {
  const { code } = ctx.params

  const schema = await getSchema(ctx.db(), { code })
  if (!schema) {
    ctx.Render.fail('schema not found.')
    return
  }

  const data = await faker(schema.fields, ctx.db(DB), getPageList)
  ctx.Render.success(data)
})

export default router
