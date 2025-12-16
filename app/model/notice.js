'use strict';

module.exports = app => {
  const { INTEGER, STRING, TEXT } = app.Sequelize;

  // 通知表模型（与实际数据库表字段完全对应）
  const Notice = app.model.define('notice', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: '通知ID',
    },
    title: {
      type: STRING(200),
      allowNull: false,
      comment: '通知标题',
    },
    time: {
      type: STRING(50),
      allowNull: false,
      comment: '通知发布时间（展示用）',
    },
    content: {
      type: TEXT,
      allowNull: false,
      comment: '通知详细内容',
    },
  }, {
    comment: '系统通知表',
    // 核心配置：开启后，模型驼峰属性 → 数据库下划线字段
    underscored: true,
    // 自动维护时间戳（模型里是createdAt/updatedAt → 数据库里是created_at/updated_at）
    timestamps: true,
    // 禁用软删除（可选）
    paranoid: false,
  });

  return Notice;
};
