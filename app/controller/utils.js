'use strict';

const BaseController = require('./base.js');
const svgCaptcha = require('svg-captcha');
const fse = require('fs-extra');

class HomeController extends BaseController {
  async captcha() {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 120,
      height: 40,
      noise: 3,
    });
    this.ctx.session.captcha = captcha.text;
    this.ctx.response.type = 'image/svg+xml';
    this.ctx.body = captcha.data;
  }

  async sendcode() {
    const { ctx } = this;
    const email = ctx.query.email;
    const code = Math.random().toString().slice(2, 6);
    console.log(code);
    ctx.session.emailcode = code;
    const subject = 'kkb验证码';
    const text = '';
    const html = `<h2>小开社区</h2><a href="www.baidu.com"><span>${code}</span></a>`;
    const hasSend = await this.service.tools.sendMail(email, subject, text, html);
    if (hasSend) {
      this.message('发送成功');
    } else {
      this.error('发送失败');
    }
  }

  // 文件上传
  async uploadfile() {
    const { ctx } = this;
    const file = ctx.request.files[0];
    // const { name } = ctx.request.body;

    // const targetDir = path.resovle
    await fse.move(file.filepath, this.config.UPLOAD_DIR + `/${file.filename}`);
    this.success({
      url: `/public/${file.filename}`,
    });
  }
}

module.exports = HomeController;
