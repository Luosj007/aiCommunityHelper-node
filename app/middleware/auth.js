'use strict';

module.exports = () => {
  return async function auth(ctx, next) {
    // 1.放行静态资源（图片）
    if (ctx.path.startsWith('/service/')) {
      await next();
      return;
    }

    // 2.放行登录接口
    if (ctx.path === '/admin/login') {
      await next();
      return;
    }

    // 3.正常鉴权
    const token = ctx.request.header.authorization;
    if (!token) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        message: '未提供token',
        request: `${ctx.method} ${ctx.url}`,
      };
      return;
    }

    try {
      // 如果你这里有 jwt 校验逻辑，放在这里
      // const decoded = ctx.app.jwt.verify(token, ctx.app.config.jwt.secret);
      // ctx.state.user = decoded;
      await next();
    } catch (err) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        message: 'token 无效或已过期',
        request: `${ctx.method} ${ctx.url}`,
      };
    }
  };
};
