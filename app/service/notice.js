const { Service } = require('egg');

class NoticeService extends Service {
  // 查询通知列表（分页+按创建时间倒序）
  async findAll({ page, size }) {
    const offset = (page - 1) * size;
    const { rows: list, count: total } = await this.ctx.model.Notice.findAndCountAll({
      limit: size,
      offset,
      order: [['created_at', 'DESC']], // 按数据库的created_at倒序（最新通知在前）
      attributes: null,
    });

    return { list, total, page, size };
  }

  // 根据ID查询详情
  async findById(id) {
    return this.ctx.model.Notice.findByPk(id);
  }

  // 创建通知
  async create(data) {
    return this.ctx.model.Notice.create(data);
  }

  // 更新通知
  async update(id, data) {
    const notice = await this.findById(id);
    if (!notice) return null;
    return notice.update(data);
  }

  // 删除通知
  async destroy(id) {
    const notice = await this.findById(id);
    if (!notice) return false;
    await notice.destroy();
    return true;
  }
}

module.exports = NoticeService;