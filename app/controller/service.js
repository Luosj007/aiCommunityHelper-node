const { Controller } = require('egg');

// 抽离校验规则（完全对齐WorkOrderController的规则格式）
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

// 新增服务的校验规则（补全所有必填字段）
const createRules = {
  img: { type: 'string', required: true },
  name: { type: 'string', required: true, max: 50 },
  desc: { type: 'string', required: true, max: 100 },
  time: { type: 'string', required: true, max: 50 },
  distance: { type: 'string', required: true, max: 20 },
  phone: { type: 'string', required: true, max: 20 },
  content: { type: 'string', required: true, min: 1 },
};

// 更新服务的校验规则（所有字段可选，对齐创建规则的字段范围）
const updateRules = {
  img: { type: 'string', required: false },
  name: { type: 'string', required: false, max: 50 },
  desc: { type: 'string', required: false, max: 100 },
  time: { type: 'string', required: false, max: 50 },
  distance: { type: 'string', required: false, max: 20 },
  phone: { type: 'string', required: false, max: 20 },
  content: { type: 'string', required: false, min: 1 },
};

class ServiceController extends Controller {
  // 获取服务列表（两端共用）
  async list() {
    const { ctx } = this;
    try {
      // 显式处理参数（类型转换+构造校验参数）
      const { page, size } = ctx.request.query;
      const params = {
        page: page ? Number(page) : undefined,
        size: size ? Number(size) : undefined,
      };
      // 校验分页参数
      ctx.validate(listRules, params);
      // 调用服务层（保留原业务逻辑）
      const services = await ctx.service.service.findAll({
        page: params.page || 1,
        size: params.size || 10,
        // isAdmin: Boolean(isAdmin), // 保留原注释，不改动业务逻辑
      });
      // 统一响应格式
      ctx.body = { code: 200, msg: '查询成功', data: services };
    } catch (err) {
      // 统一错误捕获
      ctx.body = { code: 422, msg: err.message || '获取服务列表失败' };
    }
  }

  // 获取服务详情（两端共用）
  async detail() {
    const { ctx } = this;
    try {
      // 显式处理路径参数ID（转Number+构造校验参数）
      const { id } = ctx.params;
      const params = {
        id: id ? Number(id) : undefined,
      };
      // 校验ID参数
      ctx.validate(detailRules, params);
      // 调用服务层查询详情
      const service = await ctx.service.service.findById(params.id);
      if (!service) {
        ctx.body = { code: 404, msg: '服务不存在' };
        return;
      }
      // 统一响应格式
      ctx.body = { code: 200, msg: '查询成功', data: service };
    } catch (err) {
      ctx.body = { code: 422, msg: err.message || '获取服务详情失败' };
    }
  }

  // 新增服务（仅管理端）
  async create() {
    const { ctx } = this;
    try {
      // 显式解构参数（仅保留需要校验的字段）
      const { img, name, desc, time, distance, phone, content } = ctx.request.body;
      const params = { img, name, desc, time, distance, phone, content };
      // 校验新增参数
      ctx.validate(createRules, params);
      // 调用服务层创建服务
      const newService = await ctx.service.service.create(params);
      // 统一响应格式（成功用200，对齐工单/通知规范）
      ctx.body = { code: 200, msg: '服务创建成功', data: newService };
    } catch (err) {
      ctx.body = { code: 422, msg: err.message || '创建服务失败' };
    }
  }

  // 更新服务（仅管理端）
  async update() {
    const { ctx } = this;
    try {
      // 1. 校验并转换ID
      const { id } = ctx.params;
      if (!id) {
        ctx.body = { code: 422, msg: '缺少服务ID' };
        return;
      }
      const serviceId = Number(id);

      // 2. 校验服务是否存在
      const service = await ctx.service.service.findById(serviceId);
      if (!service) {
        ctx.body = { code: 404, msg: '服务不存在' };
        return;
      }

      // 3. 解构更新参数+校验
      const { img, name, desc, time, distance, phone, content } = ctx.request.body;
      const params = { img, name, desc, time, distance, phone, content };
      ctx.validate(updateRules, params);

      // 4. 调用服务层更新
      const updatedService = await ctx.service.service.update(serviceId, params);
      ctx.body = { code: 200, msg: '服务更新成功', data: updatedService };
    } catch (err) {
      ctx.body = { code: 422, msg: err.message || '更新服务失败' };
    }
  }

  // 删除服务（仅管理端）
  async destroy() {
    const { ctx } = this;
    try {
      // 1. 校验ID是否存在
      const { id } = ctx.params;
      if (!id) {
        ctx.body = { code: 422, msg: '缺少服务ID' };
        return;
      }
      const serviceId = Number(id);

      // 2. 校验服务是否存在
      const service = await ctx.service.service.findById(serviceId);
      if (!service) {
        ctx.body = { code: 404, msg: '服务不存在' };
        return;
      }

      // 3. 调用服务层删除
      await ctx.service.service.destroy(serviceId);
      ctx.body = { code: 200, msg: '服务删除成功' };
    } catch (err) {
      ctx.body = { code: 422, msg: err.message || '删除服务失败' };
    }
  }
}

module.exports = ServiceController;
