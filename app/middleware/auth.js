// 权限中间件：仅允许管理端访问增删改接口
module.exports = () => {
  return async (ctx, next) => {
    // 实际项目中需替换为真实的身份验证逻辑
    // 例：从请求头获取Token，验证是否为管理员
    const adminToken = ctx.get('X-Admin-Token');
    if (!adminToken || !await ctx.service.admin.verifyToken(adminToken)) {
      ctx.status = 403;
      ctx.body = { code: 403, message: '无权限操作（需管理员身份）' };
      return;
    }
    // 验证通过，继续执行后续逻辑
    await next();
  };
};
