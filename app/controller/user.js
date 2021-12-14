/* eslint-disable */
'use strict';

const BaseController = require('./base.js');
const md5 = require('md5');
const HashSalt = ":zeng@good!@123";
const jwt = require('jsonwebtoken')

const createRules = {
  email: { type: 'string' },
  nickname: { type: 'string' },
  passwd: { type: 'string' },
  captcha: { type: 'string' },
};

class UserController extends BaseController {
  async login() {
    // this.success('token')
    const {ctx, app} = this;
    const { email, passwd, captcha, emailcode } = ctx.request.body;

    // 验证码校验
    if (emailcode !== ctx.session.emailcode) {
      return this.error('邮箱验证码错误');
    }
    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      return this.error('验证码错误');
    }
    const user = await ctx.model.User.findOne({
      email,
      passwd: md5(passwd + HashSalt)
    })

    if (!user) {
      return this.error('用户密码错误')
    }
    // 用户信息加密成token返回
    const token = jwt.sign({
      _id: user._id,
      email,
    }, app.config.jwt.secret, {
      expiresIn: '1h'
    })
    this.success({token,email,nickname:user.nickname})
   }
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
      return this.error('验证码错误');
    }
      // this.success({ name: 'kkb' });
      // 校验用户是否重复
    if (await this.checkEmail(email)) {
      return this.error('邮箱重复了')
    }

    const ret = await ctx.model.User.create({
      email,
      nickname,
      passwd: md5(passwd+HashSalt)
    })
    if (ret.id) {
      this.message('注册成功')
    }
  }
  async checkEmail(email) {
    const user = await this.ctx.model.User.findOne({email});
    return user;
  }
  async verify() { }
  async info() {
    const {ctx} = this
    // 还不知道哪个邮件，需要从token里读取
    // 有些接口需要从token里读数据
    const {email} = ctx.state
    const user = await this.checkEmail(email)
    this.success(user)
  }
}

module.exports = UserController;
