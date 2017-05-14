export default async function (ctx, next) {
  ctx.Render = {
    success(data, msg) {
      ctx.body = {
        data,
      }
      if (msg) {
        ctx.body.msg = msg
      }
    },

    fail(err) {
      ctx.body = {
        error: err,
      }
    },

    notFound() {
      ctx.body = {
        error: '请求的资源不存在',
      }
    },

    noAuth() {
      ctx.body = {
        error: '没有权限',
      }
      ctx.response.status = 401
    },

    expired() {
      ctx.body = {
        error: '登录已过期',
      }
      ctx.response.status = 401
    },
  }

  await next()
}
