import Router from 'koa-router'
import body from 'koa-bodyparser'
import exception from '../middlewares/exception'
import objectId from '../utils/objectId'
import { getPageList, insert, insertOrUpdate, remove } from '../models/data'
import { getOne as getSchema } from '../models/schemas'
import faker from '../utils/faker'

const router = new Router()
router.use(exception)

const DB = 'data'

router.get('/data/:schema/:page/:size', async function (ctx, next) {
  const { schema, page = 1, size = 20 } = ctx.params
  const data = await getPageList(
    ctx.db(DB).collection(schema),
    ctx.query,
    parseInt(page),
    parseInt(size)
  )
  ctx.Render.success(data)
})

router.post('/data/:schema', body(), async function (ctx, next) {
  let data = ctx.request.body
  const { schema } = ctx.params
  const col = ctx.db(DB).collection(schema)

  data = await insertOrUpdate(col, data)

  ctx.Render.success(data[0])
})

router.del('/data/:schema', body(), async function (ctx, next) {
  const query = ctx.request.body
  const col = ctx.db(DB).collection(ctx.params.schema)
  let count = await remove(col, { _id: objectId(query._id) })
  ctx.Render.success(count)
})

router.del('/data/:schema/all', body(), async function (ctx, next) {
  const col = ctx.db(DB).collection(ctx.params.schema)
  let count = await remove(col, {})
  ctx.Render.success(count)
})

router.post('/data/:code/mockcreate/:count', async function (ctx, next) {
  let { code, count } = ctx.params
  const schema = await getSchema(ctx.db(), { code })
  if (!schema) {
    ctx.Render.fail('schema not found.')
    return
  }

  let data = []
  count = parseInt(count)
  while (count--) {
    data.push(await faker(schema.fields, ctx.db(DB), getPageList))
  }

  insert(ctx.db(DB).collection(code), data)
  ctx.Render.success('')
})

router.get('/data/:code/getmock', async (ctx, next) => {
  let { code } = ctx.params

  const schema = await getSchema(ctx.db(), { code })
  if (!schema) {
    ctx.Render.fail('schema not found.')
    return
  }

  let data = await faker(schema.fields, ctx.db(DB), getPageList)
  ctx.Render.success(data)
})

export default router
