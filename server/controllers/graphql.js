import Router from 'koa-router'
import body from 'koa-bodyparser'
import { graphql } from 'graphql'
import getSchema from '../graphql'
import { getAll } from '../models/schemas'

const router = new Router()

router.get('/graphql/:query', async function (ctx, next) {
  const { query } = ctx.params
  const schemas = await getAll(ctx.db())
  ctx.body = await graphql(getSchema(ctx.db('data'), schemas), query)
})

router.post('/graphql', body(), async function (ctx, next) {
  const body = ctx.request.body
  const schemas = await getAll(ctx.db())
  ctx.body = await graphql(
    getSchema(ctx.db('data'), schemas),
    body.query,
    null,
    null,
    body.variables
  )
})

export default router
