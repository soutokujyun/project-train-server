/* eslint-disable */
'use strict';

const BaseController = require('./base.js');
const md5 = require('md5');
const HashSalt = ":zeng@good!@123";

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
      if (await this.checkEmail(email)) {
        this.error('邮箱重复了')
      } else {
        const ret = await ctx.model.User.create({
          email,
          nickname,
          passwd: md5(passwd+HashSalt)
        })
        if (ret.id) {
          this.message('注册成功')
        }
      }
    }

  }
  async checkEmail(email) {
    const user = await this.ctx.model.User.findOne({email});
    return user;
  }
  async verify() { }
  async info() { }
}

module.exports = UserController;
