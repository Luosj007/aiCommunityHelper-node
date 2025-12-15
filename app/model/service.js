'use strict';

module.exports = app => {
  // 获取Sequelize的数据类型
  const { INTEGER, STRING, TEXT } = app.Sequelize;

  // 定义 `service` 表模型（对应数据库的 `service` 表）
  const Service = app.model.define('service', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: '便民服务ID',
    },
    img: {
      type: STRING(255),
      allowNull: false,
      comment: '服务图片路径',
    },
    name: {
      type: STRING(50),
      allowNull: false,
      comment: '便民服务名称',
    },
    desc: {
      type: STRING(100),
      allowNull: false,
      comment: '服务简短描述',
    },
    time: {
      type: STRING(50),
      allowNull: false,
      comment: '营业时间',
    },
    distance: {
      type: STRING(20),
      allowNull: false,
      comment: '距离小区距离',
    },
    phone: {
      type: STRING(20),
      allowNull: false,
      comment: '联系电话',
    },
    content: {
      type: TEXT,
      allowNull: false,
      comment: '服务完整介绍内容',
    },
  }, {
    // 表注释
    comment: '便民服务表',
    // 核心配置：开启后，模型驼峰属性 → 数据库下划线字段
    underscored: true,
    // 自动维护时间戳（模型里是createdAt/updatedAt → 数据库里是created_at/updated_at）
    timestamps: true,
    // 禁用软删除（可选）
    paranoid: false,
  });

  return Service;
};
