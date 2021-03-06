'use strict';

const BaseController = require('./base.js');
const svgCaptcha = require('svg-captcha');
const fse = require('fs-extra');
const path = require('path');

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
    // /public/hash/(hash-index)
    const { ctx } = this;
    const file = ctx.request.files[0];
    const { name, hash } = ctx.request.body;

    const chunkPath = path.resolve(this.config.UPLOAD_DIR, hash);
    // const filePath = path.resolve() // 文件最终存储的位置，合并之后
    // const targetDir = path.resovle
    if (!fse.existsSync(chunkPath)) {
      await fse.mkdir(chunkPath);
    }

    await fse.move(file.filepath, `${chunkPath}/${name}`);

    // await fse.move(file.filepath, this.config.UPLOAD_DIR + `/${file.filename}`);
    this.message('切片上传成功！');
    // this.success({
    //   url: `/public/${file.filename}`,
    // });
  }
  // 文件合并
  async mergefile() {
    const { ext, size, hash } = this.ctx.request.body;
    const filePath = path.resolve(this.config.UPLOAD_DIR, `${hash}.${ext}`);
    await this.ctx.service.tools.mergeFile(filePath, hash, size);
    this.success({
      url: `/public/${hash}.${ext}`,
    });
  }
  // 文件查找
  async checkfile() {
    const { ctx } = this;
    const { ext, hash } = ctx.request.body;
    const filePath = path.resolve(this.config.UPLOAD_DIR, `${hash}.${ext}`);

    let uploaded = false;
    let uploadedList = [];

    if (fse.existsSync(filePath)) {
      // 文件存在
      uploaded = true;
    } else {
      // 文件不存在
      uploadedList = await this.getUploadedList(path.resolve(this.config.UPLOAD_DIR, hash));
    }
    this.success({
      uploaded,
      uploadedList,
    });
  }

  async getUploadedList(dirPath) {
    return fse.existsSync(dirPath)
      ? (await fse.readdir(dirPath)).filter(name => name[0] !== '.')
      : [];
  }
}

module.exports = HomeController;
