module.exports = () => {
  return async (ctx, next) => {
    try {
      const authorization = ctx.headers.authorization;
      if (!authorization) {
        ctx.throw(401, '未提供token');
      }

      const token = authorization.split(' ')[1];
      if (!token) {
        ctx.throw(401, 'token格式错误');
      }

      const decoded = ctx.app.jwt.verify(token, ctx.app.config.jwt.secret);
      ctx.state.user = decoded;
      await next();
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        ctx.throw(401, '无效的token');
      } else if (err.name === 'TokenExpiredError') {
        ctx.throw(401, 'token已过期');
      } else {
        ctx.throw(err.status || 500, err.message);
      }
    }
  };
};
