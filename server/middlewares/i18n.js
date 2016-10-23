import I18n from 'i18n-2'

export default function (opts) {
  let i18n = new I18n(opts)

  return async function (ctx, next) {
    ctx.i18n = i18n
    await next()
  }
}
