const { Service } = require('egg');

class LoginService extends Service {
  // ========== 1. 后台管理员登录 ==========
  async adminLogin({ username, password }) {
    const { ctx } = this;
    const bcrypt = require('bcryptjs'); // 统一引入bcrypt

    // 1. 查询管理员
    const user = await ctx.model.Login.findOne({
      where: { username, role: 'admin' },
      attributes: [ 'id', 'username', 'password', 'role' ],
    });
    if (!user) throw new Error('管理员用户名不存在');

    // 2. 密码验证（和创建时的加密逻辑完全匹配）
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('管理员密码错误');

    // 3. 生成token（逻辑不变）
    const token = this.app.jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      this.app.config.jwt.secret,
      { expiresIn: '24h' }
    );

    return { id: user.id, username: user.username, role: user.role, token };
  }

  // 新增：创建/重置管理员（自动加密密码）
  async createAdmin({ username, password }) {
    const { ctx } = this;
    const bcrypt = require('bcryptjs');

    // 1. 加密密码（统一逻辑）
    const salt = await bcrypt.genSalt(10); // 固定盐值强度10
    const hashPassword = await bcrypt.hash(password, salt);

    // 2. 查询是否已有该管理员，有则更新，无则创建
    let user = await ctx.model.Login.findOne({ where: { username, role: 'admin' } });
    if (user) {
      // 重置密码
      await user.update({ password: hashPassword });
    } else {
      // 创建新管理员
      user = await ctx.model.Login.create({
        username,
        password: hashPassword, // 存入加密后的密码
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    return { id: user.id, username: user.username, role: user.role };
  }

  // ========== 2. 小程序微信登录 ==========
  async wxLogin({ code, nickName, avatarUrl }) {
    const { ctx, app } = this;

    // ========== 修复1：手动加载.env配置（兜底读取环境变量） ==========
    // 安装过dotenv才需要，没装先执行：npm install dotenv --save
    try {
      require('dotenv').config(); // 手动加载根目录.env文件
    } catch (err) {
      console.warn('未安装dotenv，跳过手动加载：', err.message);
    }

    // ========== 修复2：兼容多种配置读取方式（优先级：硬编码 > 环境变量 > 配置文件） ==========
    // 方式1：临时硬编码（测试用，替换为你的真实值）
    const WX_APPID = process.env.WX_APPID || '你的小程序真实AppID';
    const WX_APPSECRET = process.env.WX_APPSECRET || '你的小程序真实Secret';

    // 方式2：若用Egg配置文件（config/config.default.js），可这样读（二选一）
    // const WX_APPID = app.config.wx?.appid || process.env.WX_APPID;
    // const WX_APPSECRET = app.config.wx?.secret || process.env.WX_APPSECRET;

    // ========== 修复3：更友好的配置校验错误提示 ==========
    if (!WX_APPID || WX_APPID === '你的小程序真实AppID') {
      throw new Error('请配置有效的微信小程序AppID（检查.env文件或硬编码）');
    }
    if (!WX_APPSECRET || WX_APPSECRET === '你的小程序真实Secret') {
      throw new Error('请配置有效的微信小程序Secret（检查.env文件或硬编码）');
    }

    // ========== 原有逻辑：增强错误捕获 ==========
    let wxRes;
    try {
    // 2. 调用微信接口：code换取openid（增加超时/错误捕获）
      wxRes = await ctx.curl('https://api.weixin.qq.com/sns/jscode2session', {
        method: 'GET',
        dataType: 'json',
        timeout: 5000, // 增加超时时间（5秒）
        data: {
          appid: WX_APPID,
          secret: WX_APPSECRET,
          js_code: code,
          grant_type: 'authorization_code',
        },
      });
    } catch (err) {
      throw new Error(`调用微信接口失败：${err.message}`);
    }

    // 3. 处理微信接口错误（增强字段校验）
    // eslint-disable-next-line no-unused-vars
    const { errcode, errmsg, openid, session_key } = wxRes.data || {};
    if (errcode) {
      throw new Error(`微信登录失败【${errcode}】：${errmsg || '未知错误'}`);
    }
    if (!openid) {
      throw new Error('微信接口返回空的openid（code可能已过期/无效）');
    }

    // 4. 查询/创建小程序用户（增加数据库错误捕获）
    let user;
    try {
      user = await ctx.model.Login.findOne({ where: { openid } });
      if (!user) {
      // 新用户：创建（补充默认值，避免字段缺失）
        user = await ctx.model.Login.create({
          openid,
          nickName: nickName || '微信用户', // 兼容空昵称
          avatarUrl: avatarUrl || '/static/default-avatar.png', // 兼容空头像
          role: 'wx_user',
          created_at: new Date(),
          updated_at: new Date(),
        });
      } else {
      // 老用户：更新昵称/头像（仅当有新值时更新）
        const updateData = { updated_at: new Date() };
        if (nickName) updateData.nickName = nickName;
        if (avatarUrl) updateData.avatarUrl = avatarUrl;
        await user.update(updateData);
      }
    } catch (dbErr) {
      throw new Error(`数据库操作失败：${dbErr.message}`);
    }

    // 5. 生成小程序用户JWT token（增强token参数）
    const token = app.jwt.sign(
      {
        id: user.id,
        openid: user.openid,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 显式设置7天有效期
      },
      app.config.jwt.secret,
      { algorithm: 'HS256' } // 显式指定加密算法
    );

    // ========== 修复4：统一返回格式（对齐前端预期） ==========
    return {
      code: 200, // 新增：返回业务成功码（前端判断用）
      msg: '微信登录成功',
      data: {
        id: user.id,
        openid: user.openid,
        nickName: user.nickName,
        avatarUrl: user.avatarUrl,
        role: user.role,
        token,
      },
    };
  }

  // ========== 通用：验证token有效性 ==========
  async verifyToken(token) {
    try {
      return this.app.jwt.verify(token, this.app.config.jwt.secret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') throw new Error('token已过期');
      throw new Error('无效的token');
    }
  }
}

module.exports = LoginService;
