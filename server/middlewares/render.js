export default async function (ctx, next) {
  ctx.Render = {
    success (data, msg) {
      ctx.body = {
        data
      }
      if (msg) {
        ctx.body.msg = msg
      }
    },

    fail (err) {
      ctx.body = {
        error: err
      }
    },

    notFound () {
      ctx.body = {
        error: ctx.i18n.__('http.not_found')
      }
    },

    noAuth () {
      ctx.body = {
        error: ctx.i18n.__('http.no_auth')
      }
      ctx.response.status = 401
    },

    expired () {
      ctx.body = {
        error: ctx.i18n.__('login.expired')
      }
      ctx.response.status = 401
    }
  }

  await next()
}
