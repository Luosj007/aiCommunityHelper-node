const { Service } = require('egg');

class ServiceService extends Service {
  // 查询服务列表（支持分页，小程序/管理端都返回所有字段）
  async findAll({ page, size }) {
    const offset = (page - 1) * size;
    const { rows: list, count: total } = await this.ctx.model.Service.findAndCountAll({
      limit: size,
      offset,
      // 关键修改：去掉字段过滤，无论是否管理端，都返回所有字段
      attributes: null,
    });
    return { list, total, page, size };
  }

  // 根据ID查询详情（默认返回所有字段，满足你“按id渲染全量数据”的需求）
  async findById(id) {
    return this.ctx.model.Service.findByPk(id);
  }

  // 创建服务
  async create(data) {
    return this.ctx.model.Service.create(data);
  }

  // 更新服务
  async update(id, data) {
    const service = await this.findById(id);
    if(!service) return null;
    return service.update(data);
  }

  // 删除服务
  async destroy(id) {
    const service = await this.findById(id);
    if (!service) return false;
    await service.destroy();
    return true;
  }
}

module.exports = ServiceService;
