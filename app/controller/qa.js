const { Controller } = require('egg');

const listRules = {
  page: { type: 'int', required: false, default: 1, min: 1 },
  size: { type: 'int', required: false, default: 10, min: 1, max: 50 },
};

class QaController extends Controller {
  async list() {
    const { ctx } = this;
    try {
      const { page, size } = ctx.request.query;
      const params = {
        page: page ? Number(page) : undefined,
        size: size ? Number(size) : undefined,
      };
      ctx.validate(listRules, params);
      const result = await ctx.service.qa.findAll({
        page: params.page,
        size: params.size,
      });
      ctx.body = { code: 200, msg: '查询成功', data: result };
    } catch (err) {
      ctx.body = { code: 422, msg: err.message || '获取问答列表失败' };
    }
  }
}

module.exports = QaController;