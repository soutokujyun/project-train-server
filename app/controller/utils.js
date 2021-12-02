'use strict';

const Controller = require('egg').Controller;
const svgCaptcha = require('svg-captcha');

class HomeController extends Controller {
  async captcha() {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 150,
      height: 50,
      noise: 3,
    });
    this.ctx.session.captcha = captcha.text;
    this.ctx.response.type = 'image/svg+xml';
    this.ctx.body = captcha.data;
  }
}

module.exports = HomeController;
