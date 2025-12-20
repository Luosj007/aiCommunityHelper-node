'use strict';

module.exports = app => {
  const { INTEGER, STRING, TEXT } = app.Sequelize;
  const Qa = app.model.define('qa', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: '问答ID',
    },
    question: {
      type: STRING(500),
      allowNull: false,
      comment: '问题内容',
    },
    answer: {
      type: TEXT,
      allowNull: false,
      comment: '答案内容',
    },
  }, {
    comment: '系统问答表',
    underscored: true, 
    timestamps: true, 
    paranoid: false, 
  });

  return Qa;
};