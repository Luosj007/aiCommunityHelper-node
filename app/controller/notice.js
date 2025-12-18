const { Controller } = require('egg');

// 抽离校验规则（对齐WorkOrderController的规则格式）
const listRules = {
  page: { type: 'int', required: false, default: 1, min: 1 },
  size: { type: 'int', required: false, default: 10, min: 1, max: 50 },
};

const detailRules = {
  id: {
    type: 'int',
    required: true,
    min: 1,
    convertType: 'int',
  },
};

const createRules = {
  title: { type: 'string', required: true, max: 200 },
  content: { type: 'string', required: true, min: 1 },
};

const updateRules = {
  title: { type: 'string', required: false, max: 200 },
  content: { type: 'string', required: false, min: 1 },
};

class NoticeController extends Controller {
  // 获取通知列表（小程序端）
  async list() {
    const { ctx } = this;
    try {
      // 显式处理参数（对齐WorkOrder的参数转换逻辑）
      const { page, size } = ctx.request.query;
      const params = {
        page: page ? Number(page) : undefined,
        size: size ? Number(size) : undefined,
      };
      // 校验参数
      ctx.validate(listRules, params);
      // 调用服务层
      const result = await ctx.service.notice.findAll({
        page: params.page || 1,
        size: params.size || 10,
      });
      // 统一响应格式（对齐WorkOrder）
      ctx.body = { code: 200, msg: '查询成功', data: result };
    } catch (err) {
      // 统一错误捕获（参数错误/业务错误）
      ctx.body = { code: 422, msg: err.message || '获取通知列表失败' };
    }
  }

  // 获取通知详情（小程序+管理端）
  async detail() {
    const { ctx } = this;
    try {
      // 显式处理路径参数id（转Number）
      const { id } = ctx.params;
      const params = {
        id: id ? Number(id) : undefined,
      };
      // 校验参数
      ctx.validate(detailRules, params);
      // 调用服务层
      const notice = await ctx.service.notice.findById(params.id);
      if (!notice) {
        ctx.body = { code: 404, msg: '通知不存在' };
        return;
      }
      ctx.body = { code: 200, msg: '查询成功', data: notice };
    } catch (err) {
      ctx.body = { code: 422, msg: err.message || '获取通知详情失败' };
    }
  }

  // 创建通知（管理端）
  async create() {
    const { ctx } = this;
    try {
      // 显式解构参数（对齐WorkOrder的create写法）
      const { title, content } = ctx.request.body;
      const params = { title, content };
      // 校验参数（核心：对齐WorkOrder的校验逻辑）
      ctx.validate(createRules, params);
      // 调用服务层创建通知
      const newNotice = await ctx.service.notice.create(params);
      // 统一响应格式（成功用200，对齐WorkOrder的create响应）
      ctx.body = { code: 200, msg: '通知创建成功', data: newNotice };
    } catch (err) {
      // 捕获校验错误/业务错误
      ctx.body = { code: 422, msg: err.message || '创建通知失败' };
    }
  }

  // 更新通知（仅管理端）
  async update() {
    const { ctx } = this;
    try {
      // 1. 校验ID是否存在（路径参数）
      const { id } = ctx.params;
      if (!id) {
        ctx.body = { code: 422, msg: '缺少通知ID' };
        return;
      }
      const noticeId = Number(id);
      const notice = await ctx.service.notice.findById(noticeId);
      if (!notice) {
        ctx.body = { code: 404, msg: '通知不存在' };
        return;
      }

      // 2. 解构更新参数+校验
      const { title, time, content } = ctx.request.body;
      const params = { title, content };
      ctx.validate(updateRules, params);

      // 3. 调用服务层更新
      const updatedNotice = await ctx.service.notice.update(noticeId, params);
      ctx.body = { code: 200, msg: '通知更新成功', data: updatedNotice };
    } catch (err) {
      ctx.body = { code: 422, msg: err.message || '更新通知失败' };
    }
  }

  // 删除通知（仅管理端）
  async destroy() {
    const { ctx } = this;
    try {
      // 参考WorkOrder的destroy写法
      const { id } = ctx.params;
      if (!id) {
        ctx.body = { code: 422, msg: '缺少通知ID' };
        return;
      }
      const noticeId = Number(id);
      // 校验通知是否存在
      const notice = await ctx.service.notice.findById(noticeId);
      if (!notice) {
        ctx.body = { code: 404, msg: '通知不存在' };
        return;
      }
      // 调用服务层删除
      await ctx.service.notice.destroy(noticeId);
      ctx.body = { code: 200, msg: '通知删除成功' };
    } catch (err) {
      ctx.body = { code: 422, msg: err.message || '删除通知失败' };
    }
  }
}

module.exports = NoticeController;
