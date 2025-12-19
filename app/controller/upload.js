'use strict';

const Controller = require('egg').Controller;
const path = require('path');
const fs = require('fs');
const pump = require('pump');

class UploadController extends Controller {
  async uploadImage() {
    const { ctx, app } = this;

    let stream;
    try {
      // ✅ Egg 官方推荐写法
      stream = await ctx.getFileStream();
    } catch (err) {
      ctx.body = { code: 400, msg: '请选择要上传的文件' };
      return;
    }

    // 文件后缀
    const ext = path.extname(stream.filename);
    // 生成文件名
    const filename = `${Date.now()}-${Math.floor(Math.random() * 10000)}${ext}`;

    // 保存路径
    const targetPath = path.join(
      app.baseDir,
      'app/public/service',
      filename
    );

    // 写入文件
    const writeStream = fs.createWriteStream(targetPath);
    await pump(stream, writeStream);

    // 生成访问 URL
    const url =  `/public/service/${filename}`;

    ctx.body = {
      code: 200,
      msg: '上传成功',
      data: {
        url,
      },
    };
  }
}

module.exports = UploadController;
