'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  // 验证码
  router.get('/captcha', controller.utils.captcha);

  // 用户
  router.group({ name: 'user', prefix: '/user' }, router => {
    const { info, register, login, verify } = controller.user;
    router.post('/register', register);
    router.post('/info', info);
    router.post('/login', login);
    router.post('/verify', verify);
  });
};
