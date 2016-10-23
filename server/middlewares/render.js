export default async function (ctx, next) {
  ctx.Render = {
    success (data, msg) {
      ctx.body = {
        success: true,
        model: data
      }
      if (msg) {
        ctx.body.msg = msg
      }
    },

    fail (err) {
      ctx.body = {
        success: false,
        msg: err
      }
    },

    notFound () {
      ctx.body = {
        success: false,
        msg: ctx.i18n.__('http.not_found')
      }
    },

    noAuth () {
      ctx.body = {
        success: false,
        msg: ctx.i18n.__('http.no_auth')
      }
      ctx.response.status = 401
    },

    expired () {
      ctx.body = {
        success: false,
        msg: ctx.i18n.__('login.expired')
      }
      ctx.response.status = 401
    }
  }

  await next()
}
