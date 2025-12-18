const { Controller } = require('egg');

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
  order_no: { type: 'string', required: true, max: 50 },
  status: { type: 'string', required: true, max: 20 },
  status_text: { type: 'string', required: true, max: 20 },
  content: { type: 'string', required: true, min: 1 },
};

const updateRules = {
  order_no: { type: 'string', required: false, max: 50 },
  status: { type: 'string', required: false, max: 20 },
  status_text: { type: 'string', required: false, max: 20 },
  content: { type: 'string', required: false, min: 1 },
};

class WorkOrderController extends Controller {
  async list() {
    const { ctx } = this;
    try {
      const { page, size } = ctx.request.query;
      const params = {
        page: page ? Number(page) : undefined,
        size: size ? Number(size) : undefined,
      };
      // 校验参数
      ctx.validate(listRules, params);
      // 调用服务层
      const result = await ctx.service.workOrder.findAll({
        page: params.page,
        size: params.size,
      });
      ctx.body = { code: 200, msg: '查询成功', data: result };
    } catch (err) {
      ctx.body = { code: 422, msg: err.message || '获取工单列表失败' };
    }
  }

  async detail() {
    const { ctx } = this;
    try {
      const { id } = ctx.params;
      const params = {
        id: id ? Number(id) : undefined,
      };
      // 校验参数
      ctx.validate(detailRules, params);
      // 调用服务层
      const workOrder = await ctx.service.workOrder.findById(params.id);
      if (!workOrder) {
        ctx.body = { code: 404, msg: '工单不存在' };
        return;
      }
      ctx.body = { code: 200, msg: '查询成功', data: workOrder };
    } catch (err) {
      ctx.body = { code: 422, msg: err.message || '获取工单详情失败' };
    }
  }

  // 新增工单（小程序端核心功能，管理端也可调用）
  async create() {
    const { ctx } = this;
    try {
      // 显式解构参数（参考ArticleController的addArticleComment写法）
      const { order_no, status, status_text, content } = ctx.request.body;
      // 构造校验参数（只传需要校验的字段）
      const params = { order_no, status, status_text, content };
      // 校验参数（核心：和ArticleController的校验写法完全一致）
      ctx.validate(createRules, params);
      // 调用服务层创建工单
      const newWorkOrder = await ctx.service.workOrder.create(params);
      // 成功响应
      ctx.body = { code: 200, msg: '工单创建成功', data: newWorkOrder };
    } catch (err) {
      // 捕获所有错误（包括校验错误，直接返回错误信息）
      ctx.body = { code: 422, msg: err.message || '创建工单失败' };
    }
  }

  // 更新工单（仅管理端）
  async update() {
    const { ctx } = this;
    try {
      // 修改点2：从路径参数获取id（不是body）
      const { id } = ctx.params;
      if (!id) {
        ctx.body = { code: 422, msg: '缺少工单ID' };
        return;
      }
      const workOrderId = Number(id);
      const workOrder = await ctx.service.workOrder.findById(workOrderId);
      if (!workOrder) {
        ctx.body = { code: 404, msg: '工单不存在' };
        return;
      }      
      // 解构更新参数（注意：body中不再需要id字段）
      const { order_no, status, status_text, content } = ctx.request.body;
      const params = { order_no, status, status_text, content };
      ctx.validate(updateRules, params);
      // 调用服务层更新
      const updatedWorkOrder = await ctx.service.workOrder.update(workOrderId, params);
      ctx.body = { code: 200, msg: '工单更新成功', data: updatedWorkOrder };
    } catch (err) {
      ctx.body = { code: 422, msg: err.message || '更新工单失败' };
    }
  }

  // 删除工单（仅管理端）
  async destroy() {
    const { ctx } = this;
    try {
      // 修改点3：从路径参数获取id（不是body）
      const { id } = ctx.params;
      if (!id) {
        ctx.body = { code: 422, msg: '缺少工单ID' };
        return;
      }
      const workOrderId = Number(id);
      // 校验工单是否存在
      const workOrder = await ctx.service.workOrder.findById(workOrderId);
      if (!workOrder) {
        ctx.body = { code: 404, msg: '工单不存在' };
        return;
      }      
      // 调用服务层删除
      await ctx.service.workOrder.destroy(workOrderId);
      ctx.body = { code: 200, msg: '工单删除成功' };
    } catch (err) {
      ctx.body = { code: 422, msg: err.message || '删除工单失败' };
    }
  }
}

module.exports = WorkOrderController;