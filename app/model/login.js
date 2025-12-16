'use strict';

module.exports = app => {
  const { INTEGER, STRING, BOOLEAN, DATE } = app.Sequelize;

  // 兼容：admin（后台管理员） + wx（小程序用户）
  const Login = app.model.define('user', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: '用户ID',
    },
    // 后台管理员字段
    username: {
      type: STRING(50),
      allowNull: true,
      unique: true,
      comment: '管理员用户名（唯一）',
    },
    password: {
      type: STRING(100),
      allowNull: true,
      comment: '管理员加密密码',
    },
    // 小程序用户字段
    openid: {
      type: STRING(100),
      allowNull: true,
      unique: true,
      comment: '微信openid（小程序用户唯一标识）',
    },
    nickName: {
      type: STRING(50),
      allowNull: true,
      comment: '小程序用户昵称',
    },
    avatarUrl: {
      type: STRING(255),
      allowNull: true,
      comment: '小程序用户头像',
    },
    // 通用字段
    role: {
      type: STRING(20),
      allowNull: false,
      defaultValue: 'wx_user', // wx_user=小程序用户，admin=管理员
      comment: '角色：wx_user/admin',
    },
    created_at: {
      type: DATE,
      allowNull: false,
      comment: '创建时间',
    },
    updated_at: {
      type: DATE,
      allowNull: false,
      comment: '更新时间',
    },
  }, {
    comment: '用户登录表（兼容小程序+后台）',
    underscored: true,
    timestamps: true,
    paranoid: false,
  });

  // 后台管理员密码加密钩子（仅创建管理员时触发）
  Login.beforeCreate(async user => {
    if (user.username && user.password) { // 只有管理员有用户名密码
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  return Login;
};
