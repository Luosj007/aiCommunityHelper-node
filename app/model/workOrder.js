'use strict';

module.exports = app => {
  const { INTEGER, STRING, TEXT, DATE } = app.Sequelize;

  // 严格对应数据库work_order表字段
  const WorkOrder = app.model.define('work_order', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: '工单ID（主键，自增）',
    },
    orderNo: {
      type: STRING(50),
      allowNull: false,
      comment: '工单编号',
    },
    status: {
      type: STRING(20),
      allowNull: false,
      comment: '状态标识（pending=待处理/process=处理中/done=已完成）',
    },
    statusText: {
      type: STRING(20),
      allowNull: false,
      comment: '状态展示文本',
    },
    content: {
      type: TEXT,
      allowNull: false,
      comment: '报修内容',
    },
    time: {
      type: DATE,
      allowNull: false,
      comment: '工单提交时间',
    },
  }, {
    comment: '用户报修工单表',
    // 核心配置：开启后，模型驼峰属性 → 数据库下划线字段
    underscored: true,
    // 自动维护时间戳（模型里是createdAt/updatedAt → 数据库里是created_at/updated_at）
    timestamps: true,
    // 禁用软删除（可选）
    paranoid: false,
  });

  return WorkOrder;
};
