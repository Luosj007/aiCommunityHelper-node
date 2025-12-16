const { Controller } = require('egg');

// 校验规则
const adminLoginRules = {
  username: { type: 'string', required: true, max: 50 },
  password: { type: 'string', required: true, min: 6 },
};
const wxLoginRules = {
  code: { type: 'string', required: true },
  nickName: { type: 'string', required: true },
  avatarUrl: { type: 'string', required: true },
};

class LoginController extends Controller {
  
  // ========== 1. 后台管理员登录接口 ==========
  async adminLogin() {
    const { ctx } = this;
    try {
      // 1. 校验参数
      const params = ctx.request.body;
      ctx.validate(adminLoginRules, params);
      // 2. 调用服务层
      const result = await ctx.service.login.adminLogin(params);
      // 3. 成功响应
      ctx.body = { code: 200, msg: '管理员登录成功', data: result };
    } catch (err) {
      ctx.body = { code: 401, msg: err.message || '管理员登录失败' };
    }
  }

  // 新增：创建/重置管理员账号
  async createAdmin() {
    const { ctx } = this;
    try {
      const { username, password } = ctx.request.body;
      // 参数校验
      ctx.validate({
        username: { type: 'string', required: true, max: 50 },
        password: { type: 'string', required: true, min: 6 },
      });

      // 调用服务层创建管理员
      const result = await ctx.service.login.createAdmin({ username, password });
      ctx.body = { code: 200, msg: '管理员创建/重置成功', data: result };
    } catch (err) {
      ctx.body = { code: 400, msg: err.message || '创建管理员失败' };
    }
  }

  // ========== 2. 小程序微信登录接口 ==========
  async wxLogin() {
    const { ctx } = this;
    try {
      // 1. 校验参数
      const params = ctx.request.body;
      ctx.validate(wxLoginRules, params);

      // 2. 调用服务层
      const result = await ctx.service.login.wxLogin(params);

      // 3. 成功响应
      ctx.body = { code: 200, msg: '微信登录成功', data: result };
    } catch (err) {
      ctx.body = { code: 401, msg: err.message || '微信登录失败' };
    }
  }

  // ========== 通用：获取当前登录用户信息 ==========
  async getCurrentUser() {
    const { ctx } = this;
    try {
      const user = ctx.state.user; // 由auth中间件解析token后存入
      if (!user) throw new Error('未登录');

      ctx.body = { code: 200, msg: '查询成功', data: user };
    } catch (err) {
      ctx.body = { code: 401, msg: err.message || '获取用户信息失败' };
    }
  }
}

module.exports = LoginController;