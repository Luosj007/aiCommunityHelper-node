'use strict';

/** @type Egg.EggAppConfig */
module.exports = appInfo => {
  const config = exports = {};

  // 用于生成Cookie的密钥，必须设置
  config.keys = appInfo.name + '_1734132560965_1234';

  // ========== 新增：注册全局中间件（核心！） ==========
  config.middleware = ['error', 'auth']; // error放最前面，捕获所有错误；auth按需在路由调用
  // 可选：给auth中间件配置忽略路径（登录接口不校验）
  config.auth = {
    ignore: [
      '/admin/login', 
      '/miniprogram/login',
      '/admin/create-admin'
    ],
  };

  // 数据库配置（保留不变）
  config.sequelize = {
    dialect: 'mysql', 
    host: 'localhost', 
    port: 3306, 
    database: 'ai_community_helper', 
    username: 'root', 
    password: '1234', 
    define: {
      timestamps: true, 
      underscored: true, 
      freezeTableName: true, 
    },
    sync: {
      force: false, 
    },
    timezone: '+08:00', 
  };

  config.jwt = {
    secret: process.env.JWT_SECRET || 'default_jwt_secret_32bit', // 加默认值，避免.env没配置时报错
  };

  // ========== cors配置保留，补充细节 ==========
  config.cors = {
    origin: '*', // 开发环境允许所有来源
    allowMethods: 'GET,POST,PUT,DELETE,OPTIONS', 
    credentials: true, 
  };

  // ========== CSRF配置优化 ==========
  config.security = {
    csrf: {
      // 同时忽略后台登录接口，避免OPTIONS预检报错
      ignore: ctx => ctx.path.includes('/miniprogram/') 
                  || ctx.path.includes('/admin/login') 
                  || ctx.path.includes('/admin/create-admin'), 
    },
  };

  return config;
};