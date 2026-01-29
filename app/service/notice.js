const { Service } = require('egg');

class NoticeService extends Service {
  async findAll({ page, size }) {
    const offset = (page - 1) * size;
    const { rows: list, count: total } = await this.ctx.model.Notice.findAndCountAll({
      limit: size,
      offset,
      order: [[ 'id', 'DESC' ]], 
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
