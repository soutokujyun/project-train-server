/* eslint-disable */
'use strict';

const BaseController = require('./base.js');


const createRules = {
  email: { type: 'string' },
  nickname: { type: 'string' },
  passwd: { type: 'string' },
  captcha: { type: 'string' },
};

class UserController extends BaseController {
  async login() { }
  async register() {
    const { ctx } = this;
    try {
      // 检验传递参数
      ctx.validate(createRules);
    } catch (e) {
      return this.error('参数校验失败', -1, e.errors);
    }

    const { email, passwd, captcha, nickname } = ctx.request.body;

    // 验证码校验
    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      this.error('验证码错误');
    } else {
      // this.success({ name: 'kkb' });
      // 校验用户是否重复
    }

  }
  async verify() { }
  async info() { }
}

module.exports = UserController;
