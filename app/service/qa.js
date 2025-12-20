const { Service } = require('egg');

class QaService extends Service {
  async findAll({ page, size }) {
    const offset = (page - 1) * size;
    const { rows: list, count: total } = await this.ctx.model.Qa.findAndCountAll({
      limit: size,
      offset,
      order: [[ 'id', 'ASC' ]],
      attributes: null, 
    });

    return { list, total, page, size };
  }
}

module.exports = QaService;