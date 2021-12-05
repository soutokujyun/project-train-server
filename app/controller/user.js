'use strict';

const BaseController = require('./base.js');

const createRules = {
    email: { type: "string" },
    nickname: { type: "string" },
    passwd: { type: "string" },
    captcha: { type: "string" }
}

class UserController extends BaseController {
    async login() { }
    async register() {
        const { ctx } = this
        try {
            // 检验传递参数
            this.validate(createRules)
        } catch (e) {
            return this.error('参数校验失败', -1, e.errors)
        }

        const { email, passwd, captcha, nickname } = ctx.request.body;

        this.success({ name: 'kkb' })
    }
    async verify() { }
    async info() { }
}

module.exports = UserController;