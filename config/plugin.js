'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // 启用jwt插件
  jwt: {
    enable: true,
    package: 'egg-jwt',
  },
  // 启用 egg-sequelize 插件（用于连接数据库）
  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },
  // 启用cors跨域插件
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  // 新增：启用参数验证插件
  validate: {
    enable: true,
    package: 'egg-validate',
  },
};