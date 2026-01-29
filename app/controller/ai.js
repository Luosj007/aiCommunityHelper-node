'use strict';

const Controller = require('egg').Controller;

class AiController extends Controller {
  async chat() {
    const { ctx, app } = this;

    // ① 基础防御：必须有 body
    if (!ctx.request.body) {
      ctx.status = 400;
      ctx.body = { message: '请求体为空' };
      return;
    }

    // ② 兜底处理 messages（关键修复点）
    let messages;

    // 前端规范传法：messages 数组
    if (Array.isArray(ctx.request.body.messages)) {
      messages = ctx.request.body.messages;
    }
    // 前端偷懒传法：只传一句 content
    else if (typeof ctx.request.body.content === 'string') {
      messages = [
        {
          role: 'user',
          content: ctx.request.body.content
        }
      ];
    }
    // 都不符合，直接拒绝
    else {
      ctx.status = 400;
      ctx.body = {
        message: '请求参数错误，必须包含 messages 或 content'
      };
      return;
    }

    // ③ 调用 DeepSeek
    let result;
    try {
      result = await ctx.curl(
        'https://api.deepseek.com/v1/chat/completions',
        {
          method: 'POST',
          contentType: 'json',
          dataType: 'json',
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${app.config.deepseek.apiKey}`
          },
          data: {
            model: 'deepseek-chat',
            messages,
            max_tokens: 2000
          }
        }
      );
    } catch (err) {
      // ④ 网络 / 调用异常
      ctx.status = 500;
      ctx.body = {
        message: '调用 DeepSeek 接口异常',
        error: err.message
      };
      return;
    }

    // ⑤ DeepSeek 返回非 200
    if (result.status !== 200) {
      ctx.status = 500;
      ctx.body = {
        message: 'DeepSeek API 返回异常',
        detail: result.data
      };
      return;
    }

    // ⑥ 正常返回 AI 内容
    ctx.body = {
      content: result.data.choices[0].message.content
    };
  }
}

module.exports = AiController;
