const { Service } = require('egg');

class WorkOrderService extends Service {
  // 工具函数：下划线转驼峰（解决参数名映射问题）
  underscoreToCamel(str) {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  // 工具函数：递归转换对象的key（下划线→驼峰）
  transformParams(params) {
    const result = {};
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        const camelKey = this.underscoreToCamel(key);
        result[camelKey] = params[key];
      }
    }
    return result;
  }

  // 查询工单列表（分页+按time倒序，两端共用）
  async findAll({ page, size }) {
    const offset = (page - 1) * size;
    const { rows: list, count: total } = await this.ctx.model.WorkOrder.findAndCountAll({
      limit: Number(size),
      offset: Number(offset),
      order: [['time', 'DESC']], // 按提交时间倒序
      attributes: null, // 返回所有字段
    });
    return { list, total, page: Number(page), size: Number(size) };
  }

  // 根据ID查询工单详情（两端共用）
  async findById(id) {
    return this.ctx.model.WorkOrder.findByPk(id);
  }

  // 新增工单（小程序端+管理端可用，小程序核心功能）
  async create(workOrderData) {
    // 核心修复：将前端下划线参数转驼峰（匹配模型字段）
    const camelData = this.transformParams(workOrderData);
    // 自动填充created_at/updated_at（Sequelize自动处理）
    return this.ctx.model.WorkOrder.create(camelData);
  }

  // 更新工单（仅管理端）
  async update(id, updateData) {
    const workOrder = await this.findById(id);
    if (!workOrder) return null;
    // 修复：更新参数也需要转驼峰
    const camelUpdateData = this.transformParams(updateData);
    // updated_at会自动更新
    return workOrder.update(camelUpdateData);
  }

  // 删除工单（仅管理端）
  async destroy(id) {
    const workOrder = await this.findById(id);
    if (!workOrder) return false;
    await workOrder.destroy();
    return true;
  }
}

module.exports = WorkOrderService;