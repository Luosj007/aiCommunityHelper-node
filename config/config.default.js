'use strict';

/** @type Egg.EggAppConfig */
module.exports = appInfo => {
  const config = exports = {};

  // 用于生成Cookie的密钥，必须设置
  config.keys = appInfo.name + '_1734132560965_1234';

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

  // ========== 仅保留cors配置（删除 config.middleware = ['cors']） ==========
  config.cors = {
    origin: '*', // 开发环境允许所有来源
    allowMethods: 'GET,POST,PUT,DELETE,OPTIONS', // 允许POST/OPTIONS等方法
    credentials: true, 
  };

  // ========== CSRF配置保留不变 ==========
  config.security = {
    csrf: {
      ignore: ctx => ctx.path.includes('/miniprogram/'), // 忽略小程序接口CSRF检查
    },
  };

  return config;
};