import { error } from '../utils/logger'

export default async function (ctx, next) {
  try {
    await next()
  } catch (e) {
    ctx.body = {
      success: false,
      msg: e.message
    }

    const str = `${ctx.method} ${ctx.url} - ${e.message}`
    error(str)
  }
}
