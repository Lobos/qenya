import { warn, info } from '../utils/logger'

export default async function (ctx, next) {
  const start = new Date()

  await next()

  const ms = new Date() - start
  const str = `${ctx.method} ${ctx.url} - ${ms}`
  if (ms > 1000) {
    warn(str)
  } else {
    info(str)
  }
}
