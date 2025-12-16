module.exports = () => {
  return async (ctx, next) => {
    try {
      await next();
      if (ctx.status === 404 && !ctx.body) {
        ctx.status = 404;
        ctx.body = {
          code: 404,
          message: '接口不存在',
          request: `${ctx.method} ${ctx.path}`,
        };
      }
    } catch (err) {
      ctx.app.logger.error(`[error middleware] ${err.message}`);
      ctx.status = err.status || 500;
      ctx.body = {
        code: err.status || 500,
        message: err.message || '服务器内部错误',
        request: `${ctx.method} ${ctx.path}`,
      };
    }
  };
};